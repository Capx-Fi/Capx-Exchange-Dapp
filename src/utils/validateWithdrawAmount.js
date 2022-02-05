import BigNumber from "bignumber.js";

export const validateWithdrawAmount = async (
    ticker
  ) => {

    let returnObj = {}
    
    let bn_amountWithdraw = new BigNumber(ticker.quantity).multipliedBy(Math.pow(10,Number(ticker.tokenDecimal)))
    

    let amountWithdrawCompare = bn_amountWithdraw.comparedTo(new BigNumber(1));

    if(amountWithdrawCompare > -1)
    returnObj["amountWithdrawLegal"] = true
    else
    returnObj["amountWithdrawLegal"] = false

    let amountWithdrawLegal = bn_amountWithdraw.integerValue();

    returnObj["amountWithdrawValue"] = amountWithdrawLegal.toString(10)
    

    return(returnObj)
  };
  