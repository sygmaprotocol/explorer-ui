import dayjs from "dayjs";

import { BigNumberish, ethers } from "ethers";

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`;
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

// NOTE: this is provisional until we fetch shared config and we match what we are getting from the ethereum provider with the networkId property in the shared config
export const getIconNamePerChainId = (chainId: number) => {
  switch (chainId) {
    case 5: {
      return "all.svg";
    }
    case 80001: {
      return "polygon.svg";
    }
    case 1287: {
      return  "moonbeam.svg";
    }
    case 11155111: {
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
    case "completed":
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

// NOTE: this is temporary, will be removed once we definition regarding shared config and api
// question to answer here: should we use chain id to mapp for icons?
export const renderNetworkIcon = (
  id: string,
  classes: Record<"networkIcon", string>,
) => {
  switch (id) {
    case "0":
    case "3":
      return (
        <img
          src={`/assets/icons/all.svg`}
          alt="ethereum"
          className={classes.networkIcon}
        />
      );
    case "1":
      return (
        <img
          src={`/assets/icons/polygon.svg`}
          alt="polygon"
          className={classes.networkIcon}
        />
      );
    case "2":
      return (
        <img
          src={`/assets/icons/moonbeam.svg`}
          alt="moonbeam"
          className={classes.networkIcon}
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
    case "completed":
      return "Completed";
    case "reverted":
      return "Reverted";
    case 'failed':
      return "Failed";
    default:
      return "Pending";
  }
};