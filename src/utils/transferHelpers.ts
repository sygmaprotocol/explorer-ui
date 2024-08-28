import { EnvironmentMetadata, ResourceTypes, SharedConfigDomain, Transfer } from "../types"

export const getDomainData = (domainId: string, domains: SharedConfigDomain[]): SharedConfigDomain | undefined => {
  const domainData = domains.find((domain: SharedConfigDomain) => domain.id === Number(domainId))
  return domainData
}

export const filterTransfers = (transfers: Transfer[], domainMetadata: EnvironmentMetadata): Transfer[] => {
  return transfers.filter(transfer => {
    const { fromDomainId, toDomainId } = transfer

    const fromDomainInfo = domainMetadata[Number(fromDomainId)]
    const toDomainInfo = domainMetadata[Number(toDomainId)]
    if (!fromDomainInfo || !toDomainInfo) {
      return
    }

    return transfer
  })
}

export const getResourceInfo = (resourceID: string, domain: SharedConfigDomain): string => {
  const resource = domain.resources.find(resource => resource.resourceId === resourceID)
  const { symbol: tokenSymbol } = resource!
  return tokenSymbol
}

export const renderAmountValue = (
  type: ResourceTypes,
  amount: string,
  resourceID: string,
  fromDomainInfo: SharedConfigDomain | undefined,
): string | undefined => {
  if (type === ResourceTypes.PERMISSIONLESS_GENERIC || type === ResourceTypes.SEMI_FUNGIBLE) {
    return "Contract call"
  }

  if (type === ResourceTypes.FUNGIBLE && resourceID !== "") {
    return `${amount} ${getResourceInfo(resourceID, fromDomainInfo!)}`
  }

  if (type === ResourceTypes.NON_FUNGIBLE && resourceID !== "") {
    return `${getResourceInfo(resourceID, fromDomainInfo!)}`
  }
}
