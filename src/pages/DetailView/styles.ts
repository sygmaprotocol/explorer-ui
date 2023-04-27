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
      display: 'flex',
      flexDirection: 'column',
      marginTop: '65.5px',
      alignItems: 'center'
    },
    sectionContainer: {
      display: 'flex',
      flexDirection: 'column',
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
      '& > div:nth-child(1)': {
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      },
      '& > div:last-child': {
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        marginBottom: 'unset'
      }
    },
    detailsContainer: {
      background: '#F3F3F3',
      width: '728px',
      height: '48px',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '4px'
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
      padding: '4px 8px 4px 4px'
    },
  }
});