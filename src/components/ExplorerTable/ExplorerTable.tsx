import React from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TablePagination,
} from "@mui/material";
import clsx from "clsx";
import {
  EvmBridgeConfig,
  ExplorerContext,
  SharedConfigDomain,
  Transfer,
} from "../../types";
import { Link } from "react-router-dom";
import {
  getDisplayedStatuses,
  shortenAddress,
  renderNetworkIcon,
  renderStatusIcon,
  getDomainData,
  getNetworkNames,
  getResourceInfo,
  formatDistanceDate,
  getFormatedFee,
} from "../../utils/Helpers";
import { useStyles } from "./styles";

type ExplorerTable = {
  active: boolean;
  setActive: (state: boolean) => void;
  chains: Array<EvmBridgeConfig>;
  state: {
    transfers: Transfer[];
    loading: "none" | "loading" | "done";
    error: undefined | string;
  };
  sharedConfig: SharedConfigDomain[] | [];
  explorerContext: ExplorerContext;
};

const ExplorerTable: React.FC<ExplorerTable> = ({
  state,
  sharedConfig,
  explorerContext,
}: ExplorerTable) => {
  const { classes } = useStyles();
  const { explorerContextDispatcher, explorerContextState } = explorerContext;

  const renderTransferList = (transferData: Transfer[]) => {
    return transferData.map((transfer: Transfer) => {
      const {
        deposit,
        status,
        amount,
        resource,
        fromDomainId,
        toDomainId,
        id,
        resourceID,
        timestamp,
        fee,
      } = transfer;

      let formatedFee = getFormatedFee(fee);

      const fromDomainInfo = getDomainData(fromDomainId, sharedConfig);
      const toDomainInfo = getDomainData(toDomainId, sharedConfig);

      const fromDomainType = fromDomainInfo?.type;

      const { type } = resource;
      let txHash: string | undefined;

      if (fromDomainType === "evm" && deposit) {
        txHash = shortenAddress(deposit?.txHash!);
      } else {
        txHash = deposit?.txHash;
      }

      const fromDomainName = getNetworkNames(fromDomainInfo?.chainId!);
      const toDomainName = getNetworkNames(toDomainInfo?.chainId!);

      const dateFormated = formatDistanceDate(timestamp!);
      return (
        <TableRow className={classes.row} key={transfer.id}>
          <TableCell
            className={clsx(classes.row, classes.dataRow, classes.cellRow)}
          >
            {txHash !== undefined ? (
              <Link
                className={classes.hashAnchorLink}
                to={`/transfer/${deposit?.txHash}`}
                state={{ id: id }}
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
                {renderStatusIcon(status, classes)}{" "}
                {getDisplayedStatuses(status)}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div style={{ width: "100%" }}>
              <span style={{ display: "flex" }}>
                {renderNetworkIcon(fromDomainInfo?.chainId!, classes)}{" "}
                {fromDomainName}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <div style={{ width: "100%" }}>
              <span style={{ display: "flex" }}>
                {renderNetworkIcon(toDomainInfo?.chainId!, classes)}{" "}
                {toDomainName}
              </span>
            </div>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <span>{type !== undefined ? type : "-"}</span>
            </span>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <span>{dateFormated}</span>
            </span>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              {/* NOTE: hardcoded in the meantime */}
              <span>{formatedFee}</span>
            </span>
          </TableCell>
          <TableCell className={clsx(classes.row, classes.dataRow)}>
            <span className={classes.amountInfo}>
              <span>
                {amount}{" "}
                {resourceID !== "" &&
                  getResourceInfo(resourceID, fromDomainInfo!)}
              </span>
            </span>
          </TableCell>
        </TableRow>
      );
    });
  };

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
          <TableCell sx={{ borderTopLeftRadius: "12px !important" }}>
            Source Tx/Extr Hash
          </TableCell>
          <TableCell>Status</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Fee</TableCell>
          <TableCell sx={{ borderTopRightRadius: "12px !important" }}>
            Value
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {state.loading === "done" ? (
          renderTransferList(state.transfers)
        ) : (
          <TableRow>
            <TableCell>Loading</TableCell>
          </TableRow>
        )}

        {state.error && (
          <TableRow>
            <TableCell>{state.error}</TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TablePagination
          rowsPerPageOptions={[10]}
          labelDisplayedRows={({ from, to, count }) => {
            return `${from} - ${to}`
          }}
          count={explorerContextState.queryParams.page * 10 + 10}
          page={explorerContextState.queryParams.page - 1}
          rowsPerPage={explorerContextState.queryParams.limit}
          onPageChange={(_, page) => {
            console.log("Page", page, explorerContextState.queryParams);
            if (page < explorerContextState.queryParams.page) {
              explorerContextDispatcher({
                type: "set_query_params",
                payload: {
                  page: explorerContextState.queryParams.page - 1,
                  limit: explorerContextState.queryParams.limit,
                },
              });
            } else {
              explorerContextDispatcher({
                type: "set_query_params",
                payload: {
                  page: explorerContextState.queryParams.page + 1,
                  limit: explorerContextState.queryParams.limit,
                },
              });
            }
          }}
        />
      </TableFooter>
    </Table>
  );
};

export default ExplorerTable;
