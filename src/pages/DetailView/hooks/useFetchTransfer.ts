import { useEffect } from "react"
import { useParams } from "react-router-dom"

import type { Routes, SharedConfig, SharedConfigDomain, Transfer } from "../../../types"
import { sanitizeTransferData } from "../../../utils/Helpers"
import type { DetailViewActions } from "../reducer"

export default function useFetchTransfer(
  routes: Routes,
  sharedConfig: SharedConfigDomain[] | [],
  setSharedConfig: React.Dispatch<React.SetStateAction<SharedConfigDomain[] | []>>,
  transferId: { id: string } | null,
  dispatcher: React.Dispatch<DetailViewActions>,
): void {
  const fetchTransfer = async (): Promise<void> => {
    const transfer = await routes.transfer(transferId!.id)
    const sanitizedTransfer = sanitizeTransferData([transfer])

    dispatcher({
      type: "set_transfer_details",
      payload: sanitizedTransfer[0],
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

  // fallback when you are opening the detail view on new tab
  const params = useParams()

  const getTransfersFromLocalStorage = (): void => {
    const transfers = localStorage.getItem("transfers")
    const { txHash } = params
    const parsedTransfers = JSON.parse(transfers!) as Transfer[]
    const transfer = parsedTransfers.find(transfer => transfer.deposit?.txHash === txHash)

    if (transfer) {
      dispatcher({
        type: "set_transfer_details",
        payload: transfer,
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
  }

  const getSharedConfigFromLocalStorage = (): void => {
    const sharedConfig = localStorage.getItem("sharedConfig")
    const parsedSharedConfig = JSON.parse(sharedConfig!) as SharedConfig

    setSharedConfig(parsedSharedConfig.domains)
  }

  useEffect(() => {
    if (transferId !== null) {
      void fetchTransfer()
    } else {
      getTransfersFromLocalStorage()
    }

    // fallback because ExplorerState is new coming to a new tab
    if (sharedConfig.length === 0) {
      getSharedConfigFromLocalStorage()
    }
  }, [])
}
