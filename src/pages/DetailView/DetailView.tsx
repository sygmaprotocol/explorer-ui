import { CircularProgress, Tooltip, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useReducer } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useExplorer } from "../../context";
import { SharedConfigResource, Transfer } from "../../types";
import {
  formatDistanceDate,
  getDisplayedStatuses,
  getDomainData,
  getFormatedFee,
  getNetworkNames,
  renderNetworkIcon,
  renderStatusIcon,
} from "../../utils/Helpers";
import { useStyles } from "./styles";
import clsx from "clsx";
import useClipboard from "./hooks/useClipboard";
import useFetchTransfer from "./hooks/useFetchTransfer";
import { DetailViewState, reducer } from "./reducer";
import useUpdateInterval from "./hooks/useUpdateInterval";

dayjs.extend(localizedFormat);

export default function DetailView() {
  const explorerContext = useExplorer();

  const { sharedConfig, setSharedConfig, routes } = explorerContext;

  const { classes } = useStyles();

  const { state: transferId } = useLocation();

  const initState: DetailViewState = {
    transferDetails: null,
    transferStatus: "none",
    clipboardMessageT1: "Copy to clipboard",
    clipboardMessageT2: "Copy to clipboard",
    delay: 5000,
    fetchingStatus: "idle",
  };

  const [state, dispatcher] = useReducer(reducer, initState);

  useClipboard(state, dispatcher);

  useFetchTransfer(
    routes,
    sharedConfig,
    setSharedConfig,
    transferId,
    dispatcher,
  );

  useUpdateInterval(state, dispatcher, transferId, routes);

  const renderTransferDetails = (transfer: Transfer | null) => {
    const fromDomainInfo = getDomainData(transfer?.fromDomainId!, sharedConfig);
    const toDomainInfo = getDomainData(transfer?.toDomainId!, sharedConfig);

    const { resource } = transfer as Transfer;

    const { id } = resource;

    const fromDomainName = getNetworkNames(fromDomainInfo?.chainId!);
    const toDomainName = getNetworkNames(toDomainInfo?.chainId!);

    const fromDomainTokenName = fromDomainInfo?.resources.find(
      (resource) => resource.resourceId === id,
    );

    const { symbol } = fromDomainTokenName as SharedConfigResource;

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
        <div
          className={clsx(classes.detailsContainer, classes.statusPillMobile)}
        >
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
            <span className={classes.txHashText}>
              {transfer?.deposit && transfer?.deposit?.txHash}
            </span>
            <span
              className={classes.copyIcon}
              onClick={() => {
                navigator.clipboard?.writeText(transfer?.deposit?.txHash!);
                dispatcher({
                  type: "set_clipboard_message_t1",
                  payload: "Copied to clipboard!",
                });
              }}
            >
              <Tooltip title={state.clipboardMessageT1} placement="top" arrow>
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
                dispatcher({
                  type: "set_clipboard_message_t2",
                  payload: "Copied to clipboard!",
                });
              }}
            >
              <Tooltip title={state.clipboardMessageT2} placement="top" arrow>
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
            {formatDistanceDate(transfer?.timestamp!)} (
            {dayjs(transfer?.timestamp!).format("llll")})
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
            {transfer?.amount} {symbol}
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
            <Container className={classes.transferDetailsContainer}>
              {renderTransferDetails(state.transferDetails)}
            </Container>
          </section>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Container>
  );
}
