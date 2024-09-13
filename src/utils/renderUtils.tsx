export const renderStatusIcon = (status: string, classes: Record<"statusPillIcon", string>): JSX.Element => {
  switch (status) {
    case "pending":
      return <img src={`/assets/icons/pending.svg`} alt="pending" className={classes.statusPillIcon} />
    case "executed":
      return <img src={`/assets/icons/success.svg`} alt="completed" className={classes.statusPillIcon} />
    case "reverted":
    case "failed":
      return <img src={`/assets/icons/reverted.svg`} alt="reverted" className={classes.statusPillIcon} />
    default:
      return <img src={`/assets/icons/pending.svg`} alt="pending" className={classes.statusPillIcon} />
  }
}

export const renderNetworkIcon = (caipId: string, classes: Record<"networkIcon" | "substrateNetworkIcon", string>): JSX.Element => {
  switch (caipId) {
    case "eip155:11155111":
    case "eip155:1":
    case "eip155:17000":
      return <img src={`/assets/icons/evm.svg`} alt="ethereum" className={classes.networkIcon} />
    case "polkadot:5231":
    case "polkadot:5233":
      return <img src={`/assets/icons/phala-black.svg`} alt="substrate" className={classes.substrateNetworkIcon} />
    case "polkadot:5232":
      return <img src={`/assets/icons/khala.svg`} alt="substrate" className={classes.substrateNetworkIcon} />
    case "eip155:8453":
      return <img src={`/assets/icons/base.svg`} alt="base" className={classes.networkIcon} />
    case "eip155:338":
    case "eip155:25":
      return <img src={`/assets/icons/cronos.svg`} alt="cronos" className={classes.networkIcon} />
    case "eip155:80001":
    case "eip155:137":
    case "eip155:80002":
      return <img src={`/assets/icons/polygon.svg`} alt="polygon" className={classes.networkIcon} />
    case "eip155:100":
    case "eip155:10200":
      return <img src={`/assets/icons/gnosis.svg`} alt="gnosis" className={classes.networkIcon} />
    case "eip155:421614":
      return <img src={`/assets/icons/arbitrum.svg`} alt="gnosis" className={classes.networkIcon} />
    case "eip155:84532":
      return <img src={`/assets/icons/base.svg`} alt="gnosis" className={classes.networkIcon} />
    case "polkadot:3799":
      return <img src={`/assets/icons/tangle-logo.svg`} alt="gnosis" className={classes.networkIcon} />
    case "eip155:1993":
      return <img src={`/assets/icons/b3-sepolia.svg`} alt="gnosis" className={classes.networkIcon} />
    default:
      return <img src={`/assets/icons/evm.svg`} alt="ethereum" className={classes.networkIcon} />
  }
}
