import React from "react";
import {
  Actions,
  ExplorerContext as ExplorerContextType,
  ExplorerPageState,
  ExplorerState,
  PaginationParams,
} from "../types";
import { getAccount } from './connection'

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
    account: undefined,
  });

  // TO BE DEFINED
  const loadMore = (options: PaginationParams) => null;

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
        setExplorerState,
        explorerPageState,
        explorerPageDispatcher,
        getAccount
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