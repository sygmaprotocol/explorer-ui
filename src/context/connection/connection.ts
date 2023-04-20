export const getAccount = async (): Promise<string> => {
  let account

  try {
    const accounts = await window .ethereum!.request({ method: 'eth_requestAccounts' })

    account = (accounts as Array<string>)[0]

  } catch(e){
    if((e as { code: number }).code === 4001) {
      console.warn("User rejected request")
      console.log("Please connect to MetaMask to continue")
    }
    console.error("Error getting account: ", e)
  }

  return account as string

}

export const getChainId = async (): Promise<number> => {
  let chainId

  try {
    chainId = await window .ethereum!.request({ method: 'eth_chainId' })
  } catch(e){
    console.error("Error getting chainId: ", e)
  }

  return parseInt(chainId as string, 16)
}