import { Button, Typography } from "@mui/material";
import React from "react";
import { BridgeConfig, ExplorerState } from "../../types";
import { shortenAddress } from "../../utils/Helpers";

// import { shortenAddress } from "../../utils/Helpers";

import { useStyles } from "../Header/styles";

type TopBarNetworkConnectProps = {
  isReady: boolean | undefined;
  walletConnecting: boolean;
  homeConfig: BridgeConfig | undefined;
  address: string | undefined;
  getAccount: () => Promise<string>;
  setExplorerState: React.Dispatch<React.SetStateAction<ExplorerState>>;
  explorerState: ExplorerState;
};

export default function TopBarNetworkConnect({
  homeConfig,
  address,
  getAccount,
  setExplorerState,
  explorerState,
}: TopBarNetworkConnectProps) {
  const { classes } = useStyles();
  const [localAddress, setLocalAddress] = React.useState<string | undefined>(
    "",
  );
  const [isReady, setIsReady] = React.useState(false);

  const handleClickOpen = async () => {
    // dispatcher({ type: "setShowConnectionDialog", payload: true });
    const account = await getAccount();
    setLocalAddress(account);
    setExplorerState({
      ...explorerState,
      account,
    });
    setIsReady(true);
  };

  return (
    <>
      <section className={classes.state}>
        {!isReady ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleClickOpen}
            sx={{ px: 3, fontSize: 18 }}
          >
            Connect Wallet
          </Button>
        ) : (
          <>
            <div
              className={classes.mainInfo}
              style={{
                paddingTop: 3,
                paddingBottom: 3,
                background: "#CDC2B1",
                borderRadius: 10,
              }}
            >
              <Typography variant="h6" className={classes.address}>
                {homeConfig && (
                  <img
                    src={`/assets/images/networks/${homeConfig.nativeTokenSymbol.toLocaleLowerCase()}.svg`}
                    alt={"native token icon"}
                    className={classes.indicator}
                  />
                )}
              </Typography>
              <div className={classes.accountInfo}>
                <Typography variant="h6" className={classes.address}>
                  {shortenAddress(localAddress!)}
                </Typography>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
