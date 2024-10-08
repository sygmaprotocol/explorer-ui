import { useEffect } from "react"
import { Actions, EnvironmentMetadata, ResourceMetadata } from "../types"

export function useGetDomainMetadata(explorerContextDispatcher: React.Dispatch<Actions>): void {
  const getDomainMetadata = async (): Promise<void> => {
    const reponse = await fetch(`${import.meta.env.VITE_INDEXER_URL as string}/api/domains/metadata`)
    const domainsData = (await reponse.json()) as EnvironmentMetadata

    explorerContextDispatcher({
      type: "fetch_domain_metadata",
      payload: domainsData,
    })
  }

  useEffect(() => {
    void getDomainMetadata()
  }, [])
}

export function useGetResorceInfoPerDomain(explorerContextDispatcher: React.Dispatch<Actions>, sourceDomainIds: number[]): void {
  const getResourceDomainMetadata = async (): Promise<void> => {
    const resourcesPerPage = []
    for (const domainId of sourceDomainIds) {
      const resourceInfo = await fetch(`${import.meta.env.VITE_INDEXER_URL as string}/api/domains/${domainId}/resources`)
      const resourceData = (await resourceInfo.json()) as ResourceMetadata[]
      resourcesPerPage.push(...resourceData)
    }

    explorerContextDispatcher({
      type: "set_resources_per_page",
      payload: resourcesPerPage,
    })
  }

  useEffect(() => {
    if (sourceDomainIds.length > 0) {
      void getResourceDomainMetadata()
    }
  }, [sourceDomainIds])
}
