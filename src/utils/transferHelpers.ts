import dayjs from "dayjs"
import { intervalToDuration, formatDistanceStrict, formatDuration } from "date-fns"
import { BigNumberish, ethers } from "ethers"
import { DomainTypes, EnvironmentMetadata, ResourceMetadata, ResourceTypes, Transfer } from "../types"

export const shortenAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`
}

export const formatTransferDate = (transferDate: number | undefined): string =>
  transferDate ? dayjs(transferDate * 1000).format("MMM D, h:mmA") : ""

export const formatAmount = (amount: BigNumberish): BigNumberish => ethers.formatUnits(amount)

export const getColorSchemaTransferStatus = (status: number | undefined): { borderColor: string; background: string } => {
  //TODO: just for now we have passed and executed as provided in figma mockups
  switch (status) {
    case 1:
    case 2:
      return {
        borderColor: "#69C0FF",
        background: "#E6F7FF",
      }
    case 3:
      return {
        borderColor: "#389E0D",
        background: "#D9F7BE",
      }
    case 0:
    case 4:
      return {
        borderColor: "#FF4D4F",
        background: "#ff9a9b",
      }
    default:
      return {
        borderColor: "#548CA8",
        background: "#EEEEEE",
      }
  }
}

export const computeAndFormatAmount = (amount: string): BigNumberish => {
  const amountParsed = parseInt(amount)
  const toBigInt = BigInt(amountParsed)
  return formatAmount(toBigInt)
}

// This is for only EVM networks
export const getIconNamePerChainId = (chainId: number): string => {
  switch (chainId) {
    case 5:
    case 11155111: {
      return "evm.svg"
    }
    case 80001: {
      return "polygon.svg"
    }
    case 1287: {
      return "moonbeam.svg"
    }
    default: {
      return "evm.svg"
    }
  }
}

export const displayStatus = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pending"
    case "executed":
      return "Executed"
    case "reverted":
      return "Reverted"
    case "failed":
      return "Failed"
    default:
      return "Pending"
  }
}

export const sanitizeTransferData = (transfers: Transfer[]): Transfer[] => {
  const sanitizedTransferData = [] as Transfer[]

  for (const transfer of transfers) {
    const sanitizedTransfer = {} as Transfer
    for (const key in transfer) {
      if (transfer[key as keyof Transfer] !== null) {
        // @ts-ignore-next-line
        sanitizedTransfer[key as keyof Transfer] = transfer[key as keyof Transfer]
      } else {
        if (key === "resource") {
          // @ts-ignore-next-line
          sanitizedTransfer[key as keyof Transfer] = { type: "fungible" }
        } else if (key === "usdValue") {
          // @ts-ignore-next-line
          sanitizedTransfer[key as keyof Transfer] = 0
        } else {
          // @ts-ignore-next-line
          sanitizedTransfer[key as keyof Transfer] = ""
        }
      }
    }
    sanitizedTransferData.push(sanitizedTransfer)
  }

  return sanitizedTransferData
}

export const formatDistanceDate = (timestamp: string): string => {
  const intervalToDurationResult = intervalToDuration({ start: new Date(timestamp), end: new Date() })
  const distanceInDays = formatDistanceStrict(new Date(timestamp), new Date(), { unit: "day" })
  const { years, months, days, hours, minutes } = intervalToDurationResult

  if (years !== 0 || months !== 0) {
    const formatOptions = ["hours"]
    const formatInterval = formatDuration(intervalToDurationResult, { format: formatOptions })
    const formatedString = `${distanceInDays} ${formatInterval !== "" ? `and ${formatInterval} ago` : ""}`.trim()
    return formatedString
  } else if (days !== 0) {
    const formatedString = hours !== 0 ? `${distanceInDays} and ${hours!} hours ago` : `${distanceInDays} ago`
    return formatedString
  } else {
    const formatedString = hours !== 0 ? `${hours!} hours and ${minutes!} minutes ago` : `${minutes!} minutes ago`
    return formatedString
  }
}

export const getFormatedFee = (fee: Transfer["fee"]): string => {
  let formatedFee = "No fee"

  if (fee && Object.keys(fee).length) {
    const { decimals, tokenSymbol } = fee
    formatedFee = `${ethers.formatUnits(fee.amount, decimals !== 0 ? decimals : 18).toString()} ${tokenSymbol.toUpperCase()}`
  }

  return formatedFee
}

export const formatTransferType = (transferType: ResourceTypes): string => {
  switch (transferType) {
    case ResourceTypes.FUNGIBLE:
      return "Fungible"
    case ResourceTypes.NON_FUNGIBLE:
      return "Non Fungible"
    case ResourceTypes.PERMISSIONED_GENERIC:
      return "Generic"
    case ResourceTypes.PERMISSIONLESS_GENERIC:
      return "Generic"
    case ResourceTypes.SEMI_FUNGIBLE:
      return "Semifungible"
    case ResourceTypes.NATIVE:
      return "Native"
    default:
      return "Fungible"
  }
}

export const formatConvertedAmount = (amount: number): string => {
  if (typeof amount === "number") {
    const convertedAmount = amount !== 0 ? `$${amount.toFixed(1)}` : "$0.00"

    return convertedAmount
  }
  return "$0.00"
}

export const formatAmountDecimals = (amount: string): string => {
  if (!amount) return ""

  const splitedAmount = amount.split(".")

  if (splitedAmount.length === 1) return amount

  return `${splitedAmount[0]}.${splitedAmount[1].slice(0, 3)}`
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

export const getResourceInfo = (resourceID: string, resourcePerPage: ResourceMetadata[]): string => {
  const resource = resourcePerPage.find(resource => resource.resourceId === resourceID)
  if (!resource) return ""
  const { symbol: tokenSymbol } = resource
  return tokenSymbol
}

export const renderAmountValue = (
  type: ResourceTypes,
  amount: string,
  resourceID: string,
  resourcePerPage: [] | ResourceMetadata[],
): string | undefined => {
  if (type === ResourceTypes.PERMISSIONLESS_GENERIC || type === ResourceTypes.SEMI_FUNGIBLE) {
    return "Contract call"
  }

  if (resourcePerPage.length !== 0) {
    switch (type) {
      case ResourceTypes.FUNGIBLE: {
        return `${amount} ${getResourceInfo(resourceID, resourcePerPage)}`
      }
      case ResourceTypes.NON_FUNGIBLE: {
        return `${getResourceInfo(resourceID, resourcePerPage)}`
      }
      default: {
        return ""
      }
    }
  }
}

export const renderFormatedConvertedAmount = (type: ResourceTypes, usdValue: number): string => {
  if (type !== ResourceTypes.PERMISSIONLESS_GENERIC && usdValue !== null && usdValue !== 0 && typeof usdValue === "number") {
    return formatConvertedAmount(usdValue)
  }
  return ""
}

export const txHashLinks = (type: DomainTypes, domainExplorerUrl: string, txHash?: string): string => {
  switch (type) {
    case DomainTypes.EVM:
      return `${domainExplorerUrl}/tx/${txHash!}`
    case DomainTypes.SUBSTRATE:
      return `${domainExplorerUrl}/${txHash?.split("-")[0] || ""}`
    default:
      return ""
  }
}

export const accountLinks = (type: DomainTypes, accountId: string, domainExplorerUrl: string): string => {
  switch (type) {
    case DomainTypes.EVM:
      return `${domainExplorerUrl}/address/${accountId}`
    case DomainTypes.SUBSTRATE:
      return `${domainExplorerUrl}/account/${accountId}`
    default:
      return ""
  }
}
