// await exchangeInstance.createOrder(
//   erc20_1.address,
//   "2000000000000000000",
//   erc20_2.address,
//   "1000000000000000000",
//   "1665949656",
//   "1"
// );
// function createOrder(
//         address _tokenGive,
//         uint256 _amountGive,
//         address _tokenGet,
//         uint256 _amountGet,
//         uint256 _expiryTime = expiryDate + expirytime,
//         int128 _direction
//     )

import BigNumber from "bignumber.js";
import { time } from "highcharts";
import moment from "moment";
// function createOrder(
//         address _tokenGive,
//         uint256 _amountGive,
//         address _tokenGet,
//         uint256 _amountGet,
//         uint256 _expiryTime,
//         int128 _direction
//     )
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
    console.log("KP",kp.split("-"));
    let timestamp = new Date (
        Date.UTC(
          kp.split("-")[0],
          kp.split("-")[1]-1,
          kp.split("-")[2]
        )
      ).getTime() / 1000;
    return timestamp
}

function convertToSeconds(str) {
    var date = new Date(str),
        hours  = ("0" + date.getHours()).slice(-2),
        minutes = ("0" + date.getMinutes()).slice(-2);
    return (+hours) * 60 * 60 + (+minutes) * 60;
}
export const createOrder = async (
    exchangeContract,account,ticker
) => {
      let totalAmount = new BigNumber(ticker.quantity).multipliedBy(
        Math.pow(10, ticker.tokenDecimal)
      );
    console.log("ticker in create", ticker);
    let tokenGive = ticker.assetID;
    let amountGive = totalAmount;
    let tokenGet = "0x96711f91eb24a3D1dfA3eD308A84380DFD4CC1c7";
    let amountGet = new BigNumber(totalAmount.multipliedBy(ticker.price)).multipliedBy(
        Math.pow(10, 18)
        );
    amountGet = new BigNumber(amountGet.dividedBy(Math.pow(10, ticker.tokenDecimal)));
    let expiryTime = ticker.expiryTime;
    let expiryDate = ticker.expiryDate;
    console.log("expiryTime", convertToSeconds(expiryTime));
    console.log("expiryDate", convert(expiryDate));
    let totalExpiryTime = convert(expiryDate) + convertToSeconds(expiryTime);
    console.log(totalExpiryTime, "totalExpiryTime");
    console.log("tokenGive", tokenGive);
    console.log("amountGive", amountGive);
    console.log("tokenGet", tokenGet);
    console.log("amountGet", amountGet);
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
    } catch (err) {
        console.log(err);
    }
    return result;
};
