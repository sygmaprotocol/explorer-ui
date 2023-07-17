import { Actions, ExplorerContextState } from "../types/explorer";


export function reducer(state: ExplorerContextState, action: Actions) {
  switch (action.type) {
    case 'set_query_params':
      return {
        ...state,
        queryParams: action.payload
      }
    default:
      return state
  }
}