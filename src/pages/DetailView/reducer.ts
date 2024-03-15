import { Transfer } from "../../types"

export type DetailViewState = {
  transferDetails: Transfer[] | null
  transferStatus: "none" | "completed"
  clipboardMessageT1: string
  clipboardMessageT2: string
  delay: number | null
  fetchingStatus: "fetching" | "idle"
  isLoading: "none" | "loading" | "done"
  fallbackPage: number
}

export type DetailViewActions =
  | { type: "set_transfer_details"; payload: Transfer[] }
  | { type: "set_transfer_status"; payload: "none" | "completed" }
  | { type: "set_clipboard_message_t1"; payload: string }
  | { type: "set_clipboard_message_t2"; payload: string }
  | { type: "update_fetching_status"; payload: "fetching" | "idle" }
  | { type: "fetching_transfer" }
  | { type: "update_transfer_details"; payload: Transfer[] }
  | { type: "set_delay"; payload: number | null }

export function reducer(state: DetailViewState, action: DetailViewActions): DetailViewState {
  switch (action.type) {
    case "set_transfer_details": {
      return {
        ...state,
        transferDetails: [...action.payload],
        isLoading: "done",
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
    case "fetching_transfer": {
      return {
        ...state,
        isLoading: state.transferDetails?.length ? "done" : "loading",
      }
    }
    case "update_transfer_details": {
      return {
        ...state,
        transferDetails: [...action.payload],
      }
    }
    case "set_delay": {
      return {
        ...state,
        delay: action.payload,
        fetchingStatus: "idle",
      }
    }
    default:
      return state
  }
}
