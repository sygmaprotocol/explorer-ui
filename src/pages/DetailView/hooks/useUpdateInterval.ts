import { useInterval } from "usehooks-ts"
import { DetailViewActions, DetailViewState } from "../reducer"
import { Routes } from "../../../types"
import { sanitizeTransferData } from "../../../utils/transferHelpers"

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

    dispatcher({
      type: "update_fetching_status",
      payload: "fetching",
    })

    if (Array.isArray(sanitizedTransfer) && sanitizedTransfer.length > 0) {
      dispatcher({
        type: "update_transfer_details",
        payload: sanitizedTransfer,
      })
    }

    const isExecuted = sanitizedTransfer.length && sanitizedTransfer.every(t => t.status === "executed")

    if (isExecuted) {
      dispatcher({
        type: "set_delay",
        payload: null,
      })

      dispatcher({
        type: "set_transfer_status",
        payload: "completed",
      })
    }
  }

  useInterval(() => {
    const isExecuted =
      Array.isArray(state.transferDetails) &&
      state.transferDetails.length > 0 &&
      state.transferDetails.every(transfer => transfer.status === "executed")

    if (!isExecuted || state.fetchingStatus === "fetching") {
      void fetchUpdatedTransfer()
    }
  }, state.delay)
}
