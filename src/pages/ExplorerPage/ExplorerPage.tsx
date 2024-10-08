import { useState } from "react"
import { Alert, Button, Container, Paper } from "@mui/material"

import { ethers } from "ethers"
import { ExplorerTable } from "../../components"

import { useExplorer } from "../../context"
import { useStyles } from "./styles"

const ExplorerPage = (): JSX.Element => {
  const explorerContext = useExplorer()
  const { explorerContextDispatcher, explorerContextState } = explorerContext

  const { transfers } = explorerContextState

  const { chains } = explorerContextState

  const classes = useStyles()
  const [active, setActive] = useState(false)

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

    history.replaceState(null, "", `/`)
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
          marginTop: transfers.length !== 0 ? "0px" : "10px",
        }}
      >
        <div className={transfers.length !== 0 ? classes.explorerTable : classes.errorMessage}>
          {transfers.length !== 0 && explorerContextState.domainMetadata ? (
            <ExplorerTable
              active={active}
              setActive={setActive}
              chains={chains}
              state={explorerContextState}
              sharedConfig={explorerContextState.sharedConfig}
              domainMetadata={explorerContextState.domainMetadata}
            />
          ) : explorerContextState.account !== undefined ? (
            <Alert severity="error">No transactions for the selected account!</Alert>
          ) : (
            <Alert severity="info">Loading transfers!</Alert>
          )}
        </div>
        {transfers.length !== 0 && (
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
                history.replaceState(null, "", `?page=${explorerContextState.queryParams.page - 1}`)
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
              disabled={transfers.length === 0}
              onClick={() => {
                explorerContextDispatcher({
                  type: "set_query_params",
                  payload: {
                    page: explorerContextState.queryParams.page + 1,
                    limit: explorerContextState.queryParams.limit,
                  },
                })
                history.replaceState(null, "", `?page=${explorerContextState.queryParams.page + 1}`)
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
