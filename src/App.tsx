import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { Alert } from "@mui/material"
import { ExplorerPage, DetailView } from "./pages"
import { SygmaTheme } from "./themes/SygmaTheme"
import { ExplorerProvider } from "./context"
import { Header } from "./components"

export const ROUTE_LINKS = {
  Explorer: "/",
  ExplorerDetailed: "/transfer/:txHash",
}

function App(): JSX.Element {
  // ADD HERE SHARED CONFIG SUPPORT
  return (
    <ThemeProvider theme={SygmaTheme}>
      <CssBaseline />
      <ExplorerProvider>
        <Router>
          <Header />
          <Routes>
            <Route path={ROUTE_LINKS.Explorer} element={<ExplorerPage />} />
            <Route path={ROUTE_LINKS.ExplorerDetailed} element={<DetailView />} />
          </Routes>
        </Router>
      </ExplorerProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          // padding: "30px",
          width: "100%",
        }}
      >
        <Alert severity="error" variant="outlined">
          Currently Rhala network is not available for transfers!
        </Alert>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          width: "100%",
        }}
      >
        Powered by{" "}
        <a href="https://buildwithsygma.com/" target="_blank">
          <img
            src="/assets/images/full-logo.png"
            alt=""
            style={{
              width: "60px",
              marginLeft: "10px",
              display: "flex",
              flexDirection: "row",
            }}
          />
        </a>
      </div>
    </ThemeProvider>
  )
}

export default App
