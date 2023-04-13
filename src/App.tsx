import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ExplorerPage, TransactionPage } from "./pages";
import { ethers } from "ethers";
import { Header } from "./components";
import { SygmaTheme } from "./themes/SygmaTheme";

export const ROUTE_LINKS = {
  Explorer: "/",
  ExplorerDetailed: "/transaction/detail-view/:txId",
  TransactionPage: "/transaction/:txHash",
};

function App() {
  // ADD HERE SHARED CONFIG SUPPORT
  const { chains } = sygmaConfig();

  const tokens = chains
    .filter((c) => c.type === "Ethereum")
    .reduce((tca, bc: any) => {
      if (bc.networkId) {
        return {
          ...tca,
          [bc.networkId]: bc.tokens,
        };
      } else {
        return tca;
      }
    }, {});

  const rpcUrls = chains.reduce(
    (acc, { networkId, rpcUrl }) => ({ ...acc, [networkId!]: rpcUrl }),
    {}
  );
  console.log("explorer UI", chains);
  return (
    <ThemeProvider theme={SygmaTheme}>
      <CssBaseline />
      {/* <LocalProvider
        networkIds={[5]}
        checkNetwork={false}
        tokensToWatch={tokens}
        onboardConfig={{
          walletSelect: {
            wallets: [
              { walletName: "metamask" },
              {
                walletName: "walletConnect",
                rpc: { ...rpcUrls },
                bridge: "https://bridge.walletconnect.org",
              },
            ],
          },
          subscriptions: {
            network: (network: any) =>
              network && console.log("domainId: ", network),
            balance: (amount: any) =>
              amount && console.log("balance: ", ethers.formatEther(amount)),
          },
        }}
      >
        <SygmaProvider chains={chains}> */}
          <Header />
          <Router>
            <Routes>
              <Route exact path={ROUTE_LINKS.Explorer}>
                <ExplorerProvider>
                  <ExplorerPage />
                </ExplorerProvider>
              </Route>
            </Routes>
          </Router>
        {/* </SygmaProvider> */}
      {/* </LocalProvider> */}
    </ThemeProvider>
  );
}

export default App;
