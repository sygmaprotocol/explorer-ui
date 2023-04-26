import { CircularProgress, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useExplorer } from "../../context";
import { Transfer } from "../../types";

export default function DetailView() {
  const { state: transferId } = useLocation()
  const { routes } = useExplorer()
  const [transferDetails, setTransferDetails] = useState<Transfer | null>(null)
  const [transferStatus, setTransferStatus] = useState<"none" | "completed">("none")
  console.log("🚀 ~ file: DetailView.tsx:5 ~ DetailView ~ state:", transferId)

  const fetchTransfer = async () => {
    const transfer = await routes.transfer(transferId)
    console.log("🚀 ~ file: DetailView.tsx:12 ~ fetchTransfer ~ transfer:", transfer)
    setTransferDetails(transfer)
    setTransferStatus("completed")
  }

  const renderTransferDetails = (transfer: Transfer | null) => {
    return (
      <div>
        <span>{transfer?.status}</span>
      </div>
    )
  }

  useEffect(() => {
    fetchTransfer()
  }, []);
  
  return (
    <Box>
      {
        transferStatus !== "none" ? (
          <Container>
            <Typography variant="h4">Transaction Detail</Typography>
            <Container>
              {
                renderTransferDetails(transferDetails)
              }
            </Container>
          </Container>
        ) : (
          <CircularProgress />
        )
      }
    </Box>
  );
}