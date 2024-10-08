import { CircularProgress, Tooltip, Typography, Container, Box, Alert } from "@mui/material"
import { useEffect, useReducer, useState } from "react"
import { Link, Location, useLocation } from "react-router-dom"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight"
import clsx from "clsx"
import { useExplorer } from "../../context"
import { EnvironmentMetadata, ResourceTypes, Transfer, TransferStatus } from "../../types"
import { renderNetworkIcon, renderStatusIcon } from "../../utils/renderUtils"
import {
  accountLinks,
  formatDistanceDate,
  displayStatus,
  getFormatedFee,
  renderAmountValue,
  renderFormatedConvertedAmount,
  txHashLinks,
} from "../../utils/transferHelpers"
import { useStyles } from "./styles"
import useClipboard from "./hooks/useClipboard"
import useFetchTransfer from "./hooks/useFetchTransfer"
import { DetailViewState, reducer } from "./reducer"
import useUpdateInterval from "./hooks/useUpdateInterval"
import { add, isAfter } from "date-fns"

dayjs.extend(localizedFormat)

export type LocationState = { id: string; page: number; txHash: string }

export default function DetailView() {
  const explorerContext = useExplorer()

  const { routes, explorerContextState } = explorerContext
  const { domainMetadata } = explorerContextState

  const { classes } = useStyles()

  const { state: data, pathname } = useLocation() as Location<LocationState>

  const [txHashFromPathname, setTxHashFromPathname] = useState<string>("")

  const initState: DetailViewState = {
    transferDetails: null,
    transferStatus: "none",
    clipboardMessageT1: "Copy to clipboard",
    clipboardMessageT2: "Copy to clipboard",
    delay: 5000,
    fetchingStatus: "idle",
    isLoading: "none",
    fallbackPage: 1,
  }

  useEffect(() => {
    if (data?.txHash === undefined) {
      const splitedPath = pathname.split("/")
      setTxHashFromPathname(splitedPath[splitedPath.length - 1])
    }
  }, [data, txHashFromPathname])

  const [state, dispatcher] = useReducer(reducer, initState)

  useClipboard(state, dispatcher)

  useFetchTransfer(routes, data?.txHash || txHashFromPathname, dispatcher)

  useUpdateInterval(state, dispatcher, data?.txHash || txHashFromPathname, routes)

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const renderTransferDetails = (transfer: Transfer | null) => {
    const { fromDomainId, toDomainId, resource, usdValue, deposit } = transfer as Transfer
    const fromDomainInfo = (domainMetadata as EnvironmentMetadata)[Number(fromDomainId)]
    const toDomainInfo = (domainMetadata as EnvironmentMetadata)[Number(toDomainId)]

    let { status } = transfer as Transfer
    if (deposit && deposit.timestamp && status === "pending" && isAfter(Date.now(), add(new Date(deposit.timestamp), {hours: 2}))) {
      status = "failed" as TransferStatus
    }

    const { id, type } = resource

    const fromDomainName = fromDomainInfo.renderName
    const toDomainName = toDomainInfo.renderName

    const { blockExplorerUrl: fromDomainExplorerUrl } = fromDomainInfo
    const { blockExplorerUrl: toDomainExplorerUrl } = toDomainInfo

    return (
      <Container className={classes.innerTransferDetailContainer}>
        <div className={classes.detailsContainer}>
          <div className={classes.networkContainer}>
            <span className={classes.networkIconsContainer}>
              {renderNetworkIcon(fromDomainInfo.caipId, classes)} {fromDomainName}
            </span>
            <KeyboardDoubleArrowRightIcon />
            <span className={classes.networkIconsContainer}>
              {renderNetworkIcon(toDomainInfo?.caipId, classes)} {toDomainName}
            </span>
          </div>
        </div>
        <div className={clsx(classes.detailsContainer, classes.statusPillMobile)}>
          <span className={classes.detailsInnerContentTitle}>Status:</span>
          <span className={classes.detailsInnerContent}>
            <span className={classes.statusPill}>
              {renderStatusIcon(status!, classes)}
              {displayStatus(status!)}
            </span>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Source transaction hash:</span>
          <span className={classes.detailsInnerContent}>
            <Link to={txHashLinks(fromDomainInfo.type, fromDomainExplorerUrl, transfer?.deposit?.txHash)} style={{ color: "black" }} target="_blank">
              {transfer?.deposit && transfer?.deposit?.txHash}
            </Link>
            <span
              className={classes.copyIcon}
              onClick={() => {
                void navigator.clipboard?.writeText(transfer?.deposit?.txHash!)
                dispatcher({
                  type: "set_clipboard_message_t1",
                  payload: "Copied to clipboard!",
                })
              }}
            >
              <Tooltip title={state.clipboardMessageT1} placement="top" arrow>
                <ContentCopyIcon fontSize="small" />
              </Tooltip>
            </span>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Destination transaction hash:</span>
          <span className={classes.detailsInnerContent}>
            <Link to={txHashLinks(toDomainInfo.type, toDomainExplorerUrl, transfer?.execution?.txHash)} style={{ color: "black" }} target="_blank">
              {transfer?.execution && transfer?.execution?.txHash}
            </Link>
            {transfer?.execution ? (
              <span
                className={classes.copyIcon}
                onClick={() => {
                  void navigator.clipboard?.writeText(transfer?.execution?.txHash!)
                  dispatcher({
                    type: "set_clipboard_message_t2",
                    payload: "Copied to clipboard!",
                  })
                }}
              >
                <Tooltip title={state.clipboardMessageT2} placement="top" arrow>
                  <ContentCopyIcon fontSize="small" />
                </Tooltip>
              </span>
            ) : (
              <span>Pending proposal execution</span>
            )}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Source block number:</span>
          <span className={classes.detailsInnerContent}>{transfer?.deposit?.blockNumber}</span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Created:</span>
          <span className={classes.detailsInnerContent}>
            {formatDistanceDate(transfer?.deposit?.timestamp!)} ({dayjs(transfer?.deposit?.timestamp).format("llll")})
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>From:</span>
          <span className={classes.detailsInnerContent}>
            {fromDomainExplorerUrl ? (
              <Link
                style={{
                  color: "black",
                }}
                to={accountLinks(fromDomainInfo.type, transfer?.accountId!, fromDomainExplorerUrl)}
                target="_blank"
              >
                {transfer?.accountId}
              </Link>
            ) : (
              <>{transfer?.accountId}</>
            )}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>To:</span>
          <span className={classes.detailsInnerContent}>
            {toDomainExplorerUrl ? (
              <Link
                style={{
                  color: "black",
                }}
                to={accountLinks(toDomainInfo.type, transfer?.destination!, toDomainExplorerUrl)}
                target="_blank"
              >
                {transfer?.destination}
              </Link>
            ) : (
              <>{transfer?.destination}</>
            )}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Value:</span>
          <span className={classes.detailsInnerContent}>
            <div className={classes.convertedValueContainer}>
              <span>{renderAmountValue(type as ResourceTypes, transfer?.amount!, id, explorerContextState.resourcesPerPage)}</span>
              {renderFormatedConvertedAmount(type as ResourceTypes, usdValue)}
            </div>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Fees:</span>
          <span className={classes.detailsInnerContent}>{getFormatedFee(transfer?.fee!)}</span>
        </div>
        {Array.isArray(state.transferDetails) && <br />}
      </Container>
    )
  }

  return (
    <Container>
      <Box className={classes.boxContainer}>
        {state.isLoading === "done" && Object.keys(explorerContextState.domainMetadata) && explorerContextState.resourcesPerPage.length && (
          <section className={classes.sectionContainer}>
            <span className={classes.backIcon}>
              <Link
                to={`/?page=${data?.page || state.fallbackPage}`}
                style={{
                  color: "black",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ArrowBackIcon /> Back
              </Link>
            </span>
            <Typography variant="h4" sx={{ fontSize: "24px" }}>
              Transaction Detail
            </Typography>
            <Container className={classes.transferDetailsContainer}>
              {Array.isArray(state.transferDetails)
                ? state.transferDetails.map(transfer => renderTransferDetails(transfer))
                : renderTransferDetails(state.transferDetails)}
            </Container>
          </section>
        )}
      </Box>
      {state.isLoading === "loading" && (
        <Container className={classes.circularProgress}>
          <div>
            <Alert severity="info">Loading transfer details</Alert>
            <CircularProgress />
          </div>
        </Container>
      )}
    </Container>
  )
}
