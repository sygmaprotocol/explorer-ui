import dayjs from "dayjs";
import ETHIcon from "../media/tokens/eth.png";
import WETHIcon from "../media/tokens/weth.svg";
import DAIIcon from "../media/tokens/dai.svg";
import celoUSD from "../media/tokens/cusd.svg";

import EthIcon from "../media/networks/eth.svg";
import CeloIcon from "../media/networks/celo.svg";
import EtcIcon from "../media/networks/etc.svg";
import CosmosIcon from "../media/networks/cosmos.svg";
import EthermintIcon from "../media/networks/ethermint.svg";
import PolkadotIcon from "../media/networks/polkadot.svg";
import { BigNumberish, ethers } from "ethers";
import { EvmBridgeConfig } from "../types";

export const isCelo = (networkId?: number) =>
  [42220, 44787, 62320].includes(networkId ?? 0);

export const shortenAddress = (address: string) => {
  return `${address.substr(0, 6)}...${address.substr(address.length - 6, 6)}`;
};

export const getNetworkName = (id: any) => {
  switch (Number(id)) {
    case 5:
      return "Localhost";
    case 1:
      return "Mainnet";
    case 3:
      return "Ropsten";
    case 4:
      return "Rinkeby";
    // case 5:
    //   return "Goerli";
    case 6:
      return "Kotti";
    case 42:
      return "Kovan";
    case 61:
      return "Ethereum Classic - Mainnet";
    case 42220:
      return "CELO - Mainnet";
    case 44787:
      return "CELO - Alfajores Testnet";
    case 62320:
      return "CELO - Baklava Testnet";
    default:
      return "Other";
  }
};

export const selectToken = (
  config: EvmBridgeConfig | undefined,
  tokenAddress: string,
) => config?.tokens.find((token) => token.address === tokenAddress);

export const getNetworkIcon = (config: EvmBridgeConfig | undefined) => {
  if (config === undefined) {
    return undefined;
  }
  if (isCelo(config.networkId)) {
    return CeloIcon;
  } else {
    return EthIcon;
  }
};

export const formatTransferDate = (transferDate: number | undefined) =>
  transferDate ? dayjs(transferDate * 1000).format("MMM D, h:mmA") : "";

export const formatAmount = (amount: BigNumberish) =>
  ethers.formatUnits(amount);

export const getRandomSeed = () => {
  const arr = new Uint8Array(20);
  const randomValues = crypto.getRandomValues(arr);
  const randomString = Array.from(randomValues, (val) =>
    val.toString(16).padStart(2, "0"),
  ).join("");

  return randomString;
};

export const getProposalStatus = (status: number | undefined) => {
  switch (status) {
    case 0:
      return "Inactive";
    case 1:
      return "Active";
    case 2:
      return "Passed";
    case 3:
      return "Executed";
    case 4:
      return "Cancelled";
    default:
      return "No status";
  }
};

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

const formatDateTimeline = (date: number) => dayjs(date).format("h:mma");

export const selectChains = (
  chains: Array<EvmBridgeConfig>,
  fromDomainId: number,
  toDomainId: number,
) => {
  const fromChain = chains.find((chain) => chain.domainId === fromDomainId);
  const toChain = chains.find((chain) => chain.domainId === toDomainId);

  return { fromChain, toChain };
};

export const computeTransferDetails = (
  txDetails: any,
  chains: Array<EvmBridgeConfig>,
): any => {
  const {
    timestamp,
    fromAddress,
    proposalEvents,
    amount,
    fromNetworkName,
    toNetworkName,
    depositTransactionHash,
    fromDomainId,
    toDomainId,
    status: proposalStatus,
    voteEvents,
    id,
  } = txDetails;

  const { fromChain, toChain } = selectChains(
    chains,
    fromDomainId!,
    toDomainId!,
  );

  const formatedTransferDate = formatTransferDate(timestamp);

  const formatedAmount = computeAndFormatAmount(amount!);

  const pillColorStatus = getColorSchemaTransferStatus(proposalStatus);

  let timelineMessages = [];

  if (!proposalEvents.length && !voteEvents.length) {
    timelineMessages = [
      {
        message: "Deposit submitted",
        time: formatDateTimeline(timestamp!),
      },
    ];
  } else {
    const votesMessages = voteEvents.map((vote: { timestamp: number, by: string }) => ({
      message: `Confirmed by`,
      time: formatDateTimeline(vote.timestamp),
      by: vote.by,
    }));

    switch (proposalEvents.length) {
      case 1: {
        const firstMessage = {
          message: "Deposit submitted",
          time: formatDateTimeline(proposalEvents[0].timestamp),
        };
        const createdBy = {
          message: `Proposal created by`,
          time: formatDateTimeline(proposalEvents[0].timestamp),
          by: proposalEvents[0].by,
        };

        let waitingForMoreVotesMsg = {
          message: "Waiting for more votes",
          time: formatDateTimeline(proposalEvents[0].timestamp),
        };

        if (!voteEvents.length) {
          timelineMessages = [
            firstMessage,
            createdBy,
            waitingForMoreVotesMsg,
          ] as any;
          break;
        } else {
          timelineMessages = [
            firstMessage,
            createdBy,
            ...votesMessages,
            waitingForMoreVotesMsg,
          ] as any;

          break;
        }
      }
      default: {
        timelineMessages = proposalEvents.reduce((acc: any, proposal: { timestamp: number, proposalStatus: number }, idx: number) => {
          if (idx === 0) {
            acc = [
              {
                message: "Deposit submitted",
                time: formatDateTimeline(proposal.timestamp),
              },
              {
                message: `Proposal created by`,
                time: formatDateTimeline(proposal.timestamp),
                by: proposalEvents[0].by,
              },
              ...votesMessages,
            ];
            return acc;
          }

          if (proposalStatus === 4) {
            acc = [
              ...acc,
              {
                message: `Proposal cancel by`,
                time: formatDateTimeline(proposal.timestamp),
                by: proposalEvents[0].by,
              },
              {
                message: "Transfer canceled",
                time: formatDateTimeline(proposal.timestamp),
              },
            ];
            return acc;
          } else if (proposalStatus === 2) {
            acc = [
              ...acc,
              {
                message: `Proposal passed by`,
                time: formatDateTimeline(proposal.timestamp),
                by: proposalEvents[0].by,
              },
              {
                message: "Waiting for execution",
                time: formatDateTimeline(proposal.timestamp),
              },
            ];
            return acc;
          } else if (proposalStatus === 3 && proposal.proposalStatus === 3) {
            acc = [
              ...acc,
              {
                message: `Proposal passed by`,
                time: formatDateTimeline(proposal.timestamp),
                by: proposalEvents[0].by,
              },
              {
                message: `Proposal executed by`,
                time: formatDateTimeline(proposal.timestamp),
                by: proposalEvents[0].by,
              },
              {
                message: `Transfer executed on ${toChain?.name}`,
                time: formatDateTimeline(proposal.timestamp),
              },
            ];
            return acc;
          }
          return acc;
        }, []);
        break;
      }
    }
  }


  return {
    id,
    formatedTransferDate,
    fromAddress,
    formatedAmount,
    fromNetworkName,
    toNetworkName,
    depositTransactionHash,
    fromDomainId,
    toDomainId,
    voteEvents,
    proposalEvents,
    proposalStatus,
    timelineMessages,
    fromChain,
    toChain,
    pillColorStatus,
  };
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