import BigNumber from "bignumber.js";
export const cancelOrder = async (
  exchangeContract,
  account,
  tradeID,
  setCancelModalStatus,
  setCancelModalOpen
) => {
  setCancelModalOpen(true);
  let result = null;

  try {
    result = await exchangeContract.methods
      .cancelOrder([tradeID])
      .send({ from: account });
      if(result)
        setCancelModalStatus("success");
      else
        setCancelModalStatus("failure");
  } catch (err) {
    console.log(err);
    setCancelModalStatus("failure");
  }
    setTimeout(() => {
      setCancelModalOpen(false);
      setCancelModalStatus("");
    }, 2500);
};
