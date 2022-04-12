import "./MobileTableBuy.scss";
import DepositIcon from "../../assets/DepositIcon.svg";
import marketActivity from "../../assets/marketActivity.svg";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { useDispatch, useSelector } from "react-redux";

function MobileTableBuy({
  tokenList,
  projectDetails,
  loading,
  onChange,
  setBuyTicker,
  setBalance,
  navigateProject,
  isInfo,
}) {
  const ticker = useSelector((state) => state.exchange.projectBuyTicker);
  return (
    <>
      <div className="mobileTableBuy h-fit-content max-h-60v w-85v overflow-y-hidden">
        {isInfo ? (
          <div className="_header border border-dark-50 text-left pl-4 py-4 overflow-hidden bg-dark-300 rounded-tl-2xl rounded-tr-2xl text-tradeTitle text-10px flex items-center font-bold tracking-wide">
            <img src={marketActivity} className="w-3 h-3 mr-1" alt="" />
            TOKENS WITH ${projectDetails?.projectName?.toUpperCase()}
          </div>
        ) : (
          <div className="_header py-2 bg-dark-50 rounded-tl-2xl rounded-tr-2xl"></div>
        )}
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-fit-content max-h-55v overflow-y-auto">
          {loading ? (
            [0, 1, 2, 3, 4].map(() => <LoadingColumn />)
          ) : tokenList.length > 0 ? (
            tokenList.map((token) => (
              <Column
                token={token}
                setBuyTicker={setBuyTicker}
                setBalance={setBalance}
                navigateProject={navigateProject}
              />
            ))
          ) : (
            <div className="text-white mt-10 mb-10"> No Tokens Found</div>
          )}
        </div>
      </div>
    </>
  );
}

function Button() {
  return (
    <div className="border cursor-pointer border-grayLabel my-1 py-2 rounded-lg flex flex-row items-center justify-center w-fit-content px-4 ml-auto">
      <img src={DepositIcon} alt="deposit" className="mr-2" />
      <p className="text-success-color-400 uppercase font-bold text-caption-2">
        BUY
      </p>
    </div>
  );
}

function LoadingColumn() {
  return (
    <div className="_card flex justify-between py-3 px-4 mx-0  border-dark-50 border-b-2">
      <div className="_leftContainer text-left text-white ">
        <p className="_assetName  p-2 w-full text-dark-50 bg-dark-50 animate-pulse rounded-full px-3 border-2 border-dark-50 text-caption-2 text-center">
          ...
        </p>

        <div className="_detailsContainer flex ml-2 my-2 items-center">
          <div className="text-caption-3 text-tradeTitle pr-2">
            <p className="_assetQuantityTitle">Quantity</p>
            <p className="_assetPriceTitle">Price</p>
          </div>
          <div className="ml-2">
            <p className="_assetQuantityValue text-caption-3 w-16 text-dark-50 bg-dark-50 animate-pulse">
              ...
            </p>
            <p className="_assetPriceValue text-caption-3 w-16 text-dark-50 bg-dark-50 animate-pulse">
              ...
            </p>
          </div>
        </div>
      </div>
      <div className="_rightContainer">
        <p className="_assetExpiry w-full text-dark-50 bg-dark-50 animate-pulse  font-regular text-10px mt-2 mb-4">
          ...
        </p>
        <div className="pointer-events-none opacity-50 animate-pulse">
          <Button />
        </div>
      </div>
    </div>
  );
}

function Column({ token, setBuyTicker, setBalance, navigateProject }) {
  const dispatch = useDispatch();
  return (
    <div
      className="_card flex justify-between py-3 px-4 mx-0 border-dark-50 border-b-2 font-bold uppercase"
      onClick={() => {
        dispatch(setBuyTicker(token));
        setBalance(token?.balance);
      }}
    >
      <div className="_leftContainer text-left text-white">
        <p
          onClick={(e) => {
            e.stopPropagation();
            navigateProject(token.assetID);
          }}
          className="_assetName bg-dark-300 p-2 rounded-full px-3 border-2 border-dark-50 text-caption-2 text-center"
        >
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
        <p className="_assetExpiry text-white text-right font-regular text-caption-3 mt-2 mb-4">
          {token.expiryTime.substring(0, token.expiryTime.length - 9)}
        </p>
        <Button />
      </div>
    </div>
  );
}

export default MobileTableBuy;
