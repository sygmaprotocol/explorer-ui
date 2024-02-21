export type FeeSettings = {
  type: "basic" | "feeOracle" | "none"
  address: string
}

export type TokenConfig = {
  type: string
  address: string
  name?: string
  symbol?: string
  imageUri?: string
  resourceId: string
  isNativeWrappedToken?: boolean
  decimals?: number
  isDoubleApproval?: boolean
  feeSettings: FeeSettings
}

export type PageInfo = {
  hasPreviousPage: boolean
  hasNextPage: boolean
  startCursor: string
  endCursor: string
}

export type ChainType = "Ethereum"

export type BridgeConfig = {
  networkId?: number
  domainId: number
  name: string
  rpcUrl: string
  type: ChainType
  tokens: TokenConfig[]
  nativeTokenSymbol: string
  decimals: number
}

export type EvmBridgeConfig = BridgeConfig & {
  bridgeAddress: string
  erc20HandlerAddress: string
  type: "Ethereum"
  //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
  blockExplorer?: string
  defaultGasPrice?: number
  deployedBlockNumber?: number
}

export enum TransferStatus {
  pending = "pending",
  executed = "executed",
  failed = "failed",
}

export type Resource = {
  id: string
  type: string
}

export type Domain = {
  id: string
  name: string
  lastIndexedBlock: string
}

export type Deposit = {
  id: string
  transfer: Transfer
  transferId: string
  type: string
  txHash: string
  blockNumber: string
  depositData: string
  handlerResponse: string
  timestamp: string
}

export type Execution = {
  id: string
  transfer: Transfer
  transferId: string
  type: string
  txHash: string
  blockNumber: string
  executionEvent: string
  timestamp: string
}

export type Transfer = {
  id: string
  depositNonce: number
  resource: Resource
  fromDomain: Domain
  fromDomainId: string
  toDomain: Domain
  toDomainId: string
  sender: string
  destination: string
  amount: string
  timestamp?: string
  status: TransferStatus
  deposit?: Deposit
  execution?: Execution
  fee: { amount: string; tokenAddress: string; tokenSymbol: string }
  resourceID: string
  usdValue: number
  accountId: string
}

export type ExplorerState = {
  isLoading: boolean
  transfers: Array<Transfer>
  pageInfo?: PageInfo
  error: boolean
  chains: Array<EvmBridgeConfig>
  transferDetails?: any
  pillColorStatus?: {
    borderColor: string
    background: string
  }
  account: string | undefined
  explorerUrls: [] | [{ id: number; url: string }]
}

export type PaginationParams = {
  first?: string
  last?: string
  before?: string
  after?: string
}

export type ExplorerContextState = {
  queryParams: {
    page: number
    limit: number
    sender?: string
  }
  isLoading: "none" | "loading" | "done"
  transfers: Array<Transfer>
  pageInfo?: PageInfo
  error?: string
  chains: Array<EvmBridgeConfig>
  transferDetails?: any
  pillColorStatus?: {
    borderColor: string
    background: string
  }
  account: string | undefined
}

export type Actions =
  | {
      type: "set_my_address"
      payload: string | undefined
    }
  | {
      type: "set_query_params"
      payload: { page: number; limit: number; sender?: string }
    }
  | {
      type: "fetch_transfers"
      payload: Transfer[]
    }
  | { type: "loading_done" }
  | { type: "loading_transfers" }
  | { type: "fetch_transfer_error"; payload: string }

export type Routes = {
  transfers: (page: string, limit: string, status?: string) => Promise<Transfer[]>
  transfer: (id: string) => Promise<Transfer>
  transferBySender: (sender: string, page: string, limit: string) => Promise<Transfer[]>
}

export type ExplorerContext = {
  explorerContextState: ExplorerContextState
  explorerContextDispatcher: React.Dispatch<Actions>
  getAccount: () => Promise<string>
  getChainId: () => Promise<number>
  chainId: number | undefined
  account: string | undefined
  routes: Routes
  sharedConfig: SharedConfigDomain[] | []
  setSharedConfig: React.Dispatch<React.SetStateAction<SharedConfigDomain[] | []>>
  explorerUrls: [] | ExplorerState["explorerUrls"]
}

export const enum ResourceTypes {
  FUNGIBLE = "fungible",
  NON_FUNGIBLE = "nonFungible",
  PERMISSIONED_GENERIC = "permissionedGeneric",
  PERMISSIONLESS_GENERIC = "permissionlessGeneric",
}

export type SharedConfig = {
  domains: Array<SharedConfigDomain>
}

export enum DomainTypes {
  EVM = "evm",
  SUBSTRATE = "substrate",
}

export type SharedConfigDomain = {
  id: number
  name: string
  chainId: number
  type: DomainTypes
  bridge: string
  feeHandlers: Array<FeeHandlerType>
  handlers: Array<Handler>
  nativeTokenSymbol: string
  nativeTokenDecimals: number
  startBlock: number
  resources: Array<SharedConfigResource>
}
type Handler = {
  type: ResourceTypes
  address: string
}

type FeeHandlerType = {
  type: string
  address: string
}

export type SharedConfigResource = {
  resourceId: string
  type: ResourceTypes
  address: string
  symbol: string
  decimals: number
}

export type SubstrateSharedConfigResource = Pick<SharedConfigResource, "resourceId" | "type" | "symbol" | "decimals"> & {
  native: boolean
  assetName: string
  xcmMultiAssetId: {
    concrete: {
      parents: number
      interior: string
    }
  }
}
