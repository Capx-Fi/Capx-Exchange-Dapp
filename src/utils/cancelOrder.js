import BigNumber from "bignumber.js";
export const cancelOrder = async (
  exchangeContract,
  account,
  tradeID,
) => {
  let result = null;

  try {
    result = await exchangeContract.methods
      .cancelOrder([tradeID])
      .send({ from: account });
  } catch (err) {
    console.log(err);
  }
  return result;
};
