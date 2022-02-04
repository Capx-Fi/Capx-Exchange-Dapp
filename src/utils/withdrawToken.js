import BigNumber from "bignumber.js";
BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 18],
});
export const withdrawToken = async (
  exchangeContract,
  account,
  assetID,
  totalAmount,
  setWithdrawModalOpen,
  setWithdrawModalStatus,
  setButtonDisabled,
  enqueueSnackbar,
  resetValue
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
      resetValue();
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
