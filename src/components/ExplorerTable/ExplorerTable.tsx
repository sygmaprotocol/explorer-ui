import React from "react"
import { Table, TableHead, TableCell, TableBody, TableRow, CircularProgress } from "@mui/material"
import clsx from "clsx"
import { Link } from "react-router-dom"
import { EvmBridgeConfig, ExplorerContextState, ResourceTypes, SharedConfigDomain, Transfer } from "../../types"
import {
  getDisplayedStatuses,
  shortenAddress,
  renderNetworkIcon,
  renderStatusIcon,
  getDomainData,
  getNetworkNames,
  formatDistanceDate,
  getFormatedFee,
  formatTransferType,
  formatAmountDecimals,
  renderAmountValue,
  renderFormatedConvertedAmount,
} from "../../utils/Helpers"
import { useStyles } from "./styles"

type ExplorerTable = {
  active: boolean
  setActive: (state: boolean) => void
  chains: Array<EvmBridgeConfig>
  state: ExplorerContextState
  sharedConfig: SharedConfigDomain[] | []
}

const ExplorerTable: React.FC<ExplorerTable> = ({ state, sharedConfig }: ExplorerTable) => {
  const { classes } = useStyles()

  const renderTransferList = (transferData: Transfer[]): JSX.Element[] => {
    return transferData.map((transfer: Transfer) => {
      const { deposit, status, amount, resource, fromDomainId, toDomainId, id, resourceID, fee, usdValue } = transfer

      const { type } = resource

      const fromDomainInfo = getDomainData(fromDomainId, sharedConfig)
      const toDomainInfo = getDomainData(toDomainId, sharedConfig)

      const formatedFee = getFormatedFee(fee, fromDomainInfo!)

      const fromDomainType = fromDomainInfo?.type

      let txHash: string | undefined

      if (fromDomainType === "evm" && deposit) {
        txHash = shortenAddress(deposit?.txHash)
      } else {
        txHash = deposit?.txHash
      }

      const fromDomainName = getNetworkNames(fromDomainInfo?.chainId!)
      const toDomainName = getNetworkNames(toDomainInfo?.chainId!)

      const dateFormated = formatDistanceDate(deposit?.timestamp!)

      const amountWithFormatedDecimals = formatAmountDecimals(amount)

      return (
        <TableRow className={classes.row} key={transfer.id}>
          <TableCell className={clsx(classes.row, classes.dataRow, classes.cellRow)}>
            {txHash !== undefined ? (
              <Link className={classes.hashAnchorLink} to={`/transfer/${deposit?.txHash!}`} state={{ id: id, page: state.queryParams.page }}>
                {txHash}
              </Link>
            ) : (
              "-"
            )}
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div className={classes.accountAddress}>
              <span className={classes.statusPill}>
                {renderStatusIcon(status, classes)} {getDisplayedStatuses(status)}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div style={{ width: "100%" }}>
              <span style={{ display: "flex" }}>
                {renderNetworkIcon(fromDomainInfo?.chainId!, classes)} {fromDomainName}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div style={{ width: "100%" }}>
              <span style={{ display: "flex" }}>
                {renderNetworkIcon(toDomainInfo?.chainId!, classes)} {toDomainName}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <span>{type !== undefined ? formatTransferType(type as ResourceTypes) : "-"}</span>
            </span>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <span>{dateFormated}</span>
            </span>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <span>{formatedFee}</span>
            </span>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <div className={classes.amountContainer}>
                <span>{renderAmountValue(type as ResourceTypes, amountWithFormatedDecimals, resourceID, fromDomainInfo)}</span>
                {renderFormatedConvertedAmount(type as ResourceTypes, usdValue)}
              </div>
            </span>
          </TableCell>
        </TableRow>
      )
    })
  }

  return (
    <Table className={classes.rootTable}>
      <TableHead
        sx={{
          backgroundColor: "#DBD3C7",
          "& > tr > th": {
            fontSize: "14px",
            fontWeight: "400",
          },
        }}
      >
        <TableRow className={classes.row}>
          <TableCell sx={{ borderTopLeftRadius: "12px !important" }}>Source Tx/Extr Hash</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Fee</TableCell>
          <TableCell sx={{ borderTopRightRadius: "12px !important" }}>Value</TableCell>
        </TableRow>
      </TableHead>
      {state.isLoading === "done" && <TableBody>{renderTransferList(state.transfers)}</TableBody>}
      {state.isLoading === "loading" && (
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} align="center">
              <CircularProgress />
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  )
}

export default ExplorerTable
