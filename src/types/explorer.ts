export enum ProposalStatus {
  Inactive = 0,
  Active = 1,
  Passed = 2,
  Executed = 3,
  Cancelled = 4
}

export type Proposal = {
  proposalStatus: ProposalStatus;
  dataHash?: string;
  proposalEventTransactionHash?: string;
  proposalEventBlockNumber: number;
  timestamp: number;
  by: string;
}

export type DepositRecord = {
  id: string;
  fromAddress?: string;
  fromDomainId?: number;
  fromNetworkName?: string;
  toAddress?: string;
  toDomainId?: number;
  toNetworkName?: string;
  tokenAddress?: string;
  amount?: string;
  timestamp?: number;
  depositTransactionHash?: string;
  depositBlockNumber?: number;
  proposalEvents: Array<Proposal>;
  voteEvents: Array<Vote>;
  status: number;
  sourceTokenAddress: string;
  destinationTokenAddress: string;
}

export type FeeSettings = {
  type: "basic" | "feeOracle" | "none";
  address: string;
};


export type TokenConfig = {
  type: string;
  address: string;
  name?: string;
  symbol?: string;
  imageUri?: string;
  resourceId: string;
  isNativeWrappedToken?: boolean;
  decimals?: number;
  isDoubleApproval?: boolean;
  feeSettings: FeeSettings;
};

export type PageInfo = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export type ChainType = "Ethereum";

export type BridgeConfig = {
  networkId?: number;
  domainId: number;
  name: string;
  rpcUrl: string;
  type: ChainType;
  tokens: TokenConfig[];
  nativeTokenSymbol: string;
  decimals: number;
}

export type EvmBridgeConfig = BridgeConfig & {
  bridgeAddress: string;
  erc20HandlerAddress: string;
  type: "Ethereum";
  //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
  blockExplorer?: string;
  defaultGasPrice?: number;
  deployedBlockNumber?: number;
}

export type Vote = {
  voteStatus: boolean;
  voteTransactionHash?: string;
  voteBlockNumber: number;
  timestamp: number;
  dataHash: string;
  by: string;
}

export type TransferDetails = {
  id: string;
  formatedTransferDate: string;
  fromAddress?: string;
  formatedAmount: string;
  fromNetworkName?: string;
  toNetworkName?: string;
  depositTransactionHash?: string;
  fromDomainId?: number;
  toDomainId?: number;
  proposalStatus: number;
  voteEvents: Array<Vote>;
  proposalEvents: Array<Proposal>;
  timelineMessages: Array<any>;
  fromChain: EvmBridgeConfig | undefined;
  toChain: EvmBridgeConfig | undefined;
  pillColorStatus: {
    borderColor: string;
    background: string;
  };
}

export type ExplorerState = {
  isLoading: boolean;
  transfers: Array<DepositRecord>;
  pageInfo?: PageInfo;
  error: boolean;
  chains: Array<EvmBridgeConfig>;
  transferDetails?: TransferDetails;
  pillColorStatus?: {
    borderColor: string;
    background: string;
  };
  account: string | undefined
}

export type PaginationParams = {
  first?: string;
  last?: string;
  before?: string;
  after?: string;
}

export type ExplorerPageState = {
  fromDomainId?: number;
  toDomainId?: number;
  depositTransactionHash?: string;
  fromAddress?: string;
  toAddress?: string;
  transferDetails: TransferDetails;
  timelineButtonClicked: boolean;
  chains: Array<EvmBridgeConfig>;
}

export type Actions = {
  type: "setMyAddress";
  payload: string;
} | {
  type: "setDepositTransactionHash";
  payload: string;
} | {
  type: "selectFromDomainId";
  payload: number;
} | {
  type: "selectToDomainId";
  payload: number;
} | {
  type: "setTransferDetails";
  payload: DepositRecord;
} | {
  type: "cleanTransferDetails";
} | {
  type: "setTokenIconsForDetailView";
  payload: unknown;
} | {
  type: "timelineButtonClick";
};

export type ExplorerContext = {
  explorerState: ExplorerState;
  loadMore: (options: PaginationParams) => void;
  setExplorerState: React.Dispatch<React.SetStateAction<ExplorerState>>;
  explorerPageState: ExplorerPageState;
  explorerPageDispatcher: React.Dispatch<Actions>;
  getAccount: () => Promise<string>;
  getChainId: () => Promise<number>;
  chainId: number | undefined;
  account: string | undefined;
}