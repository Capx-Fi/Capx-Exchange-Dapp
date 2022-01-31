import BigNumber from "bignumber.js";
export const withdrawToken = async (
  exchangeContract,
  account,
  assetID,
  totalAmount,
  setWithdrawModalOpen,
  setWithdrawModalStatus,
  setButtonDisabled,
  enqueueSnackbar
) => {
  setWithdrawModalOpen(true);

  let result = null;

  try {
    result = await exchangeContract.methods
      .withdrawToken(assetID, totalAmount)
      .send({ from: account });
    if (result) {
      setWithdrawModalStatus("success");
      enqueueSnackbar("Transaction Successful", { variant: "success" });
    } else {
      setWithdrawModalStatus("failure");
      enqueueSnackbar("Sorry transaction failed", { variant: "error" });
      setButtonDisabled(false);
    }
  } catch (err) {
    setWithdrawModalStatus("failure");
    enqueueSnackbar(err.message, { variant: "error" });
    setButtonDisabled(false);
  }
  setTimeout(() => {
    setWithdrawModalOpen(false);
    setWithdrawModalStatus("");
  }, 2500);
};
