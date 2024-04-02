import { useEffect } from "react"
import { sanitizeTransferData } from "../../../utils/Helpers"
import { Routes, Transfer } from "../../../types"
import { DetailViewActions } from "../reducer"

export default function useFetchTransfer(routes: Routes, txHash: string, dispatcher: React.Dispatch<DetailViewActions>): void {
  const fetchTransfer = async (txHashFallback?: string): Promise<void> => {
    dispatcher({
      type: "fetching_transfer",
    })

    let transfer: Transfer | Transfer[]

    if (txHashFallback) {
      transfer = await routes.transferByTransactionHash(txHashFallback)
    } else {
      transfer = await routes.transferByTransactionHash(txHash)
    }

    const sanitizedTransfer = Array.isArray(transfer) ? sanitizeTransferData([...transfer]) : sanitizeTransferData([transfer])

    if (Array.isArray(sanitizedTransfer) && sanitizedTransfer.length > 0) {
      dispatcher({
        type: "set_transfer_details",
        payload: sanitizedTransfer,
      })

      dispatcher({
        type: "set_transfer_status",
        payload: "completed",
      })

      const isExecuted = sanitizedTransfer.length && sanitizedTransfer.every(t => t.status === "executed")

      if (isExecuted) {
        dispatcher({
          type: "set_delay",
          payload: null,
        })
      }
    }
  }

  useEffect(() => {
    void fetchTransfer()
  }, [txHash])
}
