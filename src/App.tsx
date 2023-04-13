import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ExplorerPage } from "./pages";
import { SygmaTheme } from "./themes/SygmaTheme";
import { ExplorerProvider } from "./context";

export const ROUTE_LINKS = {
  Explorer: "/",
  ExplorerDetailed: "/transaction/detail-view/:txId",
  TransactionPage: "/transaction/:txHash",
};

function App() {
  // ADD HERE SHARED CONFIG SUPPORT
  return (
    <ThemeProvider theme={SygmaTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path={ROUTE_LINKS.Explorer} element={
              <ExplorerProvider>
              <ExplorerPage />
            </ExplorerProvider>
          }/>            
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
