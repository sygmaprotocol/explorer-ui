import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  return {
    root: {
      border: "none",
      boxShadow: "none"
    },
    mainAppBar: {
      display: "grid",
      gridTemplateColumns: 'repeat(6, 1fr)',
      [theme.breakpoints.down("lg")]: {
        gridTemplateColumns: 'repeat(12, 1fr)',
      }
    },
    toolBar: {
      [theme.breakpoints.up("lg")]: {
        gridColumn: '3/6',

      },
      [theme.breakpoints.down("lg")]: {
        gridColumn: '2/span 6',
      }
    },
    connectButtonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      [theme.breakpoints.up("lg")]: {
        gridColumn: '6/6',
      },
      [theme.breakpoints.down("lg")]: {
        gridColumn: '11/ span 2',
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }
    },
    left: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    logo: {
      marginRight: 11,
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
      height: theme.constants.generalUnit * 5,
      width: theme.constants.generalUnit * 5,
      "& svg, & img": {
        maxHeight: "100%",
        maxWidth: "100%",
      },
    },
    state: {},
    indicator: {
      display: "block",
      height: 16,
      width: 16,
      marginRight: theme.constants.generalUnit,
    },
    address: {
      marginRight: theme.constants.generalUnit,
      display: "flex",
      alignItems: "center",
    },
    network: {},
    accountInfo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    mainInfo: {
      display: "flex",
    },
    mainTitle: {
      display: "flex",
      alignItems: "center",
    },
    headerLinks: {
      marginLeft: 49,
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginLeft: "unset",
        alignItems: "center",
        width: "100%",
        "& > a:last-child": {
          marginLeft: 5,
        },
      },
    },
    link: {
      marginLeft: 46,
      textDecoration: "none",
      [theme.breakpoints.down("sm")]: {
        marginLeft: "unset",
      },
    },
    linkTitle: {
      fontSize: 16,
    },
  };
});
