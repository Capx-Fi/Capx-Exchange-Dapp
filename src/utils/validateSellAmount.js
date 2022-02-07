import BigNumber from "bignumber.js";

export const validateSellAmount = async (
    ticker,
    USDTdecimal
  ) => {

    let returnObj = {}
    // await console.log("We HERE 1");
    // await console.log(ticker);
    let bn_amountGive = new BigNumber(ticker?.quantity).multipliedBy(Math.pow(10,Number(ticker?.tokenDecimal)))
    
    // await console.log("Ticker - aG ",bn_amountGive.toString(10));

    let amountGiveCompare = bn_amountGive.comparedTo(new BigNumber(1));

    if(amountGiveCompare > -1)
    returnObj["amountGiveLegal"] = true
    else
    returnObj["amountGiveLegal"] = false

    let amountGiveLegal = bn_amountGive.integerValue();

    // await console.log("Amount Give Integer Val -- ",amountGiveLegal.toString(10));
    returnObj["amountGiveValue"] = amountGiveLegal.toString(10)
    // price * quant without 10 powers

    // using Math.pow(10,Number("6") as "6" because USDT decimal
    // USDTdecimal SHOULD BE IN STRING
    let pmulquant = new BigNumber(ticker?.quantity).multipliedBy(Math.pow(10,Number(USDTdecimal))).multipliedBy(ticker?.price);
    console.log("pmulquant",pmulquant.toString(10));
    
    // await console.log("price with quant - aG2 ",pmulquant.toString(10));
    
    // Big number comparison with big number 0
    
    let compareResult = pmulquant.comparedTo(new BigNumber(1));
    
    console.log("Comparison Result - aG3 ",compareResult);

    if(compareResult > -1)
    returnObj["USDTLegal"] = true
    else
    returnObj["USDTLegal"] = false

    let integerVal = pmulquant.integerValue();
    returnObj["USDTLegalValue"] = integerVal.toString(10)


    return(returnObj)
  };
  