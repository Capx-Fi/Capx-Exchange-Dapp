import { useDispatch } from "react-redux";
import WithdrawIcon from "../../assets/WithdrawIcon.svg";
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
        <div className="_header py-2 bg-dark-50 rounded-tl-2xl rounded-tr-2xl"></div>
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-55v overflow-y-auto">
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
        className="_card flex justify-between py-3 px-4 mx-0  border-dark-50 border-b-2"
        onClick={() => {
          dispatch(setWithdrawTicker(token));
          dispatch(setAssetBalance(token.quanitity));
        }}
      >
        <div className="_leftContainer text-left text-white">
          <p
            className="_assetName bg-dark-300 p-2 rounded-full px-3 border-2 border-dark-50 text-caption-2 text-center"
            onClick={() =>
              isUSDT ? console.log("USDT") : navigateProject(token.assetID)
            }
          >
            {token.asset}
          </p>

          <div className="_detailsContainer flex flex-row ml-2 my-2 items-center">
            <div className="text-caption-3 text-tradeTitle pr-2">
              <p className="_assetQuantityTitle">Quantity</p>
            </div>
            <div className="ml-2">
              <p className="_assetQuantityValue text-caption-2">
                {convertToInternationalCurrencySystem(token.quantity)}
              </p>
            </div>
          </div>
        </div>

        <div className="_rightContainer">
          <p className="_assetExpiry text-white font-regular text-10px mt-2 mb-3">
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
        <p className="_assetName  p-2 w-full text-dark-50 bg-dark-50 animate-pulse rounded-full px-3 border-2 border-dark-50 text-caption-2 text-center">
          ...
        </p>

        <div className="_detailsContainer flex ml-2 my-2 items-center">
          <div className="text-caption-3 text-tradeTitle pr-2">
            <p className="_assetQuantityTitle">Quantity</p>
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
      <img src={WithdrawIcon} alt="deposit" className="mr-2" />

      <p className="text-success-color-400 uppercase font-bold text-caption-2">
        WITHDRAW
      </p>
    </div>
  );
}

export default MobileWithdraw;
