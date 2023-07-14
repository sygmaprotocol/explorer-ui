import { useState, useReducer } from "react";
import { Button, Container, Paper } from "@mui/material";

import { ExplorerTable } from "../../components";

import { useStyles } from "./styles";
import { useExplorer } from "../../context";
import { ExplorerPageState, reducer } from "./reducer";
import { useGetTransferData } from "./hooks/useGetTransferData";

const initState: ExplorerPageState = {
  transfers: [],
  loading: "none",
  error: undefined,
  queryParams: {
    page: 1,
    limit: 10,
  },
  init: true,
  refreshData: "none",
};

const ExplorerPage = () => {
  const explorerContext = useExplorer();
  const {
    explorerState,
    loadMore,
    setExplorerState,
    explorerPageState,
    explorerPageDispatcher,
    routes,
    sharedConfig,
  } = explorerContext;
  const { chains, pageInfo, isLoading } = explorerState;

  const navigate = useNavigate();

  const classes = useStyles();
  const [active, setActive] = useState(false);

  const [state, dispatcher] = useReducer(reducer, initState);

  const handleTimelineButtonClick = () =>
    explorerPageDispatcher({ type: "timelineButtonClick" });

  useGetTransferData(
    state.queryParams.page,
    state.queryParams.limit,
    routes,
    dispatcher,
    explorerState,
    state,
  );

  const handleRefreshTable = () =>
    dispatcher({ type: "refresh_data", payload: { page: 1, limit: 10 } });

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
            handleTimelineButtonClick={handleTimelineButtonClick}
            timelineButtonClicked={explorerPageState.timelineButtonClicked}
            state={state}
            setExplorerState={setExplorerState}
            sharedConfig={sharedConfig}
          />
        </div>
        <div className={classes.paginationPanel}>
          <Button
            onClick={() => {
              dispatcher({
                type: "set_query_params",
                payload: {
                  page: state.queryParams.page - 1,
                  limit: state.queryParams.limit,
                },
              });
            }}
            className={classes.paginationButtons}
            disabled={state.queryParams.page === 1}
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
            {state.queryParams.page}
          </span>
          <Button
            onClick={() => {
              dispatcher({
                type: "set_query_params",
                payload: {
                  page: state.queryParams.page + 1,
                  limit: state.queryParams.limit,
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
