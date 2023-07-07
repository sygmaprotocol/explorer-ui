import { useState, useEffect, useReducer } from "react";
import { ethers } from "ethers";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { ExplorerTable } from "../../components";

import { useStyles } from "./styles";
import { useExplorer } from "../../context";
import { State, reducer } from "./reducer";
import { sanitizeTransferData } from "../../utils/Helpers";

const initState: State = {
  transfers: [],
  loading: "none",
  error: undefined,
  queryParams: {
    page: 1,
    limit: 10,
  },
  init: true,
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
    sharedConfig
  } = explorerContext;
  const { chains, pageInfo, isLoading } = explorerState;

  const navigate = useNavigate();

  const classes = useStyles();
  const [active, setActive] = useState(false);
  // NOTE: we are going to use the setter upon filters implementation

  const [state, dispatcher] = useReducer(reducer, initState);

  const handleTimelineButtonClick = () =>
    explorerPageDispatcher({ type: "timelineButtonClick" });

  const transferData = async () => {
    try {
      const transfersResponse = await routes.transfers(
        `${state.queryParams.page}`,
        `${state.queryParams.limit}`,
      );

      dispatcher({
        type: "fetch_transfers",
        payload: sanitizeTransferData(transfersResponse),
      });
    } catch (e) {
      dispatcher({
        type: "fetch_transfer_error",
        payload: "Error fetching all the transfers",
      });
    }
  };

  const transferDataBySender = async (sender: string) => {
    try {
      const transferResponseBySender = await routes.transferBySender(
        sender,
        `${state.queryParams.page}`,
        `${state.queryParams.limit}`,
      );
      dispatcher({
        type: "fetch_transfer_by_sender",
        payload: sanitizeTransferData(transferResponseBySender),
      });
    } catch (e) {
      dispatcher({
        type: "fetch_transfer_by_sender_error",
        payload: "Error fetching all the transfers",
      });
    }
  };

  useEffect(() => {
    if (explorerState.account === undefined && !state.init) {
      transferData();
    }
  }, []);

  useEffect(() => {
    if (explorerState.account !== undefined) {
      transferDataBySender(ethers.getAddress(explorerState.account));
    }
  }, [explorerState]);

  useEffect(() => {
    if (state.loading === "loading" && state.transfers.length) {
      dispatcher({
        type: "loading_done",
      });
    }
  }, [state.loading, state.transfers]);

  useEffect(() => {
    transferData();
  }, [state.queryParams]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "20px",
      }}
    >
      <section className={classes.mainContent}>
        <div className={classes.explorerTableContainer}>
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
          </div>
        </div>
      </section>
    </Box>
  );
};
export default ExplorerPage;
