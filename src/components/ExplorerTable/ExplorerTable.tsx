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
import {
  EvmBridgeConfig,
  Transfer,
} from "../../types";
import {
  formatTransferDate,
  getRandomSeed,
  computeAndFormatAmount,
  selectChains,
  selectToken,
  getNetworkIcon,
} from "../../utils/Helpers";
import { ReactComponent as DirectionalIcon } from "../../media/icons/directional.svg";
import { useStyles } from "./styles";

// TODO: just for mocking purposes
type ExplorerTable = {
  active: boolean;
  setActive: (state: boolean) => void;
  chains: Array<EvmBridgeConfig>;
  handleTimelineButtonClick: () => void;
  timelineButtonClicked: boolean;
  state: { transfers: Transfer[] | never[], loading: "none" | "loading" | "done", isReady: boolean }
};

const ExplorerTable: React.FC<ExplorerTable> = ({
  active,
  chains,
  handleTimelineButtonClick,
  timelineButtonClicked,
  state
}: ExplorerTable) => {
  const classes = useStyles();

  const renderTransferList = (transferData: Transfer[]) => {

    return transferData.map((transfer: Transfer) => {
      const {  deposit, status, fromDomain, toDomain, amount } = transfer;
      let txHash: string | undefined
      let type: string | undefined

      if(status === "pending") {
        txHash = deposit?.txHash!
        type = deposit?.type!
      }
      const { name } = fromDomain;
      const { name: toName } = toDomain;


      return (
        <TableRow className={classes.row} key={transfer.id}>
          <TableCell className={classes.cellRow}>
            { txHash !== undefined ? txHash : "-"}
          </TableCell>
          <TableCell>
            <div className={classes.accountAddress}>
              <span>{status}</span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <div>
              <span>
                <span>{name}</span>
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <div>
              <span>
                <span>{toName}</span>
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <span className={classes.amountInfo}>
              <span>
                {type !== undefined ? type : "-"}
              </span>
            </span>
          </TableCell>
           <TableCell className={classes.row}>
            <span className={classes.amountInfo}>
              <span>
                {amount}
              </span>
            </span>
          </TableCell>
        </TableRow>
      );
    });
  }


  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow className={classes.row}>
          <TableCell>Tx Hash</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{ state.loading === "done" ? renderTransferList(state.transfers) : <TableRow><TableCell>Loading</TableCell></TableRow> }</TableBody>
    </Table>
  );
};

export default ExplorerTable;
