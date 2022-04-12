import { useDispatch } from "react-redux";
import BuyIcon from "../../assets/buy.svg";
import { setWithdrawTicker } from "../../redux/actions/withdraw";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";

function MobileWithdraw({
  tokenList,
  loading,
  onChange,
  setWithdrawTicker,
  setAssetBalance,
  navigateProject,
  isUSDT,
}) {
  return (
    <>
      <div className="mobileWithdrawTable h-60v w-85v overflow-y-auto">
        <div className="_header py-2 bg-dark-50 rounded-tl-md rounded-tr-md"></div>
        <div className="_body border border-dark-50 rounded-br-md rounded-bl-md h-fit-content max-h-55v overflow-y-auto">
          {loading
            ? [0, 1, 2, 3, 4].map(() => <LoadingColumn />)
            : tokenList.map((token) => (
                <Column
                  token={token}
                  setWithdrawTicker={setWithdrawTicker}
                  setAssetBalance={setAssetBalance}
                  navigateProject={navigateProject}
                  isUSDT={isUSDT}
                />
              ))}
        </div>
      </div>
    </>
  );
}

function Column({
  token,
  setWithdrawTicker,
  setAssetBalance,
  navigateProject,
  isUSDT,
}) {
  const dispatch = useDispatch();
  return (
    <>
      <div
        className="_card flex justify-between py-3 px-4 mx-0 border-dark-50 border-b-2"
        onClick={() => {
          dispatch(setWithdrawTicker(token));
          dispatch(setAssetBalance(token.quanitity));
        }}
      >
        <div className="_leftContainer text-left text-white">
          <p
            className="_assetName font-bold uppercase tracking-wider w-fit-content max-w-30 bg-dark-300 p-2 rounded-lg px-3 border border-dark-50 text-caption-2 text-center"
            onClick={() =>
              isUSDT ? console.log("USDT") : navigateProject(token.assetID)
            }
          >
            {token.asset.length > 8
              ? token.asset.slice(0, 8) + "..."
              : token.asset}
          </p>

          <div className="_detailsContainer flex flex-row ml-2 my-2 items-center">
            <div className="text-caption-3 text-tradeTitle pr-2">
              <p className="_assetQuantityTitle uppercase font-bold">Quantity</p>
            </div>
            <div className="ml-2">
              <p className="_assetQuantityValue font-bold tracking-tighter text-caption-2">
                {convertToInternationalCurrencySystem(token.quantity)}
              </p>
            </div>
          </div>
        </div>

        <div className="_rightContainer">
          <p className="_assetExpiry tracking-wider font-bold uppercase text-right text-white font-regular text-10px mt-2 mb-3">
            {token.unlockDate ? token.unlockDate : "N/A"}
          </p>
          <Button />
        </div>
      </div>
    </>
  );
}

function LoadingColumn() {
  return (
    <div className="_card flex justify-between py-3 px-4 mx-0  border-dark-50 border-b-2">
      <div className="_leftContainer text-left text-white ">
        <p className="_assetName  p-2 w-full text-dark-50 bg-dark-50 animate-pulse rounded-lg px-3 border border-dark-50 text-caption-2 text-center">
          ...
        </p>

        <div className="_detailsContainer flex ml-2 my-2 items-center">
          <div className="text-caption-3 text-tradeTitle pr-2">
            <p className="_assetQuantityTitle font-bold uppercase">Quantity</p>
          </div>
          <div className="ml-2">
            <p className="_assetQuantityValue text-caption-2 w-16 text-dark-50 bg-dark-50 animate-pulse">
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

function Button() {
  return (
    <div className="border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto">
      <img src={BuyIcon} alt="deposit" className="mr-2 w-4" />

      <p className="text-success-color-400 uppercase font-bold text-caption-2">
        WITHDRAW
      </p>
    </div>
  );
}

export default MobileWithdraw;
