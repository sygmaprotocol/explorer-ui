import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
    }
  }
});