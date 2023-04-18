import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  return {
    state: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },

    mainInfo: {
      display: "flex",
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: 3,
      paddingBottom: 3,
      background: "#CDC2B1",
      borderRadius: 10
    },
    address: {
      display: "flex",
      alignItems: "center",
      color: "#DBD3C7",
    },
    indicator: {
      display: "block",
      height: 16,
      width: 16,
      marginRight: theme.spacing(1),
    },
    accountInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    },
  };
});
