import dayjs from "dayjs"
import { intervalToDuration, formatDistanceStrict, formatDuration } from "date-fns"

import { BigNumberish, ethers } from "ethers"
import { DomainTypes, ResourceTypes, SharedConfigDomain, Transfer } from "../types"

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

export const getDisplayedStatuses = (status: string): string => {
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

export const getNetworkNames = (chainId: number): string => {
  switch (chainId) {
    case 5:
      return "Goerli"
    case 11155111:
      return "Sepolia"
    case 5231:
      return "Rhala"
    case 1:
      return "Ethereum"
    case 5232:
      return "Khala"
    case 5233:
      return "Phala"
    case 84531:
    case 8453:
      return "Base"
    case 338:
    case 25:
      return "Cronos"
    case 17000:
      return "Holesky"
    case 80001:
      return "Mumbai"
    case 137:
      return "Polygon"
    case 100:
      return "Gnosis"
    case 421614:
      return "Arbitrum Sepolia"
    case 10200:
      return "Gnosis Chiado"
    default:
      return "Ethereum"
  }
}

export const getDomainData = (domainId: string, domains: SharedConfigDomain[]): SharedConfigDomain | undefined => {
  const domainData = domains.find((domain: SharedConfigDomain) => domain.id === Number(domainId))
  return domainData
}

export const getResourceInfo = (resourceID: string, domain: SharedConfigDomain): string => {
  const resource = domain.resources.find(resource => resource.resourceId === resourceID)
  const { symbol: tokenSymbol } = resource!
  return tokenSymbol
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

export const getFormatedFee = (fee: Transfer["fee"] | string, domain: SharedConfigDomain): string => {
  let formatedFee = "No fee"
  const { type } = domain

  if (type === DomainTypes.SUBSTRATE) {
    formatedFee = "50 PHA"
  }

  if (typeof fee !== "string" && domain) {
    const { nativeTokenDecimals, nativeTokenSymbol } = domain
    formatedFee = `${ethers.formatUnits(fee.amount, nativeTokenDecimals).toString()} ${nativeTokenSymbol.toUpperCase()}`
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
    default:
      return "Fungible"
  }
}

export const formatConvertedAmount = (amount: number): string => {
  if (typeof amount === "number") {
    const splitedConvertedAmount = amount !== 0 ? amount.toString().split(".") : ["0", "00"]

    const formatedConvertedAmount = `$${splitedConvertedAmount[0]}.${
      splitedConvertedAmount[1].length >= 3 ? splitedConvertedAmount[1].slice(0, 3) : splitedConvertedAmount[1]
    }`

    return formatedConvertedAmount
  }
  return "$0.00"
}

export const formatAmountDecimals = (amount: string): string => {
  if (!amount) return ""

  const splitedAmount = amount.split(".")

  if (splitedAmount.length === 1) return amount

  return `${splitedAmount[0]}.${splitedAmount[1].slice(0, 3)}`
}

export const renderStatusIcon = (status: string, classes: Record<"statusPillIcon", string>): JSX.Element => {
  switch (status) {
    case "pending":
      return <img src={`/assets/icons/pending.svg`} alt="pending" className={classes.statusPillIcon} />
    case "executed":
      return <img src={`/assets/icons/success.svg`} alt="completed" className={classes.statusPillIcon} />
    case "reverted":
    case "failed":
      return <img src={`/assets/icons/reverted.svg`} alt="reverted" className={classes.statusPillIcon} />
    default:
      return <img src={`/assets/icons/pending.svg`} alt="pending" className={classes.statusPillIcon} />
  }
}

export const renderNetworkIcon = (chainId: number, classes: Record<"networkIcon" | "substrateNetworkIcon", string>): JSX.Element => {
  switch (chainId) {
    case 5:
    case 11155111:
    case 17000:
      return <img src={`/assets/icons/evm.svg`} alt="ethereum" className={classes.networkIcon} />
    case 5231:
    case 5233:
      return <img src={`/assets/icons/phala-black.svg`} alt="substrate" className={classes.substrateNetworkIcon} />
    case 5232:
      return <img src={`/assets/icons/khala.svg`} alt="substrate" className={classes.substrateNetworkIcon} />
    case 84531:
    case 8453:
      return <img src={`/assets/icons/base.svg`} alt="base" className={classes.networkIcon} />
    case 338:
    case 25:
      return <img src={`/assets/icons/cronos.svg`} alt="cronos" className={classes.networkIcon} />
    case 80001:
    case 137:
      return <img src={`/assets/icons/polygon.svg`} alt="polygon" className={classes.networkIcon} />
    case 100:
    case 10200:
      return <img src={`/assets/icons/gnosis.svg`} alt="gnosis" className={classes.networkIcon} />
    case 421614:
      return <img src={`/assets/icons/arbitrum.svg`} alt="gnosis" className={classes.networkIcon} />
    default:
      return <img src={`/assets/icons/evm.svg`} alt="ethereum" className={classes.networkIcon} />
  }
}

export const renderAmountValue = (
  type: ResourceTypes,
  amount: string,
  resourceID: string,
  fromDomainInfo: SharedConfigDomain | undefined,
): string => {
  if (type !== ResourceTypes.PERMISSIONLESS_GENERIC && resourceID !== "") {
    return `${amount} ${getResourceInfo(resourceID, fromDomainInfo!)}`
  }

  return "Contract call"
}

export const renderFormatedConvertedAmount = (type: ResourceTypes, usdValue: number): string => {
  if (type !== ResourceTypes.PERMISSIONLESS_GENERIC && usdValue !== null && usdValue !== 0 && typeof usdValue === "number") {
    return formatConvertedAmount(usdValue)
  }
  return ""
}

export const txHashLinks = (type: DomainTypes, txHash: string, domainExplorerUrl: string): string => {
  switch (type) {
    case DomainTypes.EVM:
      return `${domainExplorerUrl}/tx/${txHash}`
    case DomainTypes.SUBSTRATE:
      return `${domainExplorerUrl}/extrinsic/${txHash}`
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

export const filterTransfers = (transfers: Transfer[], sharedConfig: SharedConfigDomain[]) => {

  return transfers.filter((transfer) => {
    const { fromDomainId, toDomainId } = transfer
  
    const fromDomainInfo = getDomainData(fromDomainId, sharedConfig)
    const toDomainInfo = getDomainData(toDomainId, sharedConfig)
    if(!fromDomainInfo || !toDomainInfo) {
      return
    }
  
    return transfer
  })
}
