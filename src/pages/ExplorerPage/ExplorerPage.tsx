import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { ExplorerTable } from "../../components";
import MyAllSwitch from "./MyAllSwitch";
import SelectNetwork from "./SelectNetwork";

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
  const [queryParams, setQueryParams] = useState({ page: "1", limit: "10" });

  const [state, setState] = useState<{ transfers: Transfer[] | never[], loading: "none" | "loading" | "done", isReady: boolean }>({
    transfers: [],
    loading: "none",
    isReady: false
  })

  const handleTimelineButtonClick = () =>
    explorerPageDispatcher({ type: "timelineButtonClick" });

  const transferData = async () => {
    const transfersResponse = await routes().transfers(
      queryParams.page,
      queryParams.limit,
    );
    setState((prevState) => ({
      ...prevState,
      transfers: transfersResponse,
      loading: "loading",
      isReady: true
    }))
  };

  useEffect(() => {
    transferData();
  }, []);

  useEffect(() => {
    if (state.isReady) {
      setState((prevState) => ({
        ...prevState,
        loading: "done",
      }))
    }
  }, [state.isReady]);

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
            />
            <div className={classes.paginationPanel}>
              <Button
                onClick={() =>
                  loadMore({
                    before: pageInfo?.startCursor,
                    last: "10",
                  })
                }
                className={classes.paginationButtons}
                disabled={!pageInfo?.hasPreviousPage || isLoading}
              >
                ← Previous
              </Button>
              <Button
                onClick={() =>
                  loadMore({
                    after: pageInfo?.endCursor,
                    first: "10",
                  })
                }
                className={classes.paginationButtons}
                disabled={!pageInfo?.hasNextPage || isLoading}
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
