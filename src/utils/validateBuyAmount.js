import BigNumber from "bignumber.js";

export const validateBuyAmount = async (ticker, amountGet, amountGive) => {
  console.log("INPUT", amountGet, amountGive);
  // using Math.pow(10,Number("6") as "6" because USDT decimal
  // THIS TICKER
  // AMOUNT_GIVE ==== STABLE COIN ==== USDT
  let USDTdecimal = ticker?.stableCoinDecimal;

  let returnObj = {};

  let bn_stableCoin = new BigNumber(amountGive).multipliedBy(
    Math.pow(10, Number(ticker?.stableCoinDecimal))
  );

  // await console.log("Ticker - aG ",bn_amountGive.toString(10));

  let stableCoinCompare = bn_stableCoin.comparedTo(new BigNumber(1));

  if (stableCoinCompare > -1) returnObj["stableCoinLegal"] = true;
  else returnObj["stableCoinLegal"] = false;

  let stableCoinLegal = bn_stableCoin.integerValue();
  console.log("Amount Give Integer Val -- ", stableCoinLegal.toString(10));

  // await console.log("Amount Give Integer Val -- ",amountGiveLegal.toString(10));
  returnObj["stableCoinValue"] = stableCoinLegal.toString(10);
  returnObj["amountGiveStableCoin"] = new BigNumber(stableCoinLegal)
    .dividedBy(Math.pow(10, Number(ticker?.stableCoinDecimal)))
    .toString(10);
  // AMOUNT GET IS DERIVATIVE

  let bn_derivativeAmount = new BigNumber(amountGet).multipliedBy(
    Math.pow(10, Number(ticker?.derivativeDecimal))
  );
  // await console.log("price with quant - aG2 ",pmulquant.toString(10));

  // Big number comparison with big number 0

  let compareResult = bn_derivativeAmount.comparedTo(new BigNumber(1));

  await console.log("Comparison Result - aG3 ", compareResult);

  if (compareResult > -1) returnObj["DerivativeLegal"] = true;
  else returnObj["DerivativeLegal"] = false;

  let integerVal = bn_derivativeAmount.integerValue();
  returnObj["DerivativeLegalValue"] = integerVal.toString(10);
  returnObj["amountGetDerivativeValue"] = new BigNumber(integerVal)
    .dividedBy(Math.pow(10, ticker?.derivativeDecimal))
    .toString(10);
  console.log("OUTPUT", returnObj);
  return returnObj;
};
