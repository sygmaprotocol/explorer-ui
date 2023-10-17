import { CircularProgress, Tooltip, Typography, Container, Box } from "@mui/material"
import { useReducer } from "react"
import { Link, useLocation } from "react-router-dom"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight"
import clsx from "clsx"
import { useExplorer } from "../../context"
import { ResourceTypes, Transfer } from "../../types"
import {
  accountLinks,
  formatDistanceDate,
  getDisplayedStatuses,
  getDomainData,
  getFormatedFee,
  getNetworkNames,
  renderAmountValue,
  renderFormatedConvertedAmount,
  renderNetworkIcon,
  renderStatusIcon,
  txHashLinks,
} from "../../utils/Helpers"
import { useStyles } from "./styles"
import useClipboard from "./hooks/useClipboard"
import useFetchTransfer from "./hooks/useFetchTransfer"
import { DetailViewState, reducer } from "./reducer"
import useUpdateInterval from "./hooks/useUpdateInterval"

dayjs.extend(localizedFormat)

export default function DetailView() {
  const explorerContext = useExplorer()

  const { sharedConfig, setSharedConfig, explorerUrls, routes } = explorerContext

  const { classes } = useStyles()

  const { state: transferId } = useLocation() as { state: { id: string } }

  const initState: DetailViewState = {
    transferDetails: null,
    transferStatus: "none",
    clipboardMessageT1: "Copy to clipboard",
    clipboardMessageT2: "Copy to clipboard",
    delay: 5000,
    fetchingStatus: "idle",
  }

  const [state, dispatcher] = useReducer(reducer, initState)

  useClipboard(state, dispatcher)

  useFetchTransfer(routes, sharedConfig, setSharedConfig, transferId, dispatcher)

  useUpdateInterval(state, dispatcher, transferId, routes)

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const renderTransferDetails = (transfer: Transfer | null) => {
    const fromDomainInfo = getDomainData(transfer?.fromDomainId!, sharedConfig)
    const toDomainInfo = getDomainData(transfer?.toDomainId!, sharedConfig)

    const { resource, usdValue } = transfer as Transfer

    const { id, type } = resource

    const fromDomainName = getNetworkNames(fromDomainInfo?.chainId!)
    const toDomainName = getNetworkNames(toDomainInfo?.chainId!)

    const { id: idFromDomain } = fromDomainInfo!
    const { id: idToDomain } = toDomainInfo!

    const fromDomainExplorerUrl = explorerUrls.find(exp => exp.id === idFromDomain)
    const toDomainExplorerUrl = explorerUrls.find(exp => exp.id === idToDomain)

    return (
      <Container className={classes.innerTransferDetailContainer}>
        <div className={classes.detailsContainer}>
          <div className={classes.networkContainer}>
            <span className={classes.networkIconsContainer}>
              {renderNetworkIcon(fromDomainInfo?.chainId!, classes)} {fromDomainName}
            </span>
            <KeyboardDoubleArrowRightIcon />
            <span className={classes.networkIconsContainer}>
              {renderNetworkIcon(toDomainInfo?.chainId!, classes)} {toDomainName}
            </span>
          </div>
        </div>
        <div className={clsx(classes.detailsContainer, classes.statusPillMobile)}>
          <span className={classes.detailsInnerContentTitle}>Status:</span>
          <span className={classes.detailsInnerContent}>
            <span className={classes.statusPill}>
              {renderStatusIcon(transfer?.status!, classes)}
              {getDisplayedStatuses(transfer?.status!)}
            </span>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Source transaction hash:</span>
          <span className={classes.detailsInnerContent}>
            <Link to={txHashLinks(fromDomainInfo!.type, transfer?.deposit?.txHash!, fromDomainExplorerUrl!.url)} style={{ color: "black" }}>
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
            <Link to={txHashLinks(fromDomainInfo!.type, transfer?.execution?.txHash!, toDomainExplorerUrl!.url)} style={{ color: "black" }}>
              {transfer?.execution && transfer?.execution?.txHash}
            </Link>
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
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Source block number:</span>
          <span className={classes.detailsInnerContent}>{transfer?.deposit?.blockNumber}</span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Created:</span>
          <span className={classes.detailsInnerContent}>
            {formatDistanceDate(transfer?.timestamp!)} ({dayjs(transfer?.timestamp).format("llll")})
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
                to={accountLinks(fromDomainInfo!.type, transfer?.accountId!, fromDomainExplorerUrl.url)}
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
                to={accountLinks(toDomainInfo!.type, transfer?.destination!, toDomainExplorerUrl.url)}
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
              <span>{renderAmountValue(type as ResourceTypes, transfer?.amount!, id, fromDomainInfo)}</span>
              {renderFormatedConvertedAmount(type as ResourceTypes, usdValue)}
            </div>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Fees:</span>
          <span className={classes.detailsInnerContent}>{getFormatedFee(transfer?.fee!, fromDomainInfo!)}</span>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Box className={classes.boxContainer}>
        {state.transferStatus !== "none" ? (
          <section className={classes.sectionContainer}>
            <span className={classes.backIcon}>
              <Link
                to="/"
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
            <Container className={classes.transferDetailsContainer}>{renderTransferDetails(state.transferDetails)}</Container>
          </section>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  )
}
