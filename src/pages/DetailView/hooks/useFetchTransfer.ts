import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDomainData } from "../../../utils/Helpers";
import { SharedConfig, Transfer } from "../../../types";

export default function useFetchTransfer(
  routes, sharedConfig, setTransferFromNetworkType, setTransferToNetworkType, setSharedConfig
) {

  const [transferDetails, setTransferDetails] = useState<Transfer | null>(null);

  const [transferStatus, setTransferStatus] = useState<"none" | "completed">(
    "none",
  );

  const setTransferNetworkTypes = (
    fromDomainInfo: SharedConfigDomain | undefined,
    toDomainInfo: SharedConfigDomain | undefined,
  ) => {
    const fromDomainType = fromDomainInfo?.type;

    const toDomainType = toDomainInfo?.type;

    setTransferFromNetworkType(fromDomainType!);
    setTransferToNetworkType(toDomainType!);
  };

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId.id);
    const sanitizedTransfer = sanitizeTransferData([transfer]);

    const fromDomainInfo = getDomainData(
      sanitizedTransfer[0].fromDomainId,
      sharedConfig,
    );
    const toDomainInfo = getDomainData(
      sanitizedTransfer[0].toDomainId,
      sharedConfig,
    );

    setTransferNetworkTypes(fromDomainInfo!, toDomainInfo!);

    setTransferDetails(sanitizedTransfer[0]);
    setTransferStatus("completed");
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
      const fromDomainInfo = getDomainData(transfer.fromDomainId, sharedConfig);
      const toDomainInfo = getDomainData(transfer.toDomainId, sharedConfig);

      setTransferNetworkTypes(fromDomainInfo!, toDomainInfo!);

      setTransferDetails(transfer);
      setTransferStatus("completed");
    }
  };

  const getSharedConfigFromLocalStorage = () => {
    const sharedConfig = localStorage.getItem("sharedConfig");
    const parsedSharedConfig: SharedConfig = JSON.parse(sharedConfig!);
    console.log(
      "🚀 ~ file: DetailView.tsx:142 ~ getSharedConfigFromLocalStorage ~ parsedSharedConfig:",
      parsedSharedConfig,
    );

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
      console.log("getting shared config");
      getSharedConfigFromLocalStorage();
    }
  }, []);

}