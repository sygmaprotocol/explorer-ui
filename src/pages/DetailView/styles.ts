import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
    },
    boxContainer: {
      width: '100%',
      marginTop: '65.5px',
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: 'repeat(12, 1fr)',
      },
    },
    sectionContainer: {
      display: 'flex',
      flexDirection: 'column',
      gridColumn: '3 / span 9',
      [theme.breakpoints.down('lg')]: {
        gridColumn: '2 / span 8',
      },
      [theme.breakpoints.down('md')]: {
        gridColumn: '1 / span 12',
      }
    },
    transferDetailsContainer: {
      padding: '0 !important',
      marginTop: '40px',
      width: '100%',
    },
    innerTransferDetailContainer: {
      padding: '0 !important',
      fontSize: '14px',
      lineHeight: '18px',
      '& > div:nth-of-type(1)': {
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      },
      '& > div:last-child': {
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        marginBottom: 'unset'
      },
      [theme.breakpoints.down('md')]: {
        '& > div:nth-child(n + 3)': {
          height: '80px',
        }
      }
    },
    detailsContainer: {
      background: '#F3F3F3',
      width: '100%',
      height: '48px',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '4px',
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '12px',
        justifyContent: 'center',
        alignItems: 'baseline',
      }
    },
    detailsInnerContentEVM: {
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexDirection: 'column',
      }
    },
    detailsInnerContentTitle: {
      display: 'flex',
      width: '287px',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginLeft: '16px',
    },
    detailsInnerContent: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    statusPillIcon: {
      marginRight: 5,
    },
    statusPill: {
      borderRadius: 32,
      background: "#E2D9CC",
      padding: '4px 8px 4px 4px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusPillMobile: {
      [theme.breakpoints.down('md')]: {
        display: 'flex',
        flexDirection: 'row',
      }
    },
    copyIcon: {
      marginLeft: "5px",
      ':hover': {
        cursor: 'pointer'
      }
    },
    txHashText: {
      [theme.breakpoints.down('md')]: {
        wordBreak: 'break-all',
      }
    },
    txHashTextEvm: {
      [theme.breakpoints.down('md')]: {
        marginRight: '15px',
      }
    },
    backIcon: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '70px',
      height: '26px',
      marginBottom: '15px',
      ':hover': {
        cursor: 'pointer',
        borderRadius: '8px',
        background: '#E2D9CC'
      }
    },
    networkIcon: {
      display: "block",
      height: 20,
      width: 20,
      marginRight: theme.spacing(1),
    },
    substrateNetworkIcon: {
      display: "block",
      height: 30,
      width: 30,
      marginRight: theme.spacing(1),
    },
    networkContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      alignItems: "center",
    },
    networkIconsContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    }
  }
});