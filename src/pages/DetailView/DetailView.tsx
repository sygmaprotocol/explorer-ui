import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useExplorer } from "../../context";
import { Transfer } from "../../types";

export default function DetailView() {
  const { state: transferId } = useLocation()
  const { routes } = useExplorer()
  const [transferDetails, setTransferDetails] = useState<Transfer | null>(null)
  console.log("🚀 ~ file: DetailView.tsx:5 ~ DetailView ~ state:", transferId)

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId)
    console.log("🚀 ~ file: DetailView.tsx:12 ~ fetchTransfer ~ transfer:", transfer)
    setTransferDetails(transfer)
  }

  useEffect(() => {
    fetchTransfer()
  }, []);
  
  return (
    <div>
      <h1>Detail View</h1>
    </div>
  );
}