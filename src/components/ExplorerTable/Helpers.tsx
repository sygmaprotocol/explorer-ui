export const renderStatusIcon = (
  status: string,
  classes: Record<"statusPillIcon", string>,
) => {
  switch (status) {
    case "pending":
      return (
        <img
          src={`/assets/icons/pending.svg`}
          alt="pending"
          className={classes.statusPillIcon}
        />
      );
    case "completed":
      return (
        <img
          src={`/assets/icons/success.svg`}
          alt="completed"
          className={classes.statusPillIcon}
        />
      );
    case "reverted":
      return (
        <img
          src={`/assets/icons/reverted.svg`}
          alt="reverted"
          className={classes.statusPillIcon}
        />
      );
    default:
      return (
        <img
          src={`/assets/icons/pending.svg`}
          alt="pending"
          className={classes.statusPillIcon}
        />
      );
  }
};

// NOTE: this is temporary, will be removed once we definition regarding shared config and api
// question to answer here: should we use chain id to mapp for icons?
export const renderNetworkIcon = (
  id: string,
  classes: Record<"networkIcon", string>,
) => {
  switch (id) {
    case "0":
    case "3":
      return (
        <img
          src={`/assets/icons/all.svg`}
          alt="ethereum"
          className={classes.networkIcon}
        />
      );
    case "1":
      return (
        <img
          src={`/assets/icons/polygon.svg`}
          alt="polygon"
          className={classes.networkIcon}
        />
      );
    case "2":
      return (
        <img
          src={`/assets/icons/moonbeam.svg`}
          alt="moonbeam"
          className={classes.networkIcon}
        />
      );
    default:
      return (
        <img
          src={`/assets/icons/all.svg`}
          alt="ethereum"
          className={classes.networkIcon}
        />
      );
  }
};
