import { useEffect } from "react"
import { Actions, EnvironmentMetadata } from "../types"

export function useGetSharedConfig(explorerContextDispatcher: React.Dispatch<Actions>): void {
  const getSharedConfig = async (): Promise<void> => {
    const reponse = await fetch(`${import.meta.env.VITE_SHARED_CONFIG_URL as string}/api/domains/metadata`)
    const domainsData = (await reponse.json()) as EnvironmentMetadata

    explorerContextDispatcher({
      type: "fetch_domain_metadata",
      payload: domainsData,
    })
  }

  useEffect(() => {
    void getSharedConfig()
  }, [])
}
