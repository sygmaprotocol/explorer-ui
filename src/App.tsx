import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"
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
    </ThemeProvider>
  )
}

export default App
