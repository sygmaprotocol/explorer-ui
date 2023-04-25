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
import { EvmBridgeConfig, Transfer } from "../../types";
import {
  formatTransferDate,
  getRandomSeed,
  computeAndFormatAmount,
  selectChains,
  selectToken,
  getNetworkIcon,
  shortenAddress,
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
  state: {
    transfers: Transfer[] | never[];
    loading: "none" | "loading" | "done";
    isReady: boolean;
  };
};

const ExplorerTable: React.FC<ExplorerTable> = ({
  active,
  chains,
  handleTimelineButtonClick,
  timelineButtonClicked,
  state,
}: ExplorerTable) => {
  const { classes } = useStyles();

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <img
            src={`/assets/icons/pending.svg`}
            alt="pending"
            className={classes.statusPillIcon}
          />
        );
      case "completed":
        return (
          <img
            src={`/assets/icons/success.svg`}
            alt="completed"
            className={classes.statusPillIcon}
          />
        );
      case "reverted":
        return (
          <img
            src={`/assets/icons/reverted.svg`}
            alt="reverted"
            className={classes.statusPillIcon}
          />
        );
      default:
        return (
          <img
            src={`/assets/icons/pending.svg`}
            alt="pending"
            className={classes.statusPillIcon}
          />
        );
    }
  };

  // NOTE: this is temporary, will be removed once we definition regarding shared config and api
  // question to answer here: should we use chain id to mapp for icons? 
  const renderNetworkIcon = (id: string) => {
    switch (id) {
      case "0":
      case "3":
        return (
          <img
            src={`/assets/icons/all.svg`}
            alt="ethereum"
            className={classes.networkIcon}
          />
        );
      case "1":
        return (
          <img
            src={`/assets/icons/polygon.svg`}
            alt="polygon"
            className={classes.networkIcon}
          />
        );
      case "2":
        return (
          <img
            src={`/assets/icons/moonbeam.svg`}
            alt="moonbeam"
            className={classes.networkIcon}
          />
        );
      default:
        return (
          <img
            src={`/assets/icons/all.svg`}
            alt="ethereum"
            className={classes.networkIcon}
          />
        );
    }
  };

  const getDisplayedStatuses = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "reverted":
        return "Reverted";
      default:
        return "Pending";
    }
  };

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
            {txHash !== undefined ? (<a href="/" style={{ color: 'black'}}>{txHash}</a>) : "-"}
          </TableCell>
          <TableCell>
            <div className={classes.accountAddress}>
              <span className={classes.statusPill}>
                {renderStatusIcon(status)} {getDisplayedStatuses(status)}
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <div style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                {renderNetworkIcon(fromDomainId)} {name}
              </span>
            </div>
          </TableCell>
          <TableCell className={classes.row}>
            <div style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                {renderNetworkIcon(toDomainId)} {toName}
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
      </TableBody>
    </Table>
  );
};

export default ExplorerTable;
