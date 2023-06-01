import React from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  SvgIcon,
  Button,
  Avatar,
} from "@mui/material";
import { Link } from 'react-router-dom'
import { EvmBridgeConfig, ExplorerState, Transfer } from "../../types";
import {
  getDisplayedStatuses,
  shortenAddress,
  renderNetworkIcon,
  renderStatusIcon,
} from "../../utils/Helpers";
import { useStyles } from "./styles";

// TODO: just for mocking purposes
type ExplorerTable = {
  active: boolean;
  setActive: (state: boolean) => void;
  chains: Array<EvmBridgeConfig>;
  handleTimelineButtonClick: () => void;
  timelineButtonClicked: boolean;
  state: {
    transfers: Transfer[] | never[];
    loading: "none" | "loading" | "done";
    error: undefined | string;
  };
  setExplorerState: React.Dispatch<React.SetStateAction<ExplorerState>>
};

const ExplorerTable: React.FC<ExplorerTable> = ({
  active,
  chains,
  handleTimelineButtonClick,
  timelineButtonClicked,
  state,
  setExplorerState,
}: ExplorerTable) => {
  const { classes } = useStyles();

  const renderTransferList = (transferData: Transfer[]) => {
    return transferData.map((transfer: Transfer) => {
      const {
        deposit,
        status,
        fromDomain,
        toDomain,
        amount,
        resource,
        fromDomainId,
        toDomainId,
        id
      } = transfer;
      const { type } = resource;
      let txHash: string | undefined;

      if (status !== "pending") {
        txHash = shortenAddress(deposit?.txHash!);
      }
      const { name } = fromDomain;
      const { name: toName } = toDomain;

      return (
        <TableRow className={classes.row} key={transfer.id} sx={{ borderBottom: "2px solid #CDC2B1"}}>
          <TableCell className={classes.cellRow}>
            {txHash !== undefined ? (<Link to={`/transfer/${deposit?.txHash}`} style={{ color: 'black'}} state={id}>{txHash}</Link>) : "-"}
          </TableCell>
          <TableCell>
            <div className={classes.accountAddress}>
              <span className={classes.statusPill}>
                {renderStatusIcon(status, classes)} {getDisplayedStatuses(status)}
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <div style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                {renderNetworkIcon(fromDomainId, classes)} {name}
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <div style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                {renderNetworkIcon(toDomainId, classes)} {toName}
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <span className={classes.amountInfo}>
              <span>{type !== undefined ? type : "-"}</span>
            </span>
          </TableCell>
          <TableCell className={classes.row}>
            <span className={classes.amountInfo}>
              <span>{amount}</span>
            </span>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Table className={classes.root}>
      <TableHead
        sx={{
          backgroundColor: "#DBD3C7",
          "& > tr > th": {
            fontSize: '14px',
            fontWeight: '400'
          }
        }}
      >
        <TableRow className={classes.row}>
          <TableCell sx={{ borderTopLeftRadius: '12px !important' }}>Source Tx/Extr Hash</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Type</TableCell>
          <TableCell sx={{ borderTopRightRadius: '12px !important' }}>Value</TableCell>
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

        {
          state.error && (
            <TableRow>
              <TableCell>{state.error}</TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>
  );
};

export default ExplorerTable;
