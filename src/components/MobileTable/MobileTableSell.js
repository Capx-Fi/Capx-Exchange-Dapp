import SellIcon from "../../assets/sell.svg";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import { useDispatch } from "react-redux";

function MobileTableSell({
  tokenList,
  loading,
  onChange,
  setSellTicker,
  setBalance,
  navigateProject,
}) {
  return (
    <>
      <div className="mobileTableBuy h-fit-content max-h-60v w-85v overflow-y-auto">
        <div className="_header py-2 bg-dark-50 rounded-tl-md rounded-tr-md"></div>
        <div className="_body border border-dark-50 rounded-br-md rounded-bl-md h-fit-content max-h-55v overflow-y-auto">
          {loading ? (
            [0, 1, 2, 3, 4].map(() => <LoadingColumn />)
          ) : tokenList.length > 0 ? (
            tokenList.map((token) => (
              <Column
                token={token}
                setSellTicker={setSellTicker}
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
      <img src={SellIcon} alt="deposit" className="mr-2" />
      <p className="text-error-color-400 uppercase font-bold text-caption-2">
        SELL
      </p>
    </div>
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
            <p className="_assetQuantityTitle uppercase font-bold">Quantity</p>
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

function Column({ token, setSellTicker, setBalance, navigateProject }) {
  const dispatch = useDispatch();
  return (
    <div
      className="_card flex justify-between py-3 px-4 mx-0 border border-dark-50 border-2 font-bold"
      onClick={() => {
        dispatch(setSellTicker(token));
        dispatch(setBalance(token?.maxQuantity));
      }}
    >
      <div className="_leftContainer text-left text-white">
        <p
          onClick={(e) => {
            e.stopPropagation();
            navigateProject(token.assetID);
          }}
          className="_assetName font-bold uppercase tracking-wider w-fit-content max-w-30 bg-dark-300 p-2 rounded-lg px-3 border border-dark-50 text-caption-2 text-center"
        >
          {token.asset}
        </p>

        <div className="_detailsContainer flex ml-2 my-2 items-center">
          <div className="text-caption-3 text-tradeTitle pr-2">
            <p className="_assetQuantityTitle uppercase font-bold">Quantity</p>
          </div>
          <div className="ml-2">
            <p className="_assetQuantityValue font-bold tracking-tighter text-caption-2">
              {convertToInternationalCurrencySystem(token?.quantity)}
            </p>
          </div>
        </div>
      </div>
      <div className="_rightContainer ">
      <p className="_assetExpiry tracking-wider uppercase font-bold text-right text-white text-10px mt-2 mb-4">
        {token?.unlockDate}
      </p>
        <Button />
      </div>
    </div>
  );
}

export default MobileTableSell;
