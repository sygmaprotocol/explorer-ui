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

export enum TransferStatus {
  pending = "pending",
  executed = "executed",
  failed = "failed"
}

export type Resource = {
  resourceId: string;
  type: string;
}

export type Domain = {
  id: string;
  name: string;
  lastIndexedBlock: string;
}

export type Deposit = {
  id: string;
  transfer: Transfer;
  transferId: string;
  type: string;
  txHash: string;
  blockNumber: string;
  depositData: string;
  handlerResponse: string;
}

export type Execution = {
  id: string;
  transfer: Transfer;
  transferId: string;
  type: string;
  txHash: string;
  blockNumber: string;
  executionEvent: string;
}


export type Transfer = {
  id: string;
  depositNonce: number;
  resource: Resource;
  fromDomain: Domain
  fromDomainId: string;
  toDomain: Domain;
  toDomainId: string;
  sender: string;
  destination: string;
  amount: string;
  timestamp?: number;
  status: TransferStatus;
  deposit?: Deposit;
  execution?: Execution;
  fee: any
}

export type ExplorerState = {
  isLoading: boolean;
  transfers: Array<Transfer>;
  pageInfo?: PageInfo;
  error: boolean;
  chains: Array<EvmBridgeConfig>;
  transferDetails?: any;
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
  transferDetails: any;
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
  payload: any;
} | {
  type: "cleanTransferDetails";
} | {
  type: "setTokenIconsForDetailView";
  payload: unknown;
} | {
  type: "timelineButtonClick";
};

export type Routes = {
  transfers: (page: string, limit: string, status?: string) => Promise<Transfer[]>;
  transfer: (id: string) => Promise<Transfer>;
}

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
  routes: Routes
}