import { useInterval } from "usehooks-ts"
import { DetailViewActions, DetailViewState } from "../reducer"
import { sanitizeTransferData } from "../../../utils/Helpers"
import { Routes } from "../../../types"

export default function useUpdateInterval(
  state: DetailViewState,
  dispatcher: React.Dispatch<DetailViewActions>,
  txHash: string,
  routes: Routes,
): void {
  const fetchUpdatedTransfer = async (): Promise<void> => {
    dispatcher({
      type: "fetching_transfer",
    })

    const transfer = await routes.transferByTransactionHash(txHash)
    const sanitizedTransfer = Array.isArray(transfer) ? sanitizeTransferData([...transfer]) : sanitizeTransferData([transfer])

    if (Array.isArray(sanitizedTransfer) && sanitizedTransfer.length > 0) {
      dispatcher({
        type: "update_transfer_details",
        payload: sanitizedTransfer,
      })

      dispatcher({
        type: "set_transfer_status",
        payload: "completed",
      })
    }

    const isExecuted = sanitizedTransfer.length && sanitizedTransfer.every(t => t.status === "executed")
    if (isExecuted) {
      dispatcher({
        type: "set_delay",
        payload: null,
      })
    }
  }
  useInterval(() => {
    const isExecuted =
      Array.isArray(state.transferDetails) &&
      state.transferDetails.length > 0 &&
      state.transferDetails.every(transfer => transfer.status === "executed")

    console.log("🚀 ~ isExecuted:", isExecuted)

    if (!isExecuted || state.isLoading === "loading") {
      void fetchUpdatedTransfer()
    }
  }, state.delay)
}
