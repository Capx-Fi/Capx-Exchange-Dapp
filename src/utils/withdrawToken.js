import BigNumber from "bignumber.js";
function toPlainString(num) {
  return ("" + +num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + "0." + Array(1 - e - c.length).join(0) + c + d
        : b + c + d + Array(e - d.length + 1).join(0);
    }
  );
}
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
      .withdrawToken(assetID, toPlainString(totalAmount))
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
