import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { sanitizeTransferData } from "../../../utils/Helpers";
import { Routes, SharedConfig, SharedConfigDomain, Transfer } from "../../../types";
import { DetailViewActions } from "../reducer";

export default function useFetchTransfer(
  routes: Routes,
  sharedConfig: SharedConfigDomain[] | [],
  setSharedConfig: React.Dispatch<React.SetStateAction<SharedConfigDomain[] | []>>,
  transferId: { id: string } | null,
  dispatcher: React.Dispatch<DetailViewActions>
) {

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId!.id);
    const sanitizedTransfer = sanitizeTransferData([transfer]);

    dispatcher({
      type: 'set_transfer_details',
      payload: sanitizedTransfer[0]
    })

    dispatcher({
      type: 'set_transfer_status',
      payload: 'completed'
    })

    dispatcher({
      type: 'update_fetching_status',
      payload: 'fetching'
    })
  };

  // fallback when you are opening the detail view on new tab
  const params = useParams();

  const getTransfersFromLocalStorage = () => {
    const transfers = localStorage.getItem("transfers");
    const { txHash } = params;
    const parsedTransfers: Transfer[] = JSON.parse(transfers!);
    const transfer = parsedTransfers.find(
      (transfer) => transfer.deposit?.txHash === txHash,
    );

    if (transfer) {
      dispatcher({
        type: 'set_transfer_details',
        payload: transfer
      })

      dispatcher({
        type: 'set_transfer_status',
        payload: 'completed'
      })

      dispatcher({
        type: 'update_fetching_status',
        payload: 'fetching'
      })
    }
  };

  const getSharedConfigFromLocalStorage = () => {
    const sharedConfig = localStorage.getItem("sharedConfig");
    const parsedSharedConfig: SharedConfig = JSON.parse(sharedConfig!);

    setSharedConfig(parsedSharedConfig.domains);
  };

  useEffect(() => {
    if (transferId !== null) {
      fetchTransfer();
    } else {
      getTransfersFromLocalStorage();
    }

    // fallback because ExplorerState is new coming to a new tab
    if (sharedConfig.length === 0) {
      getSharedConfigFromLocalStorage();
    }
  }, []);
}