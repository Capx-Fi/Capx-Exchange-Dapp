import BigNumber from "bignumber.js";
import moment from "moment";
export const fulfillOrder = async (
  exchangeContract,
  account,
  tradeID,
  totalAmount,
  setBuyModalStatus,
  setBuyModalOpen,
  resetValue
) => {
  setBuyModalOpen(true);
  let result = null;


  try {
    result = await exchangeContract.methods
      .fulFillOrder(tradeID, totalAmount)
      .send({ from: account });
    if (result) {
      setBuyModalStatus("success");
      resetValue();
    }
  } catch (err) {
    console.log(err);
    setBuyModalStatus("failure");
  }
  setTimeout(() => {
    setBuyModalOpen(false);
    setBuyModalStatus("");
  }, 2500);
};
