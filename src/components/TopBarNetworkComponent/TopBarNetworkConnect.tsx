import { Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { BridgeConfig, ExplorerContext, ExplorerState } from "../../types";
import { getIconNamePerChainId, shortenAddress } from "../../utils/Helpers";

import { useStyles } from "./styles";

type TopBarNetworkConnectProps = {
  walletConnecting: boolean;
  homeConfig: BridgeConfig | undefined;
  address: string | undefined;
  getAccount: ExplorerContext["getAccount"];
  setExplorerState: ExplorerContext["setExplorerState"];
  explorerState: ExplorerState;
  getChainId: ExplorerContext["getChainId"];
  chainId: ExplorerContext["chainId"]
};

export default function TopBarNetworkConnect({
  homeConfig,
  address,
  getAccount,
  setExplorerState,
  explorerState,
  getChainId,
  chainId,
}: TopBarNetworkConnectProps) {
  const { classes } = useStyles();
  const [localAddress, setLocalAddress] = React.useState<string | undefined>(
    "",
  );
  const [isReady, setIsReady] = React.useState(false);
  const [currentChainId, setCurrentChainId] = React.useState<
    number | undefined
  >(undefined);

  const handleClickOpen = async () => {
    const account = await getAccount();
    const chainId = Number(await getChainId());

    setCurrentChainId(chainId);
    setLocalAddress(account);
    setExplorerState({
      ...explorerState,
      account,
    });
    setIsReady(true);
  };

  useEffect(() => {
    if(chainId !== undefined && chainId !== currentChainId) {
      setCurrentChainId(chainId);
    }
  }, [chainId]);

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
                {currentChainId !== undefined && (
                   <img
                   src={`/assets/icons/${getIconNamePerChainId(currentChainId)}`}
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
