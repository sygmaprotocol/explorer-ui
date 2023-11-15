import { useState, useReducer } from "react"
import { Alert, Button, Container, Paper } from "@mui/material"

import { ethers } from "ethers"
import { ExplorerTable } from "../../components"

import { useExplorer } from "../../context"
import { useStyles } from "./styles"
import { ExplorerPageState, reducer } from "./reducer"
import { useGetTransferData } from "./hooks/useGetTransferData"

const initState: ExplorerPageState = {
  transfers: [],
  loading: "none",
  error: undefined,
  init: true,
}

const ExplorerPage = (): JSX.Element => {
  const explorerContext = useExplorer()
  const { explorerContextDispatcher, explorerContextState, routes, sharedConfig } = explorerContext

  const { chains } = explorerContextState

  const classes = useStyles()
  const [active, setActive] = useState(false)

  const [state, dispatcher] = useReducer(reducer, initState)

  useGetTransferData(explorerContextState.queryParams.page, explorerContextState.queryParams.limit, routes, dispatcher, state, explorerContextState)

  const handleRefreshTable = (): void => {
    const { account } = explorerContextState

    if (account) {
      explorerContextDispatcher({
        type: "set_query_params",
        payload: { page: 1, limit: 10, sender: ethers.getAddress(account) },
      })
    } else {
      explorerContextDispatcher({
        type: "set_query_params",
        payload: { page: 1, limit: 10 },
      })
    }
  }

  return (
    <Container sx={{ display: "grid", gridTemplateRows: "1fr 15fr" }}>
      <div>
        <Button variant="contained" className={classes.refreshTableButton} onClick={handleRefreshTable}>
          Refresh Table
        </Button>
      </div>
      <Paper
        elevation={3}
        sx={{
          background: "#E9E4DD",
          borderRadius: "12px",
          display: "grid",
          gridTemplateRows: "repeat(1, 1fr)",
          marginTop: state.transfers.length !== 0 ? "0px" : "10px",
        }}
      >
        <div className={state.transfers.length !== 0 ? classes.explorerTable : classes.errorMessage}>
          {state.transfers.length !== 0 && sharedConfig.length !== 0 ? (
            <ExplorerTable active={active} setActive={setActive} chains={chains} state={state} sharedConfig={sharedConfig} />
          ) : explorerContextState.account !== undefined ? (
            <Alert severity="error">No transactions for the selected account!</Alert>
          ) : (
            <Alert severity="info">Loading transfers!</Alert>
          )}
        </div>
        {state.transfers.length !== 0 && (
          <div className={classes.paginationPanel}>
            <Button
              onClick={() => {
                explorerContextDispatcher({
                  type: "set_query_params",
                  payload: {
                    page: explorerContextState.queryParams.page - 1,
                    limit: explorerContextState.queryParams.limit,
                  },
                })
              }}
              className={classes.paginationButtons}
              disabled={explorerContextState.queryParams.page === 1}
            >
              ← Previous
            </Button>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              {explorerContextState.queryParams.page}
            </span>
            <Button
              disabled={state.transfers.length === 0}
              onClick={() => {
                explorerContextDispatcher({
                  type: "set_query_params",
                  payload: {
                    page: explorerContextState.queryParams.page + 1,
                    limit: explorerContextState.queryParams.limit,
                  },
                })
              }}
              className={classes.paginationButtons}
            >
              Next →
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  )
}
export default ExplorerPage
