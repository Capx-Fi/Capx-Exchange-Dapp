import BigNumber from "bignumber.js";
import { time } from "highcharts";
import moment from "moment";
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

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let kp = [date.getFullYear(), mnth, day].join("-");
  console.log("KP", kp.split("-"));
  let timestamp =
    new Date(
      Date.UTC(kp.split("-")[0], kp.split("-")[1] - 1, kp.split("-")[2])
    ).getTime() / 1000;
  return timestamp;
}

function convertToSeconds(str) {
  var date = new Date(str),
    hours = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2);
  return +hours * 60 * 60 + +minutes * 60;
}
export const createOrder = async (
  exchangeContract,
  account,
  ticker,
  setSellModalStatus,
  setSellModalOpen,
  CHAIN_USDT_CONTRACT_ADDRESS
) => {
  setSellModalOpen(true);
  let totalAmount = new BigNumber(ticker.quantity).multipliedBy(
    Math.pow(10, ticker.tokenDecimal)
  );
  let tokenGive = ticker.assetID;
  let amountGive = totalAmount;
  let tokenGet = CHAIN_USDT_CONTRACT_ADDRESS;
  let amountGet = new BigNumber(
    totalAmount.multipliedBy(ticker.price)
  ).multipliedBy(Math.pow(10, 18));
  amountGet = new BigNumber(
    amountGet.dividedBy(Math.pow(10, ticker.tokenDecimal))
  );
  let expiryTime = ticker.expiryTime;
  let expiryDate = ticker.expiryDate;
  let totalExpiryTime = convert(expiryDate) + convertToSeconds(expiryTime);
  let direction = true;
  let result = null;
  try {
    result = await exchangeContract.methods
      .createOrder(
        tokenGive,
        toPlainString(amountGive),
        tokenGet,
        toPlainString(amountGet),
        totalExpiryTime,
        direction
      )
      .send({ from: account });
    if (result) {
      setSellModalStatus("success");
    }
  } catch (err) {
    console.log(err);
    setSellModalStatus("failure");
  }

  setTimeout(() => {
    setSellModalOpen(false);
    setSellModalStatus("");
  }, 2500);
};
