import dayjs from "dayjs";

import { BigNumberish, ethers } from "ethers";
import { SharedConfigDomain, Transfer } from "../types";

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 6,
    address.length,
  )}`;
};

export const formatTransferDate = (transferDate: number | undefined) =>
  transferDate ? dayjs(transferDate * 1000).format("MMM D, h:mmA") : "";

export const formatAmount = (amount: BigNumberish) =>
  ethers.formatUnits(amount);

export const getColorSchemaTransferStatus = (status: number | undefined) => {
  //TODO: just for now we have passed and executed as provided in figma mockups
  switch (status) {
    case 1:
    case 2:
      return {
        borderColor: "#69C0FF",
        background: "#E6F7FF",
      };
    case 3:
      return {
        borderColor: "#389E0D",
        background: "#D9F7BE",
      };
    case 0:
    case 4:
      return {
        borderColor: "#FF4D4F",
        background: "#ff9a9b",
      };
    default:
      return {
        borderColor: "#548CA8",
        background: "#EEEEEE",
      };
  }
};

export const computeAndFormatAmount = (amount: string) => {
  const amountParsed = parseInt(amount);
  const toBigInt = BigInt(amountParsed);
  return formatAmount(toBigInt);
};

// This is for only EVM networks
export const getIconNamePerChainId = (chainId: number) => {
  switch (chainId) {
    case 5:
    case 11155111: {
      return "all.svg";
    }
    case 80001: {
      return "polygon.svg";
    }
    case 1287: {
      return "moonbeam.svg";
    }
    default: {
      return "all.svg";
    }
  }
};

export const renderStatusIcon = (
  status: string,
  classes: Record<"statusPillIcon", string>,
) => {
  switch (status) {
    case "pending":
      return (
        <img
          src={`/assets/icons/pending.svg`}
          alt="pending"
          className={classes.statusPillIcon}
        />
      );
    case "executed":
      return (
        <img
          src={`/assets/icons/success.svg`}
          alt="completed"
          className={classes.statusPillIcon}
        />
      );
    case "reverted":
    case "failed":
      return (
        <img
          src={`/assets/icons/reverted.svg`}
          alt="reverted"
          className={classes.statusPillIcon}
        />
      );
    default:
      return (
        <img
          src={`/assets/icons/pending.svg`}
          alt="pending"
          className={classes.statusPillIcon}
        />
      );
  }
};

export const renderNetworkIcon = (
  chainId: number,
  classes: Record<"networkIcon" | "substrateNetworkIcon", string>,
) => {
  switch (chainId) {
    case 5:
    case 11155111:
      return (
        <img
          src={`/assets/icons/all.svg`}
          alt="ethereum"
          className={classes.networkIcon}
        />
      );
    case 5231:
    case 5233:
      return (
        <img
          src={`/assets/icons/phala-black.svg`}
          alt="substrate"
          className={classes.substrateNetworkIcon}
        />
      );
    case 5232:
      return (
        <img
          src={`/assets/icons/khala.svg`}
          alt="substrate"
          className={classes.substrateNetworkIcon}
        />
      );
    default:
      return (
        <img
          src={`/assets/icons/all.svg`}
          alt="ethereum"
          className={classes.networkIcon}
        />
      );
  }
};

export const getDisplayedStatuses = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "executed":
      return "Executed";
    case "reverted":
      return "Reverted";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
};

export const getNetworkNames = (chainId: number) => {
  switch (chainId) {
    case 5:
      return "Goerli";
    case 11155111:
      return "Sepolia";
    case 5231:
      return "Rhala";
    case 1:
      return "Ethereum";
    case 5232:
      return "Khala";
    case 5233:
      return "Phala";
  }
};

export const getDomainData = (
  domainId: string,
  domains: SharedConfigDomain[],
): SharedConfigDomain | undefined => {
  const domainData = domains.find(
    (domain: SharedConfigDomain) => domain.id === Number(domainId),
  );
  return domainData;
};

export const getResourceInfo = (
  resourceID: string,
  domain: SharedConfigDomain,
) => {
  const resource = domain.resources.find(
    (resource) => resource.resourceId === resourceID,
  );
  const { symbol: tokenSymbol } = resource!;
  return tokenSymbol;
};

export const sanitizeTransferData = (transfers: Transfer[]) => {
  let sanitizedTransferData = [] as Transfer[];

  for (let transfer of transfers) {
    let sanitizedTransfer = {} as Transfer;
    for (let key in transfer) {
      if (transfer[key as keyof Transfer] !== null) {
        // @ts-ignore-next-line
        sanitizedTransfer[key as keyof Transfer] =
          transfer[key as keyof Transfer];
      } else {
        if (key === "resource") {
          // @ts-ignore-next-line
          sanitizedTransfer[key as keyof Transfer] = { type: "fungible" };
        }
        // @ts-ignore-next-line
        sanitizedTransfer[key as keyof Transfer] = "";
      }
    }

    sanitizedTransferData.push(sanitizedTransfer);
  }

  return sanitizedTransferData;
};

export const formatDistanceDate = (timestamp: string) => {
  const diffTime = new Date().getTime() - new Date(timestamp!).getTime();
  const dayDiffs = Math.floor(diffTime / (1000 * 3600 * 24));
  const hoursDiffs = Math.floor(diffTime / (1000 * 3600));
  const minDiff = Math.floor(diffTime / (1000 * 60));
  const hoursRemainder = Math.floor(hoursDiffs % 24);
  const minutesRemainder = Math.floor(minDiff % 60);

  const dateFormated =
    dayDiffs !== 0
      ? `${dayDiffs} days ${
          hoursDiffs > 23 && hoursRemainder !== 0
            ? `${hoursRemainder} hours`
            : `${hoursDiffs} hours`
        }`
      : hoursDiffs !== 0 ? `${hoursDiffs} hours` : `${minutesRemainder} minutes`;

  return dateFormated;
};

export const getFormatedFee = (fee: Transfer["fee"] | string) => {
  let formatedFee = "50.0 PHA";

  if (typeof fee !== "string") {
    formatedFee = `${ethers.formatEther(fee.amount).toString()} ETH`;
  }

  return formatedFee;
};
