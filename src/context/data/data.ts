import { Transfer } from "../../types/explorer"

export const fetchTransfers = async (url: string): Promise<Transfer[]> => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

export const routes = () => {
  const { VITE_INDEXER_URL } = import.meta.env

  const indexerUrl = `${VITE_INDEXER_URL}/api`

  return {
    transfers: async (page: string, limit: string, status?: string ) => await fetchTransfers(`${indexerUrl}/transfers?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`)
  }
}