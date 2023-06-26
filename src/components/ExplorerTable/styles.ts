import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: "table",
      width: "100%",
      background: "#E9E4DD",
      borderTopRightRadius: '12px',
      borderTopLeftRadius: '12px',
      "& > thead > tr": {
        fontSize: 16,
        fontWeight: 700,
      },
    },
    row: {
      fontWeight: 400,
      fontSize: 14,
      verticalAlign: "middle",
      "& > td:nth-of-type(1)": {
        paddingLeft: 26,
        textAlign: "left",
      },
      "& > td": {
        textAlign: "left",
        "& > div": {
          display: "flex",
          "& > span:nth-of-type(1)": {
            marginRight: 3,
          },
          "& > span": {
            display: "flex",
            alignItems: "center",
            "& > span": {
              marginLeft: 2,
            },
          },
        },
        "& > div > span > svg": {
          height: 21,
          width: 21,
        },
        "& > div > span > svg:last-child": {
          height: "14.44px",
          width: "14.44px",
        },
      },
    },
    elipsisIcon: {
      borderRadius: "50%",
    },
    accountAddress: {
      display: "flex",
    },
    addressDetailView: {
      display: "flex",
      marginTop: 10,
    },
    cellRow: {
      verticalAlign: "middle",
    },
    tokenIcon: {
      height: 14,
      width: 14,
    },
    amountInfo: {
      display: "flex",
      alignItems: "center",
    },
    viewDetailsInfo: {
      "& > button": {
        background: "none",
        color: "black",
        border: "none",
        padding: "0 !important",
        textDecoration: "underline",
      },
    },
    avatar: {
      marginRight: 6,
    },
    transferDetailContainer: {
      width: "100%",
      "& > section": {
        maxWidth: "768px !important",
        width: "100%",
      },
    },
    transferDetails: {
      minWidth: 768,
    },
    transferDetailExpandedDesktop: {},
    transferDetailExpanded: {
      height: 960,
      transition: "height 0.5s ease-out",
    },
    transferDetailNotExpanded: {
    },
    timelineSection: {
      paddingBottom: 15,
    },
    closeButton: {
      display: "flex",
      justifyContent: "flex-end",
      "& > button": {
        background: "none",
        border: "none",
        "& > span": {
          width: 15,
          height: 15,
        },
        "& > span > span": {
          width: 15,
          height: 15,
        },
        "& > span > span > svg": {
          fill: "#9E9E9E",
          border: "#9E9E9E",
          width: 15,
          height: 15,
          // transitionDuration: "unset",
        },
      },
    },
    transferDetailSection: {
      width: "100%",
      padding: "0px 38px 0px 38px",
      "& > hr": {
        color: "#595959",
        marginTop: 26,
      },
    },
    headerSection: {
      display: "flex",
      flexDirection: "column",
      marginBottom: 26,
      "& > span": {
        marginBottom: 8,
        fontSize: 14,
      },
    },
    statusSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      marginBottom: 26,
    },
    proposalStatus: {
      gridColumn: "3",
    },
    sentAndFromSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      marginBottom: 26,
    },
    colTitles: {
      color: "#595959",
    },
    amountSent: {
      fontSize: 16,
      "& > div": {
        marginTop: 16,
      },
      "& > p": {
        marginTop: 10,
        fontsize: 16,
      },
    },
    toDetailView: {
      "& > div": {
        marginTop: 12,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        "& > span:nth-of-type(2)": {
          marginLeft: 6,
          fontSize: 16,
        },
      },
    },
    fromDetailView: {
      "& > div": {
        marginTop: 12,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        "& > span": {
          marginLeft: 6,
          fontSize: 16,
        },
      },
    },
    proposalStatusPill: {
      display: "flex",
      justifyContent: "center",
      borderRadius: 16,
      width: 75,
      height: 22,
      fontSize: 14,
      padding: "0px 8px 0px 8px",
      margin: "10px 0px",
      fontWeight: 400,
    },
    fromAddressDetails: {
      fontSize: 16,
      textDecoration: "none",
    },
    bridgeSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
    },
    transactionHashSection: {
      gridColumn: "1/3",
      "& > div": {
        display: "flex",
        flexDirection: "column",
        "& > span:nth-of-type(2), & > a:nth-of-type(2)": {
          marginTop: 12,
          fontSize: 14,
          display: "flex",
          textDecoration: "none",
        },
      },
    },
    transferTimeline: {
      "& > div:first-type": {
        marginBottom: 22,
      },
    },
    messageContainer: {
      display: "grid",
      gridTemplateRows: "1fr 0.5fr",
      position: "relative",
    },
    lastMessage: {
      visibility: "visible",
    },
    messages: {
      display: "grid",
      gridTemplateColumns: "6fr 1fr",
      height: 30,
      fontSize: 14,
      // marginBottom: 20,
      fontWeight: 400,
      color: "#595959",
      "& > span": {
        display: "flex",
        alignItems: "center",
        "& > div": {
          marginRight: 5,
        },
      },
      "& a": {
        textDecoration: "none",
        color: "#595959",
      },
    },
    dot: {
      border: "1px solid",
      borderRadius: "50%",
      height: 8,
      width: 8,
    },
    greenDot: {
      background: "#73D13D",
      borderColor: "#73D13D",
    },
    greyBar: {
      border: "0.2px solid #E8E8E8",
      height: 37,
      width: 0.3,
      position: "absolute",
      top: 19,
      left: 3,
      "& div:first-of-type": {
        height: 45,
      },
    },
    imageToken: {
      height: 27,
      width: 27,
    },
    imageValueToken: {
      height: 27,
      width: 27,
      marginRight: 5,
    },
    timelineButton: {
      display: "block",
    },
    timelineButtonClicked: {
      display: "none",
    },
    messageCollapsed: {
    },
    messageNotCollapsed: {
    },
    buttonTimelineContainer: {
      display: "none",
    },
    buttonTimelineContainerClicked: {
      "& > hr": {
        display: "none",
      },
    },
    customGreyBar: {
      top: 29,
      height: 39,
    },
    time: {
    },
    secondElementGreybar: {
      height: 77,
    },
    transferCancelColor: {
      color: "#F5222D",
    },
    waitingForColor: {
      color: "#BFBFBF",
    },
    statusPillIcon: {
      marginRight: 5,
    },
    statusPill: {
      borderRadius: 32,
      background: "#E2D9CC",
      padding: '4px 8px 4px 4px'
    },
    networkIcon: {
      display: "block",
      height: 20,
      width: 20,
      marginRight: theme.spacing(1),
    }
  }
});