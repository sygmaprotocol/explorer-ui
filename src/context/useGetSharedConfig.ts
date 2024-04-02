import { useEffect } from "react"
import { Actions, SharedConfig } from "../types"

export function useGetSharedConfig(explorerContextDispatcher: React.Dispatch<Actions>): void {
  const getSharedConfig = async (): Promise<void> => {
    const reponse = await fetch(import.meta.env.VITE_SHARED_CONFIG_URL as string)
    const domainsData = (await reponse.json()) as SharedConfig

    explorerContextDispatcher({
      type: "fetch_shared_config",
      payload: domainsData.domains,
    })
  }

  useEffect(() => {
    void getSharedConfig()
  }, [])
}
