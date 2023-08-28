import { useInterval } from "usehooks-ts"
import { DetailViewActions, DetailViewState } from "../reducer"
import { sanitizeTransferData } from "../../../utils/Helpers"
import { Routes } from "../../../types"

export default function useUpdateInterval(
  state: DetailViewState,
  dispatcher: React.Dispatch<DetailViewActions>,
  transferId: { id: string } | null,
  routes: Routes,
): void {
  const fetchUpdatedTransfer = async (): Promise<void> => {
    const transfer = await routes.transfer(transferId!.id)
    const sanitizedTransfer = sanitizeTransferData([transfer])

    dispatcher({
      type: "set_transfer_details",
      payload: sanitizedTransfer[0],
    })
  }

  useInterval(
    () => {
      if (state.transferDetails?.status !== "executed") {
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
