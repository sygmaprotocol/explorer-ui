import React from "react";
import {
  Actions,
  ExplorerContext as ExplorerContextType,
  ExplorerPageState,
  ExplorerState,
  PaginationParams,
} from "../types";

const ExplorerCtx = React.createContext<ExplorerContextType | undefined>(
  undefined,
);

const ExplorerProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [explorerState, setExplorerState] = React.useState<ExplorerState>({
    isLoading: false,
    transfers: [],
    error: false,
    chains: [],
    transferDetails: undefined,
    pillColorStatus: undefined,
  });

  // TO BE DEFINED
  const loadMore = (options: PaginationParams) => null;

  const setExplorerStateContext = (state: ExplorerState) => {
    setExplorerState(state);
  };

  const explorerPageState: ExplorerPageState = {
    fromDomainId: undefined,
    toDomainId: undefined,
    fromAddress: undefined,
    toAddress: undefined,
    depositTransactionHash: undefined,
    transferDetails: {} as any,
    timelineButtonClicked: false,
    chains: [],
  };

  // TO BE DEFINED
  const explorerPageDispatcher = (action: Actions) => null;

  return (
    <ExplorerCtx.Provider
      value={{
        explorerState,
        loadMore,
        setExplorerStateContext,
        explorerPageState,
        explorerPageDispatcher,
      }}
    >
      {children}
    </ExplorerCtx.Provider>
  );
};


const useExplorer = () => {
  const context = React.useContext(ExplorerCtx);

  if (context === undefined) {
    throw new Error("useExplorer must be used within a ExplorerProvider");
  }

  return context;
}

export { ExplorerProvider, useExplorer };