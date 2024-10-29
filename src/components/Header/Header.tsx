import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material"
import { useStyles } from "./styles"
import TopBarNetworkConnect from "../TopBarNetworkComponent"
import { useExplorer } from "../../context"

export default function Header() {
  const { classes } = useStyles()
  const explorerContext = useExplorer()
  const { explorerContextState } = explorerContext

  return (
    <AppBar position="static" color="transparent" className={classes.root}>
      <Container maxWidth="xl" className={classes.mainAppBar}>
        <Box display={"flex"} flexGrow={"2"}>
          <a href="/" className={classes.logo}>
            <img src="/assets/images/logo1.svg" alt="logo" />
          </a>
          <Typography marginTop={"5px"} variant="h5" className={classes.titleContent}>
            Sygma Protocol Explorer
          </Typography>
        </Box>
        <Box display={"flex"} flexGrow={"1"} justifyContent={"end"}>
          <TopBarNetworkConnect
            walletConnecting={false}
            homeConfig={undefined}
            address={"0x0000"}
            getAccount={explorerContext.getAccount}
            getChainId={explorerContext.getChainId}
            chainId={explorerContext.chainId}
            account={explorerContext.account}
            explorerContextDispatcher={explorerContext.explorerContextDispatcher}
            explorerContextState={explorerContextState}
          />
        </Box>
      </Container>
    </AppBar>
  )
}
