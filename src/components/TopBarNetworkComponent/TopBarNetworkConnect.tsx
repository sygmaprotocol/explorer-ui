import { Button, Typography } from "@mui/material"
import React, { useEffect } from "react"
import LogoutIcon from "@mui/icons-material/Logout"
import { Actions, BridgeConfig, ExplorerContext, ExplorerContextState } from "../../types"

import { getIconNamePerChainId, shortenAddress } from "../../utils/transferHelpers"
import { useStyles } from "./styles"

type TopBarNetworkConnectProps = {
  walletConnecting: boolean
  homeConfig: BridgeConfig | undefined
  address: string | undefined
  getAccount: ExplorerContext["getAccount"]
  getChainId: ExplorerContext["getChainId"]
  chainId: ExplorerContext["chainId"]
  account: ExplorerContext["account"]
  explorerContextDispatcher: React.Dispatch<Actions>
  explorerContextState?: ExplorerContextState
}

export default function TopBarNetworkConnect({ getAccount, getChainId, chainId, account, explorerContextDispatcher }: TopBarNetworkConnectProps) {
  const { classes } = useStyles()
  const [localAddress, setLocalAddress] = React.useState<string | undefined>("")
  const [isReady, setIsReady] = React.useState(false)
  const [currentChainId, setCurrentChainId] = React.useState<number | undefined>(undefined)

  const handleClickOpen = async () => {
    const account = await getAccount()
    const chainId = Number(await getChainId())

    setCurrentChainId(chainId)

    setLocalAddress(account)

    explorerContextDispatcher({
      type: "set_my_address",
      payload: account,
    })

    setIsReady(true)
  }

  const handleDisconnect = () => {
    setCurrentChainId(undefined)

    setLocalAddress("")

    explorerContextDispatcher({
      type: "set_my_address",
      payload: undefined,
    })

    setIsReady(false)
  }

  useEffect(() => {
    if (chainId !== undefined && chainId !== currentChainId) {
      setCurrentChainId(chainId)
    }

    if (account !== undefined && account !== localAddress) {
      setLocalAddress(account)
    }
  }, [chainId, account])

  return (
    <>
      <section className={classes.state}>
        {window.ethereum !== undefined &&
          (!isReady ? (
            <Button fullWidth variant="contained" onClick={handleClickOpen} sx={{ px: 3, fontSize: 18 }}>
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
                    <img src={`/assets/icons/${getIconNamePerChainId(currentChainId)}`} alt={"native token icon"} className={classes.indicator} />
                  )}
                </Typography>
                <div className={classes.accountInfo}>
                  <Typography variant="h6" className={classes.address}>
                    {shortenAddress(localAddress!)}
                  </Typography>
                  <div className={classes.logoutContainer}>
                    <div className={classes.logoutIconContainer} onClick={handleDisconnect}>
                      <LogoutIcon />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
      </section>
    </>
  )
}
