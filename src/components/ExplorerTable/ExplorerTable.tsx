import React from "react"
import { Table, TableHead, TableCell, TableBody, TableRow, CircularProgress } from "@mui/material"
import clsx from "clsx"
import { Link } from "react-router-dom"
import { EnvironmentMetadata, EvmBridgeConfig, ExplorerContextState, ResourceTypes, SharedConfigDomain, Transfer } from "../../types"
import { renderNetworkIcon, renderStatusIcon } from "../../utils/renderUtils"
import {
  filterTransfers,
  formatAmountDecimals,
  formatDistanceDate,
  formatTransferType,
  displayStatus,
  getFormatedFee,
  renderAmountValue,
  renderFormatedConvertedAmount,
  shortenAddress,
} from "../../utils/transferHelpers"
import { useStyles } from "./styles"

type ExplorerTable = {
  active: boolean
  setActive: (state: boolean) => void
  chains: Array<EvmBridgeConfig>
  state: ExplorerContextState
  sharedConfig: SharedConfigDomain[] | []
  domainMetadata: EnvironmentMetadata | {}
}

const ExplorerTable: React.FC<ExplorerTable> = ({ state, domainMetadata }: ExplorerTable) => {
  const { classes } = useStyles()

  const renderTransferList = (transferData: Transfer[]): JSX.Element[] => {
    return transferData.map((transfer: Transfer) => {
      const { deposit, status, amount, resource, fromDomainId, toDomainId, id, resourceID, fee, usdValue } = transfer

      const { type } = resource

      const fromDomainInfo = (domainMetadata as EnvironmentMetadata)[Number(fromDomainId)]

      const toDomainInfo = (domainMetadata as EnvironmentMetadata)[Number(toDomainId)]

      const formatedFee = getFormatedFee(fee)

      const fromDomainType = fromDomainInfo?.type

      let txHash: string | undefined

      if (fromDomainType === "evm" && deposit) {
        txHash = shortenAddress(deposit?.txHash)
      } else {
        txHash = deposit?.txHash
      }

      const fromDomainName = fromDomainInfo.renderName
      const toDomainName = toDomainInfo.renderName

      const dateFormated = formatDistanceDate(deposit?.timestamp!)

      const amountWithFormatedDecimals = formatAmountDecimals(amount)

      return (
        <TableRow className={classes.row} key={transfer.id}>
          <TableCell className={clsx(classes.row, classes.dataRow, classes.cellRow)}>
            {txHash !== undefined ? (
              <Link
                className={classes.hashAnchorLink}
                to={`/transfer/${deposit?.txHash!}`}
                state={{ id: id, page: state.queryParams.page, txHash: deposit?.txHash }}
              >
                {txHash}
              </Link>
            ) : (
              "-"
            )}
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div className={classes.accountAddress}>
              <span className={classes.statusPill}>
                {renderStatusIcon(status, classes)} {displayStatus(status)}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div style={{ width: "100%" }}>
              <span style={{ display: "flex" }}>
                {renderNetworkIcon(fromDomainInfo?.caipId, classes)} {fromDomainName}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div style={{ width: "100%" }}>
              <span style={{ display: "flex" }}>
                {renderNetworkIcon(toDomainInfo?.caipId, classes)} {toDomainName}
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
                <span>{renderAmountValue(type as ResourceTypes, amountWithFormatedDecimals, resourceID, state.resourcesPerPage)}</span>
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
      {state.isLoading === "done" && <TableBody>{renderTransferList(filterTransfers(state.transfers, domainMetadata))}</TableBody>}
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
