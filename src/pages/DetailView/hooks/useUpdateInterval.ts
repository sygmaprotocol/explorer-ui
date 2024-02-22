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
      type: "fetch_transfer",
    })

    const transfer = await routes.transferByTransactionHash(txHash)
    const sanitizedTransfer = Array.isArray(transfer) ? sanitizeTransferData([...transfer]) : sanitizeTransferData([transfer])

    dispatcher({
      type: "set_transfer_details",
      payload: sanitizedTransfer,
    })
  }

  useInterval(
    () => {
      const isExecuted = Array.isArray(state.transferDetails)
        ? state.transferDetails.every(transfer => transfer.status === "executed")
        : state.transferDetails?.status === "executed"

      if (!isExecuted) {
        void fetchUpdatedTransfer()
      } else {
        dispatcher({
          type: "update_fetching_status",
          payload: "idle",
        })
      }
    },
    state.fetchingStatus === "fetching" ? state.delay : null,
  )
}
