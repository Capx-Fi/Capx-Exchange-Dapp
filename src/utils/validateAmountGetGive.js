import BigNumber from "bignumber.js";

export const validateAmountGetGive = async (ticker, amountGet, amountGive) => {
  let returnObj = {};

  let bn_stableCoin = new BigNumber(amountGive).multipliedBy(
    Math.pow(10, Number(ticker?.stableCoinDecimal))
  );

  let stableCoinLegal = bn_stableCoin.integerValue();
  returnObj["amountGiveStableCoin"] = new BigNumber(stableCoinLegal)
    .dividedBy(Math.pow(10, Number(ticker?.stableCoinDecimal)))
    .toString(10);
  // AMOUNT GET IS DERIVATIVE

  let bn_derivativeAmount = new BigNumber(amountGet).multipliedBy(
    Math.pow(10, Number(ticker?.derivativeDecimal))
  );
  // await console.log("price with quant - aG2 ",pmulquant.toString(10));

  // Big number comparison with big number 0

  let integerVal = bn_derivativeAmount.integerValue();

  returnObj["amountGetDerivativeValue"] = new BigNumber(integerVal)
    .dividedBy(Math.pow(10, ticker?.derivativeDecimal))
    .toString(10);

  return returnObj;
};
