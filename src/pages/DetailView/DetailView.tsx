import { CircularProgress, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useExplorer } from "../../context";
import { Transfer } from "../../types";
import {
  getDisplayedStatuses,
  renderStatusIcon,
  shortenAddress,
} from "../../utils/Helpers";
import { useStyles } from "./styles";

export default function DetailView() {
  const { classes } = useStyles();
  const { state: transferId } = useLocation();
  const { routes } = useExplorer();
  const [transferDetails, setTransferDetails] = useState<Transfer | null>(null);
  const [transferStatus, setTransferStatus] = useState<"none" | "completed">(
    "none",
  );
  console.log("🚀 ~ file: DetailView.tsx:5 ~ DetailView ~ state:", transferId);

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId);
    console.log(
      "🚀 ~ file: DetailView.tsx:12 ~ fetchTransfer ~ transfer:",
      transfer,
    );
    setTransferDetails(transfer);
    setTransferStatus("completed");
  };

  const renderTransferDetails = (transfer: Transfer | null) => {
    return (
      <Container className={classes.innerTransferDetailContainer}>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Status:</span>
          <span
            className={classes.detailsInnerContent}
          >
            <span className={classes.statusPill}>
              {renderStatusIcon(transfer?.status!, classes)}
              {getDisplayedStatuses(transfer?.status!)}
            </span>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>
            Source transaction hash:
          </span>
          <span className={classes.detailsInnerContent}>
            {shortenAddress(transfer?.deposit?.txHash!)}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>
            Destination transaction hash:
          </span>
          <span className={classes.detailsInnerContent}>
            {shortenAddress(transfer?.execution?.txHash!)}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>
            Source block number:
          </span>
          <span className={classes.detailsInnerContent}>
            {transfer?.deposit?.blockNumber}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Created:</span>
          <span className={classes.detailsInnerContent}>
            {transfer?.timestamp}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>From:</span>
          <span className={classes.detailsInnerContent}>
            {transfer?.sender}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          {/* NOTE: Sender in the meantime */}
          <span className={classes.detailsInnerContentTitle}>To:</span>
          <span className={classes.detailsInnerContent}>
            {transfer?.sender}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Value:</span>
          <span className={classes.detailsInnerContent}>
            {transfer?.amount}
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Fees:</span>
          <span className={classes.detailsInnerContent}>
            {transfer?.fee.amount}
          </span>
        </div>
      </Container>
    );
  };

  useEffect(() => {
    fetchTransfer();
  }, []);

  return (
    <Box className={classes.boxContainer}>
      {transferStatus !== "none" ? (
        <section className={classes.sectionContainer}>
          <Typography variant="h4" sx={{ fontSize: '24px' }}>Transaction Detail</Typography>
          <Container className={classes.transferDetailsContainer}>
            {renderTransferDetails(transferDetails)}
          </Container>
        </section>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
