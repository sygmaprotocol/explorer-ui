import { useEffect } from "react"
import { Actions, ExplorerContextState, Routes } from "../types"
import { sanitizeTransferData } from "../utils/Helpers"

export function useGetTransferData(routes: Routes, dispatcher: React.Dispatch<Actions>, state: ExplorerContextState): void {
  const fetchTransfers = async (): Promise<void> => {
    dispatcher({
      type: "loading_transfers",
    })

    try {
      const transfers = await routes.transfers(`${state.queryParams.page}`, `${state.queryParams.limit}`)
      const sanitizedTransfers = sanitizeTransferData(transfers)

      dispatcher({
        type: "fetch_transfers",
        payload: sanitizedTransfers,
      })

      dispatcher({
        type: "loading_done",
      })
    } catch (e) {
      dispatcher({
        type: "fetch_transfer_error",
        payload: "Error fetching all the transfers",
      })
    }
  }

  useEffect(() => {
    void fetchTransfers()
  }, [state.queryParams])
}
