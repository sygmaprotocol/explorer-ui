import { useState, useReducer } from "react";
import { Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { ExplorerTable } from "../../components";

import { useStyles } from "./styles";
import { useExplorer } from "../../context";
import { ExplorerPageState, reducer } from "./reducer";
import { useGetTransferData } from "./hooks/useGetTransferData";

const initState: ExplorerPageState = {
  transfers: [],
  loading: "none",
  error: undefined,
  init: true,
};

const ExplorerPage = () => {
  const explorerContext = useExplorer();
  const {
    explorerState,
    loadMore,
    setExplorerState,
    explorerContextDispatcher,
    explorerContextState,
    routes,
    sharedConfig,
  } = explorerContext;
  const { chains, pageInfo, isLoading } = explorerState;
  const navigate = useNavigate();

  const classes = useStyles();
  const [active, setActive] = useState(false);

  const [state, dispatcher] = useReducer(reducer, initState);

  useGetTransferData(
    explorerContextState.queryParams.page,
    explorerContextState.queryParams.limit,
    routes,
    dispatcher,
    explorerState,
    state,
    explorerContextState,
    explorerContextDispatcher,
  );

  const handleRefreshTable = () =>
    explorerContextDispatcher({ type: 'set_query_params', payload: { page: 1, limit: 10 } });

  const handleGoToTransferDetail = (url: string, id: string) => () => {
    explorerContextDispatcher({
      type: 'set_query_params',
      payload: { ...explorerContextState.queryParams }
    })
    navigate(url, {
      state: id,
    });
  };

  return (
    <Container sx={{ display: "grid", gridTemplateRows: "1fr 15fr" }}>
      <div>
        <Button
          variant="contained"
          sx={{ px: 0, fontSize: 18, height: 24, width: 180 }}
          onClick={handleRefreshTable}
        >
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
        }}
      >
        <div className={classes.explorerTable}>
          <ExplorerTable
            active={active}
            setActive={setActive}
            chains={chains}
            state={state}
            setExplorerState={setExplorerState}
            sharedConfig={sharedConfig}
            handleGoToTransferDetail={handleGoToTransferDetail}
          />
        </div>
        <div className={classes.paginationPanel}>
          <Button
            onClick={() => {
              explorerContextDispatcher({
                type: "set_query_params",
                payload: {
                  page: explorerContextState.queryParams.page - 1,
                  limit: explorerContextState.queryParams.limit,
                },
              });
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
              });
            }}
            className={classes.paginationButtons}
          >
            Next →
          </Button>
        </div>
      </Paper>
    </Container>
  );
};
export default ExplorerPage;
