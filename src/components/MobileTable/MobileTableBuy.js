import "./MobileTableBuy.scss";
import DepositIcon from "../../assets/DepositIcon.svg";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";

const placeholderQuantity = "0.00";
const placeholderPrice = "100.00";

function MobileTableBuy({
  tokenList,
  loading,
  onChange,
  setBuyTicker,
  setBalance,
  navigateProject,
}) {
  console.log(loading)
  return (
    <>
    <div className="mobileTableBuy h-60v w-85v overflow-y-auto">
      <div className="_header py-2 bg-dark-50 rounded-tl-2xl rounded-tr-2xl"></div>
      <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-55v overflow-y-auto">
        {tokenList.map((token) => (
          <Column token={token} />
        ))}
      </div>
    </div>
  </>
  );
}

function Button() {
  return (
    <div className="border cursor-pointer border-grayLabel my-1 py-2 rounded-lg flex flex-row items-center justify-center w-fit-content px-4 mx-auto">
      <img src={DepositIcon} alt="deposit" className="mr-2" />
      <p className="text-success-color-400 uppercase font-bold text-caption-2">
        BUY
      </p>
    </div>
  );
}

function Column({ token }) {
  return (
    <div className="_card flex justify-between py-2 px-2 mx-0 border border-dark-50 border-2">
      <div className="_leftContainer text-left text-white">
        <p className="_assetName bg-dark-300 p-2 rounded-full px-3 border border-2 border-dark-50 text-caption-2 text-center">
          {token.asset}
        </p>

        <div className="_detailsContainer flex ml-2 my-2 items-center">
          <div className="text-caption-3 text-tradeTitle pr-2">
            <p className="_assetQuantityTitle">Quantity</p>
            <p className="_assetPriceTitle">Price</p>
          </div>
          <div className="ml-2">
            <p className="_assetQuantityValue text-caption-2">
              {convertToInternationalCurrencySystem(token.quantity)}
            </p>
            <p className="_assetPriceValue text-caption-2">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                maximumSignificantDigits: 6,
              }).format(Number(token.price))}
            </p>
          </div>
        </div>
      </div>
      <div className="_rightContainer">
        <p className="_assetExpiry text-white font-regular text-10px mt-2 mb-4">
          {token.expiryTime.substring(0, token.expiryTime.length - 9)}
        </p>
        <Button />
      </div>
    </div>
  );
}

export default MobileTableBuy;
