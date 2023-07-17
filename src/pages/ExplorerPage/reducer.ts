import { Transfer } from "../../types";

export type TransferActions =
  { type: "fetch_transfers", payload: Transfer[] } |
  { type: "fetch_transfer_error", payload: string } |
  { type: "fetch_transfer_by_sender", payload: Transfer[] } |
  { type: "fetch_transfer_by_sender_error", payload: string } |
  { type: 'loading_done' }

export type ExplorerPageState = {
  transfers: Transfer[],
  error: string | undefined,
  loading: "none" | "loading" | "done"
  init: boolean
}

export function reducer(state: ExplorerPageState, action: TransferActions): ExplorerPageState {
  switch(action.type) {
    case "fetch_transfers":
      return {
        ...state,
        transfers: action.payload,
        loading: "loading",
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
      }
    default:
      return state
    }
}