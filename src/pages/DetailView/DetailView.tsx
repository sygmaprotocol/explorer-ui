import { CircularProgress, Tooltip, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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

  const [clipboardMessageT1, setClipboardMessageT1] =
    useState<string>("Copy to clipboard");

  const [clipboardMessageT2, setClipboardMessageT2] =
    useState<string>("Copy to clipboard");

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId);
    setTransferDetails(transfer);
    setTransferStatus("completed");
  };

  useEffect(() => {
    let timerT1: ReturnType<typeof setTimeout>;
    let timerT2: ReturnType<typeof setTimeout>

    if(clipboardMessageT1 === "Copied to clipboard!") {
      timerT1 = setTimeout(() => {
        setClipboardMessageT1("Copy to clipboard");
      }, 1000);
    } else if (clipboardMessageT2 === "Copied to clipboard!") {
      timerT2 = setTimeout(() => {
        setClipboardMessageT2("Copy to clipboard");
      }, 1000);
    }

    return () => {
      clearTimeout(timerT1);
      clearTimeout(timerT2);
    }
  }, [clipboardMessageT1, clipboardMessageT2]);

  const renderTransferDetails = (transfer: Transfer | null) => {
    return (
      <Container className={classes.innerTransferDetailContainer}>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>Status:</span>
          <span className={classes.detailsInnerContent}>
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
            {shortenAddress(transfer?.deposit?.txHash!)}{" "}
            <span
              className={classes.copyIcon}
              onClick={() => {
                navigator.clipboard?.writeText(transfer?.deposit?.txHash!);
                setClipboardMessageT1("Copied to clipboard!");
              }}
            >
              <Tooltip title={clipboardMessageT1} placement="top" arrow>
                <ContentCopyIcon fontSize="small" />
              </Tooltip>
            </span>
          </span>
        </div>
        <div className={classes.detailsContainer}>
          <span className={classes.detailsInnerContentTitle}>
            Destination transaction hash:
          </span>
          <span className={classes.detailsInnerContent}>
            {shortenAddress(transfer?.execution?.txHash!)}{" "}
            <span
              className={classes.copyIcon}
              onClick={() => {
                navigator.clipboard?.writeText(transfer?.execution?.txHash!);
                setClipboardMessageT2("Copied to clipboard!");
              }}
            >
              <Tooltip title={clipboardMessageT2} placement="top" arrow>
                <ContentCopyIcon fontSize="small" />
              </Tooltip>
            </span>
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
            {transfer?.destination}
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
          <Typography variant="h4" sx={{ fontSize: "24px" }}>
            Transaction Detail
          </Typography>
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
