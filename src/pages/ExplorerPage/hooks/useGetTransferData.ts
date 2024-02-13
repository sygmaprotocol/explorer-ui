import { ethers } from "ethers"
import { useEffect } from "react"

import type { ExplorerContextState, Routes } from "../../../types"
import { sanitizeTransferData } from "../../../utils/Helpers"
import type { ExplorerPageState, TransferActions } from "../reducer"

const transferData = async (page: number, limit: number, routes: Routes, dispatcher: React.Dispatch<TransferActions>): Promise<void> => {
  try {
    const transfersResponse = await routes.transfers(`${page}`, `${limit}`)
    const sanitizedTransfers = sanitizeTransferData(transfersResponse)

    localStorage.setItem("transfers", JSON.stringify(sanitizedTransfers))

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

const transferDataBySender = async (
  sender: string,
  page: number,
  limit: number,
  routes: Routes,
  dispatcher: React.Dispatch<TransferActions>,
): Promise<void> => {
  try {
    const transferResponseBySender = await routes.transferBySender(sender, `${page}`, `${limit}`)

    const sanitizedTransfers = sanitizeTransferData(transferResponseBySender)

    localStorage.setItem("transfers", JSON.stringify(sanitizedTransfers))

    dispatcher({
      type: "fetch_transfer_by_sender",
      payload: sanitizedTransfers,
    })
  } catch (e) {
    dispatcher({
      type: "fetch_transfer_by_sender_error",
      payload: "Error fetching all the transfers",
    })
  }
}

export function useGetTransferData(
  page: number,
  limit: number,
  routes: Routes,
  dispatcher: React.Dispatch<TransferActions>,
  state: ExplorerPageState,
  explorerContextState: ExplorerContextState,
): void {
  useEffect(() => {
    if (!explorerContextState.account) {
      const {
        queryParams: { page, limit },
      } = explorerContextState
      dispatcher({
        type: "loading_transfers",
      })
      void transferData(page, limit, routes, dispatcher)
    } else {
      const { account } = explorerContextState
      void transferDataBySender(ethers.getAddress(account), page, limit, routes, dispatcher)
    }
  }, [explorerContextState.account, explorerContextState.queryParams])
}
