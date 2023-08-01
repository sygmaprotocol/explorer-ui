import { CircularProgress, Tooltip, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useExplorer } from "../../context";
import { SharedConfigDomain, Transfer } from "../../types";
import {
  formatDistanceDate,
  getDisplayedStatuses,
  getDomainData,
  getFormatedFee,
  getNetworkNames,
  renderNetworkIcon,
  renderStatusIcon,
  sanitizeTransferData,
  shortenAddress,
} from "../../utils/Helpers";
import { useStyles } from "./styles";

dayjs.extend(localizedFormat);

export default function DetailView() {
  const explorerContext = useExplorer();

  const { sharedConfig } = explorerContext;

  const { classes } = useStyles();

  const { state: transferId } = useLocation();

  const { routes } = useExplorer();

  const [transferDetails, setTransferDetails] = useState<Transfer | null>(null);

  const [transferStatus, setTransferStatus] = useState<"none" | "completed">(
    "none",
  );

  const [transferFromNetworkType, setTransferFromNetworkType] =
    useState<string>("");
  const [transferToNetworkType, setTransferToNetworkType] =
    useState<string>("");

  const [clipboardMessageT1, setClipboardMessageT1] =
    useState<string>("Copy to clipboard");

  const [clipboardMessageT2, setClipboardMessageT2] =
    useState<string>("Copy to clipboard");

  const setTransferNetworkTypes = (
    fromDomainInfo: SharedConfigDomain | undefined,
    toDomainInfo: SharedConfigDomain | undefined,
  ) => {
    const fromDomainType = fromDomainInfo?.type;

    const toDomainType = toDomainInfo?.type;

    setTransferFromNetworkType(fromDomainType!);
    setTransferToNetworkType(toDomainType!);
  };

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId.id);
    const sanitizedTransfer = sanitizeTransferData([transfer]);

    const fromDomainInfo = getDomainData(
      sanitizedTransfer[0].fromDomainId,
      sharedConfig,
    );
    const toDomainInfo = getDomainData(
      sanitizedTransfer[0].toDomainId,
      sharedConfig,
    );

    setTransferNetworkTypes(fromDomainInfo!, toDomainInfo!);

    setTransferDetails(sanitizedTransfer[0]);
    setTransferStatus("completed");
  };

  useEffect(() => {
    let timerT1: ReturnType<typeof setTimeout>;
    let timerT2: ReturnType<typeof setTimeout>;

    if (clipboardMessageT1 === "Copied to clipboard!") {
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
    };
  }, [clipboardMessageT1, clipboardMessageT2]);

  // fallback when you are opening the detail view on new tab
  const params = useParams();

  const getTransfersFromLocalStorage = () => {
    const transfers = localStorage.getItem("transfers");
    const { txHash } = params;
    const parsedTransfers: Transfer[] = JSON.parse(transfers!);
    const transfer = parsedTransfers.find(
      (transfer) => transfer.deposit?.txHash === txHash,
    );

    if (transfer) {
      const fromDomainInfo = getDomainData(transfer.fromDomainId, sharedConfig);
      const toDomainInfo = getDomainData(transfer.toDomainId, sharedConfig);

      setTransferNetworkTypes(fromDomainInfo!, toDomainInfo!);

      setTransferDetails(transfer);
      setTransferStatus("completed");
    }
  };

  useEffect(() => {
    if (transferId !== null) {
      fetchTransfer();
    } else {
      getTransfersFromLocalStorage();
    }
  }, []);

  const renderTransferDetails = (transfer: Transfer | null) => {
    const fromDomainInfo = getDomainData(transfer?.fromDomainId!, sharedConfig);
    const toDomainInfo = getDomainData(transfer?.toDomainId!, sharedConfig);

    const fromDomainName = getNetworkNames(fromDomainInfo?.chainId!);
    const toDomainName = getNetworkNames(toDomainInfo?.chainId!);

    return (
      <Container className={classes.innerTransferDetailContainer}>
        <div className={classes.detailsContainer}>
          <div className={classes.networkContainer}>
            <span className={classes.networkIconsContainer}>
              {renderNetworkIcon(fromDomainInfo?.chainId!, classes)}{" "}
              {fromDomainName}
            </span>
            <KeyboardDoubleArrowRightIcon />
            <span className={classes.networkIconsContainer}>
              {renderNetworkIcon(toDomainInfo?.chainId!, classes)}{" "}
              {toDomainName}
            </span>
          </div>
        </div>
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
            {transfer?.deposit && transfer?.deposit?.txHash}
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
            {transfer?.execution && transfer?.execution?.txHash}
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
            {formatDistanceDate(transfer?.timestamp!)} ({dayjs(transfer?.timestamp!).format("llll")})
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
            {getFormatedFee(transfer?.fee!)}
          </span>
        </div>
      </Container>
    );
  };

  return (
    <Container>
      <Box className={classes.boxContainer}>
        {transferStatus !== "none" ? (
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
            <Container className={classes.transferDetailsContainer}>
              {renderTransferDetails(transferDetails)}
            </Container>
          </section>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
}
