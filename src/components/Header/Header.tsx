import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import TopBarNetworkConnect from "../TopBarNetworkComponent";
import { useStyles } from "./styles";
import { useExplorer } from "../../context";

export default function Header() {
  const { classes } = useStyles();
  const explorerContext = useExplorer();
  const nftTokenPage = false;
  return (
    <AppBar position="static" color="transparent" className={clsx(classes.root)}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div className={classes.left}>
            <a href="/" className={classes.logo}>
              <img src="/assets/images/logo1.svg" alt="logo" />
            </a>
            <Box
              sx={{
                display: { xs: "none", sm: "flex", md: "flex" },
                ml: 2,
                background: "#DBD3C7",
                borderRadius: 1,
                height: 40,
              }}
            >
              <Button
                component={NavLink}
                to="/transfer"
                sx={{
                  px: 2,
                  display: "block",
                  fontSize: 18,
                  "&.active": {
                    background: "#CDC2B1",
                  },
                }}
              >
                Token Bridge
              </Button>

              {nftTokenPage && (
                <Button
                  component={NavLink}
                  to="/nft_transfer"
                  sx={{
                    px: 2,
                    display: "block",
                    fontSize: 18,
                    "&.active": {
                      background: "#CDC2B1",
                    },
                  }}
                >
                  NFT Bridge
                </Button>
              )}
            </Box>
          </div>
          <TopBarNetworkConnect
            walletConnecting={false}
            homeConfig={undefined}
            address={"0x0000"}
            getAccount={explorerContext.getAccount}
            setExplorerState={explorerContext.setExplorerState}
            explorerState={explorerContext.explorerState}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
