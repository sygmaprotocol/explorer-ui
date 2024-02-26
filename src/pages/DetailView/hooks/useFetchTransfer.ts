import { useEffect } from "react"
import history from "history/browser"
import { sanitizeTransferData } from "../../../utils/Helpers"
import { Routes, Transfer } from "../../../types"
import { DetailViewActions } from "../reducer"

export default function useFetchTransfer(routes: Routes, txHash: string, dispatcher: React.Dispatch<DetailViewActions>): void {
  const fetchTransfer = async (txHashFallback?: string): Promise<void> => {
    dispatcher({
      type: "fetch_transfer",
    })

    let transfer: Transfer | Transfer[]

    if (txHashFallback) {
      transfer = await routes.transferByTransactionHash(txHashFallback)
    } else {
      transfer = await routes.transferByTransactionHash(txHash)
    }

    const sanitizedTransfer = Array.isArray(transfer) ? sanitizeTransferData([...transfer]) : sanitizeTransferData([transfer])

    dispatcher({
      type: "set_transfer_details",
      payload: sanitizedTransfer,
    })

    dispatcher({
      type: "set_transfer_status",
      payload: "completed",
    })

    dispatcher({
      type: "update_fetching_status",
      payload: "fetching",
    })
  }

  useEffect(() => {
    if (txHash !== undefined) {
      void fetchTransfer()
    } else {
      const { pathname } = history.location
      const txHashFallback = pathname.split("/").filter(Boolean)[1]
      history.replace(history.location.pathname, { txHash, page: 1, id: "" })
      void fetchTransfer(txHashFallback)
    }
  }, [txHash])
}
