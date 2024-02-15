import { useEffect } from "react"
import { Actions, ExplorerContextState, Routes } from "../types"
import { sanitizeTransferData } from "../utils/Helpers"

export function useGetTransferData(routes: Routes, dispatcher: React.Dispatch<Actions>, state: ExplorerContextState, page: number): void {
  const fetchTransfers = async (): Promise<void> => {
    dispatcher({
      type: "loading_transfers",
    })

    const pageToUse = page !== 0 && page !== state.queryParams.page ? page : state.queryParams.page

    try {
      const transfers = await routes.transfers(`${pageToUse}`, `${state.queryParams.limit}`)
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
