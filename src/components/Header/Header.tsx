import React from "react";
import clsx from "clsx";
import Typography from "@mui/material/Typography";

import { useStyles } from "./styles";

interface IAppHeader {}

const AppHeader: React.FC<IAppHeader> = () => {
  const classes = useStyles();

  const { __RUNTIME_CONFIG__ } = window;

  const indexerEnabled = "INDEXER_URL" in __RUNTIME_CONFIG__;

  return (
    <header className={clsx(classes.root)}>
      <div className={classes.left}>
        {/* ADD LOGO HERE */}
        {/* <div className={classes.logo}>
        </div> */}
        <div className={classes.mainTitle}>
          <Typography variant="h5">Sygma Explorer</Typography>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
