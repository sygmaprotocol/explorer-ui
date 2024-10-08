import { Actions, ExplorerContextState } from "../types/explorer"

export function reducer(state: ExplorerContextState, action: Actions): ExplorerContextState {
  switch (action.type) {
    case "set_query_params":
      return {
        ...state,
        queryParams: action.payload,
      }
    case "set_my_address": {
      return {
        ...state,
        account: action.payload,
      }
    }
    case "fetch_transfers":
      return {
        ...state,
        transfers: action.payload,
      }
    case "loading_done":
      return {
        ...state,
        isLoading: "done",
      }
    case "loading_transfers":
      return {
        ...state,
        isLoading: "loading",
      }
    case "fetch_transfer_error":
      return {
        ...state,
        error: action.payload,
      }
    case "fetch_shared_config":
      return {
        ...state,
        sharedConfig: action.payload,
      }
    case "fetch_domain_metadata": {
      return {
        ...state,
        domainMetadata: action.payload,
      }
    }
    case "set_resources_per_page": {
      return {
        ...state,
        resourcesPerPage: action.payload,
      }
    }
    case "set_source_domains_ids": {
      return {
        ...state,
        sourceDomainsIds: action.payload,
      }
    }
    default:
      return state
  }
}
