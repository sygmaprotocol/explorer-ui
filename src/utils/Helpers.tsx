import dayjs from "dayjs"
import { intervalToDuration } from "date-fns"

import { BigNumberish, ethers } from "ethers"
import { ResourceTypes, SharedConfigDomain, Transfer } from "../types"

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
      return "all.svg"
    }
    case 80001: {
      return "polygon.svg"
    }
    case 1287: {
      return "moonbeam.svg"
    }
    default: {
      return "all.svg"
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

  const { days, hours, minutes } = intervalToDurationResult

  let dateIntervalResult: string
  if (days !== undefined && days > 0) {
    dateIntervalResult = `${days !== undefined ? `${days} days` : ""} ${hours !== undefined && hours > 0 ? `${hours} hours` : ""}`
  } else {
    dateIntervalResult = `${hours !== undefined && hours > 0 ? `${hours} hours` : ""} ${
      minutes !== undefined && minutes > 0 ? `${minutes} minutes` : ""
    }`
  }

  return dateIntervalResult
}

export const getFormatedFee = (fee: Transfer["fee"] | string, domain: SharedConfigDomain): string => {
  let formatedFee = "50.0 PHA"

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
      return <img src={`/assets/icons/all.svg`} alt="ethereum" className={classes.networkIcon} />
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
    default:
      return <img src={`/assets/icons/all.svg`} alt="ethereum" className={classes.networkIcon} />
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
