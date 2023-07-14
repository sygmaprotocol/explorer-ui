import { Transfer } from "../../types";

export type TransferActions =
  { type: "fetch_transfers", payload: Transfer[] } |
  { type: "fetch_transfer_error", payload: string } |
  { type: "fetch_transfer_by_sender", payload: Transfer[] } |
  { type: "fetch_transfer_by_sender_error", payload: string } |
  { type: 'loading_done' } |
  { type: 'set_query_params', payload: { page: number, limit: number } } |
  { type: 'refresh_data', payload: { page: number, limit: number } }

export type ExplorerPageState = {
  transfers: Transfer[],
  error: string | undefined,
  queryParams: {
    page: number,
    limit: number,
  }
  loading: "none" | "loading" | "done"
  init: boolean
  refreshData: "none" | "refresh" | "done"
}

export function reducer(state: ExplorerPageState, action: TransferActions): ExplorerPageState {
  switch(action.type) {
    case "fetch_transfers":
      return {
        ...state,
        transfers: action.payload,
        loading: "loading",
        init: !(state.transfers.length === 0) // signals first load
      }
    case "fetch_transfer_error":
      return {
        ...state,
        error: action.payload,
        loading: "none"
      }
    case "fetch_transfer_by_sender":
      return {
        ...state,
        transfers: action.payload,
        loading: "loading"
      }
    case "fetch_transfer_by_sender_error":
      return {
        ...state,
        error: action.payload,
        loading: "none"
      }
    case 'loading_done':
      return {
        ...state,
        loading: 'done',
        refreshData: 'done'
      }
    case 'set_query_params':
      return {
        ...state,
        queryParams: action.payload
      }
    case 'refresh_data':
      return {
        ...state,
        refreshData: 'refresh',
        queryParams: action.payload
      }
    default:
      return state
    }
}