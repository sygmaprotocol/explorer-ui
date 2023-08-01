import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import TopBarNetworkConnect from "../TopBarNetworkComponent";
import { useStyles } from "./styles";
import { useExplorer } from "../../context";

export default function Header() {
  const { classes } = useStyles();
  const explorerContext = useExplorer();
  const nftTokenPage = true;
  const active = true;
  return (
    <AppBar position="static" color="transparent" className={classes.root}>
      <Container maxWidth="xl" className={classes.mainAppBar}>
        <Toolbar disableGutters className={classes.toolBar}>
          <div className={classes.title}>
            <a href="/" className={classes.logo}>
              <img src="/assets/images/logo1.svg" alt="logo" />
            </a>
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "flex" },
                height: 70,
              }}
            >
              <Typography variant="h3" className={classes.titleContent}>Sygma Protocol Explorer</Typography>
            </Box>
          </div>
        </Toolbar>
        <div className={classes.connectButtonContainer}>
          <TopBarNetworkConnect
            walletConnecting={false}
            homeConfig={undefined}
            address={"0x0000"}
            getAccount={explorerContext.getAccount}
            setExplorerState={explorerContext.setExplorerState}
            explorerState={explorerContext.explorerState}
            getChainId={explorerContext.getChainId}
            chainId={explorerContext.chainId}
            account={explorerContext.account}
          />
        </div>
      </Container>
    </AppBar>
  );
}
