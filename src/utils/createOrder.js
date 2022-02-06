import BigNumber from "bignumber.js";
import { time } from "highcharts";
import moment from "moment";
import { CONTRACT_ABI_ERC20 } from "../contracts/SampleERC20";
import Web3 from "web3";

BigNumber.config({
  ROUNDING_MODE: 3,
  DECIMAL_PLACES: 18,
  EXPONENTIAL_AT: [-18, 36],
});

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let kp = [date.getFullYear(), mnth, day].join("-");
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
  CHAIN_USDT_CONTRACT_ADDRESS,
  setSellNull
) => {
  setSellModalOpen(true);
  const web3 = new Web3(Web3.givenProvider);

  let totalAmount = new BigNumber(ticker.quantity).multipliedBy(
    Math.pow(10, ticker.tokenDecimal)
  );
  const tokenInst = new web3.eth.Contract(
    CONTRACT_ABI_ERC20,
    CHAIN_USDT_CONTRACT_ADDRESS
  );
  const tokenSymbol = await tokenInst.methods.symbol().call();
  console.log(tokenSymbol, "tokenSymbol");
  const USDTTokenDecimal = await tokenInst.methods.decimals().call();
  let tokenGive = ticker.assetID;
  let amountGive = totalAmount;
  let tokenGet = CHAIN_USDT_CONTRACT_ADDRESS;
  let amountGet = new BigNumber(
    totalAmount.multipliedBy(ticker.price)
  ).multipliedBy(Math.pow(10, USDTTokenDecimal));
  amountGet = new BigNumber(
    amountGet.dividedBy(Math.pow(10, ticker.tokenDecimal))
  );
  amountGet = amountGet.toFixed(USDTTokenDecimal,1);
  let expiryTime = ticker.expiryTime;
  let expiryDate = ticker.expiryDate;
  let totalExpiryTime = convert(expiryDate) + convertToSeconds(expiryTime);
  let direction = true;
  let result = null;
  try {
    result = await exchangeContract.methods
      .createOrder(
        tokenGive,
        amountGive.toString(),
        tokenGet,
        amountGet.toString(),
        totalExpiryTime,
        direction
      )
      .send({ from: account });
    if (result) {
      setSellModalStatus("success");
      setSellNull();
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
