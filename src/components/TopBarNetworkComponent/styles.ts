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
      color: "black",
    },
    indicator: {
      display: "block",
      height: 20,
      width: 20,
      marginRight: theme.spacing(1),
    },
    accountInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      color: "black",
    },
    logoutContainer: {
      display: "flex",
      borderLeft: "1px solid black",
      marginLeft: '10px'
    },
    logoutIconContainer: {
      display: "flex",
      marginLeft: '10px',
      cursor: 'pointer'
    }
  };
});
