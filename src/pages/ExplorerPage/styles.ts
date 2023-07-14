import { makeStyles, createStyles, DefaultTheme } from "@mui/styles";

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "10px",
      position: "relative"
    },
    networkInfoContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    networkInfo: {
      display: "grid",
      gridColumn: "1/5",
      gridRow: "1",
      paddingRight: 15
    },
    networkSelection: {
      display: "flex",
      alignItems: "center",
      maxWidth: 600,
    },
    networkSelectorContainer: {
      display: "flex",
    },
    searchInput: {
      display: "grid",
      gridRow: "1",
      width: "50ch"
    },
    networkSelector: {
      marginLeft: 21,
      width: 327,
      "& > div > div": {
        lineHeight: 32,
        color: "#262626",
        "& > div > div": {
          fontSize: 24,
          fontWeight: 600,
        },
      },
    },
    explorerTableContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "35px",
      background: "#E9E4DD",
      borderRadius: "12px"
    },
    explorerTable: {
      borderRadius: 12,
      background: "#E9E4DD",
      minWidth: 955,
      width: "100%",
      height: "100%",
      border: "none",
    },
    paginationPanel: {
      display: "flex",
      justifyContent: "flex-end",
    },
    paginationButtons: {
      marginLeft: "10px",
    },
  })
);
