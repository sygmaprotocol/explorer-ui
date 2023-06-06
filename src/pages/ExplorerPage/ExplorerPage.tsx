import { useState, useEffect } from "react";
import { ethers } from "ethers";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { ExplorerTable } from "../../components";

import { useStyles } from "./styles";
import { useExplorer } from "../../context";
import { Transfer } from "../../types";

type PreflightDetails = {
  tokenAmount: number;
  token: string;
  tokenSymbol: string;
  receiver: string;
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
  } = explorerContext;
  const { chains, pageInfo, isLoading } = explorerState;

  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(true);

  const classes = useStyles();
  const [active, setActive] = useState(false);
  // NOTE: we are going to use the setter upon filters implementation
  const [queryParams, setQueryParams] = useState({ page: 1, limit: 10 });

  const [state, setState] = useState<{
    transfers: Transfer[];
    loading: "none" | "loading" | "done";
    error: undefined | string;
  }>({
    transfers: [],
    loading: "none",
    error: undefined,
  });

  const handleTimelineButtonClick = () =>
    explorerPageDispatcher({ type: "timelineButtonClick" });

  const transferData = async () => {
    try {
      const transfersResponse = await routes.transfers(
        `${queryParams.page}`,
        `${queryParams.limit}`,
      );
      setState((prevState) => ({
        ...prevState,
        transfers: transfersResponse,
        loading: "loading",
      }));
    } catch (e) {
      setState((prevState) => ({
        ...prevState,
        error: "Error fetching all the transfers",
      }));
    }
  };

  useEffect(() => {
    if (explorerState.account === undefined) {
      transferData();
    }
  }, []);

  const transferDataBySender = async (sender: string) => {
    try {
      const transferResponseBySender = await routes.transferBySender(
        sender,
        `${queryParams.page}`,
        `${queryParams.limit}`,
      );
      setState((prevState) => ({
        ...prevState,
        transfers: transferResponseBySender,
        loading: "loading",
      }));
    } catch(e){
      setState((prevState) => ({
        ...prevState,
        error: "Error fetching current sender transfers",
      }));
    }
  };

  useEffect(() => {
    if (explorerState.account !== undefined) {
      transferDataBySender(ethers.getAddress(explorerState.account));
    }
  }, [explorerState]);

  useEffect(() => {
    if (state.loading === 'loading' && state.transfers.length) {
      setState((prevState) => ({
        ...prevState,
        loading: "done",
      }));
    }
  }, [state.loading, state.transfers]);

  const handleNextPage = () => {
    transferData();
  };

  const handlePreviousPage = () => {
    transferData();
  };

  console.table(queryParams)

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
            />
            <div className={classes.paginationPanel}>
              <Button
                onClick={() => {
                  setQueryParams((prevState) => ({
                    ...prevState,
                    page: prevState.page + 1,
                  }));
                  handlePreviousPage()
                }}
                className={classes.paginationButtons}
                disabled={queryParams.page === 1}
              >
                ← Previous
              </Button>
              <Button
                onClick={() => {
                  setQueryParams((prevState) => ({
                    ...prevState,
                    page: prevState.page + 1,
                  }));
                  handleNextPage()
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
