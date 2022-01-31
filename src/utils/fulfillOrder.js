import BigNumber from "bignumber.js";
import moment from "moment";
export const fulfillOrder = async (
  exchangeContract,
  account,
  tradeID,
  totalAmount,
  setBuyModalStatus,
  setBuyModalOpen
) => {
  setBuyModalOpen(true);
  let result = null;
  console.log("tradeID", tradeID);
  console.log("totalAmount", totalAmount.toString());

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

  try {
    result = await exchangeContract.methods
      .fulFillOrder(tradeID, toPlainString(totalAmount))
      .send({ from: account });
      if(result)
      {
        setBuyModalStatus("success");
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
