import { useEffect } from "react";
import { Actions, ExplorerContextState, ExplorerState, Routes } from "../../../types";
import { sanitizeTransferData } from "../../../utils/Helpers";
import { ExplorerPageState, TransferActions } from "../reducer";
import { ethers } from "ethers";

const transferData = async (
  page: number,
  limit: number,
  routes: Routes,
  dispatcher: React.Dispatch<TransferActions>,
): Promise<void> => {
  try {
    const transfersResponse = await routes.transfers(
      `${page}`,
      `${limit}`,
    );
    const sanitizedTransfers = sanitizeTransferData(transfersResponse);

    localStorage.setItem("transfers", JSON.stringify(sanitizedTransfers));

    dispatcher({
      type: "fetch_transfers",
      payload: sanitizedTransfers,
    });
  } catch (e) {
    dispatcher({
      type: "fetch_transfer_error",
      payload: "Error fetching all the transfers",
    });
  }
};

const transferDataBySender = async (sender: string, page: number, limit: number, routes: Routes, dispatcher: React.Dispatch<TransferActions>,) => {
  try {
    const transferResponseBySender = await routes.transferBySender(
      sender,
      `${page}`,
      `${limit}`,
    );

    const sanitizedTransfers = sanitizeTransferData(transferResponseBySender);

    localStorage.setItem("transfers", JSON.stringify(sanitizedTransfers));
    dispatcher({
      type: "fetch_transfer_by_sender",
      payload: sanitizedTransfers,
    });
  } catch (e) {
    dispatcher({
      type: "fetch_transfer_by_sender_error",
      payload: "Error fetching all the transfers",
    });
  }
};

export function useGetTransferData(
  page: number,
  limit: number,
  routes: Routes,
  dispatcher: React.Dispatch<TransferActions>,
  explorerState: ExplorerState,
  state: ExplorerPageState,
  explorerContextState: ExplorerContextState,
  explorerContextDispatcher: React.Dispatch<Actions>,
): void {

  useEffect(() => {
    if (explorerState.account === undefined) {
      const { queryParams: { page, limit } } = explorerContextState;
      transferData(
        page,
        limit,
        routes,
        dispatcher,
      );
    }
  }, []);

  useEffect(() => {
    if (explorerState.account !== undefined) {
      const { queryParams: { page, limit } } = explorerContextState;
      transferDataBySender(ethers.getAddress(explorerState.account), page, limit, routes, dispatcher);
    }
  }, [explorerState]);

  useEffect(() => {
    if (state.loading === "loading" && state.transfers.length) {
      dispatcher({
        type: "loading_done",
      });
    }
  }, [state.loading, state.transfers]);


  useEffect(() => {
    const { queryParams: { page, limit } } = explorerContextState;
    transferData(
      page,
      limit,
      routes,
      dispatcher,
    )
  }, [explorerContextState.queryParams]);

  useEffect(() => {
    if (!explorerState.account) {
      const { queryParams: { page, limit } } = explorerContextState;
      transferData(
        page,
        limit,
        routes,
        dispatcher,
      );
    }
  }, [explorerState.account]);

}