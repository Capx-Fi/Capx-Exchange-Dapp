import BigNumber from "bignumber.js";

export const validateBuyAmount = async (
    ticker
    ) => {
      // using Math.pow(10,Number("6") as "6" because USDT decimal
      // THIS TICKER
      // AMOUNT_GIVE ==== STABLE COIN ==== USDT
      let USDTdecimal = ticker?.stableCoinDecimal
    

    let returnObj = {}

    let bn_stableCoin = new BigNumber(ticker?.amountGive).multipliedBy(Math.pow(10,Number(ticker?.stableCoinDecimal)))

    
    // await console.log("Ticker - aG ",bn_amountGive.toString(10));

    let stableCoinCompare = bn_stableCoin.comparedTo(new BigNumber(1));

    if(stableCoinCompare > -1)
    returnObj["stableCoinLegal"] = true
    else
    returnObj["stableCoinLegal"] = false

    let stableCoinLegal = bn_stableCoin.integerValue();

    // await console.log("Amount Give Integer Val -- ",amountGiveLegal.toString(10));
    returnObj["stableCoinValue"] = stableCoinLegal.toString(10)
    
    // AMOUNT GET IS DERIVATIVE

    
    let bn_derivativeAmount = new BigNumber(ticker?.amountGet).multipliedBy(Math.pow(10,Number(ticker?.derivativeDecimal)));
    // await console.log("price with quant - aG2 ",pmulquant.toString(10));
    
    // Big number comparison with big number 0
    
    let compareResult = bn_derivativeAmount.comparedTo(new BigNumber(1));
    
    await console.log("Comparison Result - aG3 ",compareResult);

    if(compareResult > -1)
    returnObj["DerivativeLegal"] = true
    else
    returnObj["DerivativeLegal"] = false

    let integerVal = bn_derivativeAmount.integerValue();
    returnObj["DerivativeLegalValue"] = integerVal.toString(10)


    return(returnObj)
  };
  