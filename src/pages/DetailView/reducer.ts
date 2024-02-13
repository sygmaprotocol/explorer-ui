import type { Transfer } from "../../types"

export type DetailViewState = {
  transferDetails: Transfer | null
  transferStatus: "none" | "completed"
  clipboardMessageT1: string
  clipboardMessageT2: string
  delay: number
  fetchingStatus: "fetching" | "idle"
}

export type DetailViewActions =
  | { type: "set_transfer_details"; payload: Transfer }
  | { type: "set_transfer_status"; payload: "none" | "completed" }
  | { type: "set_clipboard_message_t1"; payload: string }
  | { type: "set_clipboard_message_t2"; payload: string }
  | { type: "update_fetching_status"; payload: "fetching" | "idle" }

export function reducer(state: DetailViewState, action: DetailViewActions): DetailViewState {
  switch (action.type) {
    case "set_transfer_details": {
      return {
        ...state,
        transferDetails: action.payload,
      }
    }
    case "set_transfer_status": {
      return {
        ...state,
        transferStatus: action.payload,
      }
    }
    case "set_clipboard_message_t1": {
      return {
        ...state,
        clipboardMessageT1: action.payload,
      }
    }
    case "set_clipboard_message_t2": {
      return {
        ...state,
        clipboardMessageT2: action.payload,
      }
    }
    case "update_fetching_status": {
      return {
        ...state,
        fetchingStatus: action.payload,
      }
    }
    default:
      return state
  }
}
