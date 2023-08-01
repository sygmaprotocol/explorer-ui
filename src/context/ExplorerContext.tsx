import React, { useEffect } from "react";
import {
  Actions,
  ExplorerContextState,
  ExplorerContext as ExplorerContextType,
  ExplorerState,
  PaginationParams,
  SharedConfig,
  SharedConfigDomain,
} from "../types";
import { getAccount, getChainId } from "./connection";
import { routes } from "./data";
import { reducer } from "./reducer";

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

  const explorerPageContextState: ExplorerContextState = {
    queryParams: {
      page: 1, //by default
      limit: 10,
    },
  };

  const [explorerContextState, explorerContextDispatcher] = React.useReducer(
    reducer,
    explorerPageContextState,
  );

  const [chainId, setChainId] = React.useState<number | undefined>(undefined);
  const [account, setAccount] = React.useState<string | undefined>(undefined);
  
  const [sharedConfig, setSharedConfig] = React.useState<
    SharedConfigDomain[] | []
  >([]);

  const getSharedConfig = async (): Promise<void> => {
    const reponse = await fetch(import.meta.env.VITE_SHARED_CONFIG_URL);
    const domainsData = (await reponse.json()) as SharedConfig;

    setSharedConfig(domainsData.domains);
    localStorage.setItem("sharedConfig", JSON.stringify(domainsData));
  };

  useEffect(() => {
    if (window.ethereum !== undefined) {
      window.ethereum!.on("chainChanged", (chainId: unknown) => {
        setChainId(Number(chainId as string));
      });

      window.ethereum!.on("accountsChanged", (accounts: unknown) => {
        setAccount((accounts as Array<string>)[0] as string);
      });
    }

    getSharedConfig();

    return () => {
      if (window.ethereum !== undefined) {
        window.ethereum!.removeAllListeners("chainChanged");
        window.ethereum!.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return (
    <ExplorerCtx.Provider
      value={{
        explorerState,
        loadMore,
        setExplorerState,
        explorerContextState,
        explorerContextDispatcher,
        getAccount,
        getChainId,
        chainId,
        account,
        routes: routes(),
        sharedConfig,
        setSharedConfig
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
};

export { ExplorerProvider, useExplorer };
