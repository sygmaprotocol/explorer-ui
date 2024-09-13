import React, { useEffect } from "react"

import type { ExplorerContextState, ExplorerContext as ExplorerContextType, ExplorerState } from "../types"

import { getAccount, getChainId } from "./connection"
import { routes } from "./data"
import { reducer } from "./reducer"
import { useGetTransferData } from "./useGetTransferData"
import { useGetResorceInfoPerDomain, useGetDomainMetadata } from "./useGetDomainMetadata"

const ExplorerCtx = React.createContext<ExplorerContextType | undefined>(undefined)

const ExplorerProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  const explorerPageContextState: ExplorerContextState = {
    queryParams: {
      page: 1,
      limit: 10,
    },
    isLoading: "none",
    transfers: [],
    error: undefined,
    chains: [],
    transferDetails: undefined,
    pillColorStatus: undefined,
    account: undefined,
    sharedConfig: [],
    domainMetadata: {},
    resourcesPerPage: [],
    sourceDomainsIds: [],
  }

  const [explorerContextState, explorerContextDispatcher] = React.useReducer(reducer, explorerPageContextState)

  const [chainId, setChainId] = React.useState<number | undefined>(undefined)
  const [account, setAccount] = React.useState<string | undefined>(undefined)
  const [explorerUrls, setExplorerUrls] = React.useState<[] | ExplorerState["explorerUrls"]>([])

  const { search } = window.location
  const urlParams = new URLSearchParams(search)
  const page = urlParams.get("page")

  useGetDomainMetadata(explorerContextDispatcher)

  useGetTransferData(routes(), explorerContextDispatcher, explorerContextState, Number(page))

  useGetResorceInfoPerDomain(explorerContextDispatcher, explorerContextState.sourceDomainsIds)

  useEffect(() => {
    if (window.ethereum !== undefined) {
      window.ethereum.on("chainChanged", (chainId: unknown) => {
        setChainId(Number(chainId as string))
      })

      window.ethereum.on("accountsChanged", (accounts: unknown) => {
        setAccount((accounts as Array<string>)[0])
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setExplorerUrls(JSON.parse(import.meta.env.VITE_EXPLORER_URLS))

    return () => {
      if (window.ethereum !== undefined) {
        window.ethereum.removeAllListeners("chainChanged")
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  return (
    <ExplorerCtx.Provider
      value={{
        explorerContextState,
        explorerContextDispatcher,
        getAccount,
        getChainId,
        chainId,
        account,
        routes: routes(),
        explorerUrls,
      }}
    >
      {children}
    </ExplorerCtx.Provider>
  )
}

const useExplorer = () => {
  const context = React.useContext(ExplorerCtx)

  if (context === undefined) {
    throw new Error("useExplorer must be used within a ExplorerProvider")
  }

  return context
}

export { ExplorerProvider, useExplorer }
