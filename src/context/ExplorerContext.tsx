import React, { useEffect } from "react";
import {
  Actions,
  ExplorerContext as ExplorerContextType,
  ExplorerPageState,
  ExplorerState,
  PaginationParams,
} from "../types";
import { getAccount, getChainId } from './connection'
import { routes } from "./data";

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

  const [chainId, setChainId] = React.useState<number | undefined>(undefined);
  const [account, setAccount] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    window.ethereum!.on('chainChanged', (chainId: unknown) => {
      setChainId(Number(chainId as string));
    });

    window.ethereum!.on('accountsChanged', (accounts: unknown) => {
      setAccount((accounts as Array<string>)[0] as string);
    });

    return () => {
      window.ethereum!.removeAllListeners('chainChanged');
      window.ethereum!.removeAllListeners('accountsChanged');
    }
  }, [])

  return (
    <ExplorerCtx.Provider
      value={{
        explorerState,
        loadMore,
        setExplorerState,
        explorerPageState,
        explorerPageDispatcher,
        getAccount,
        getChainId,
        chainId,
        account,
        routes
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