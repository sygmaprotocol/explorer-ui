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

export type Fee = {
  amount: string
  id: string
  tokenAddress: string
  tokenSymbol: string
  transferId: string
  decimals: number
}

export type Transfer = {
  id: string
  depositNonce: number
  resource: Resource
  fromDomain: Domain
  fromDomainId: number
  toDomain: Domain
  toDomainId: number
  sender: string
  destination: string
  amount: string
  timestamp?: string
  status: TransferStatus
  deposit?: Deposit
  execution?: Execution
  fee: Fee
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

export type DomainMetadata = {
  url: string // icon url
  name: string
  type: DomainTypes
  caipId: string
  nativeTokenSymbol: string
  nativeTokenDecimals: number
  nativeTokenFullName: string
  blockExplorerUrl: string
  renderName: string
}

export type ResourceMetadata = {
  caip19: string
  symbol: string
  decimals: number
  resourceId: string
}

export type EnvironmentMetadata = Record<number, DomainMetadata>

export type EnvironmentResourcesMetadata = Record<number, ResourceMetadata[]>

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
  sharedConfig: SharedConfigDomain[] | []
  domainMetadata: EnvironmentMetadata | {}
  resourcesPerPage: ResourceMetadata[] | []
  sourceDomainsIds: number[] | []
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
  | { type: "fetch_shared_config"; payload: SharedConfigDomain[] }
  | { type: "fetch_domain_metadata"; payload: EnvironmentMetadata }
  | { type: "set_resources_per_page"; payload: ResourceMetadata[] }
  | { type: "set_source_domains_ids"; payload: number[] }

export type Routes = {
  transfers: (page: string, limit: string, status?: string) => Promise<Transfer[]>
  transfer: (id: string) => Promise<Transfer>
  transferBySender: (sender: string, page: string, limit: string) => Promise<Transfer[]>
  transferByTransactionHash: (txHash: string) => Promise<Transfer | Transfer[]>
}

export type ExplorerContext = {
  explorerContextState: ExplorerContextState
  explorerContextDispatcher: React.Dispatch<Actions>
  getAccount: () => Promise<string>
  getChainId: () => Promise<number>
  chainId: number | undefined
  account: string | undefined
  routes: Routes
  explorerUrls: [] | ExplorerState["explorerUrls"]
}

export const enum ResourceTypes {
  FUNGIBLE = "fungible",
  NON_FUNGIBLE = "nonfungible",
  PERMISSIONED_GENERIC = "permissionedGeneric",
  PERMISSIONLESS_GENERIC = "permissionlessGeneric",
  SEMI_FUNGIBLE = "semifungible",
  NATIVE = "native",
}

export type SharedConfig = {
  domains: Array<SharedConfigDomain>
}

export enum DomainTypes {
  EVM = "evm",
  SUBSTRATE = "substrate",
  BTC = "bitcoin",
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
