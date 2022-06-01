import { useDispatch } from "react-redux";
import marketActivity from "../../assets/marketActivity.svg";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";
import TokenLink from "../../assets/token-link.svg";
import { getExplorerURL } from "../../constants/getChainConfig";
import { useWeb3React } from "@web3-react/core";


function MobileMarketActivity({ completeOrders, loading }) {
  return (
    <>
      <div className="mobileMarketActivity h-fit max-h-60v w-full overflow-y-hidden mb-12">
        <div className="_header border border-dark-50 text-left pl-4 py-4 overflow-hidden bg-dark-300 rounded-tl-2xl rounded-tr-2xl text-tradeTitle text-10px flex items-center font-bold tracking-wide">
          <img src={marketActivity} className="w-3 h-3 mr-1" alt="" />
          MARKET ACTIVITY
        </div>
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-fit max-h-55v overflow-y-auto overflow-x-hidden">
          {loading ? (
            [0,1,2,3,4].map(() => <LoadingColumn />)):
            completeOrders.length > 0 ? (
            completeOrders.map((order) => (
            <Column order={order} />
          )))
          : (<div className="text-white mt-10 mb-10"> No Trades Found</div>)}
        </div>
      </div>
    </>
  );
}

function LoadingColumn() {
  return (
    <div
    className="_card flex justify-between py-3 px-4 mx-0 my-0 border-b-2 border-dark-50"
    onClick={() => {
      // dispatch(setWithdrawTicker(record));
      // dispatch(setAssetBalance(record.quantity)); // For mapping data
    }}
  >
    <div className="_leftContainer text-left text-white w-full">
      <div className="titleContainer flex justify-between -mr-6">
        <p className="_assetName pl-2 text-caption-2 text-left block w-32 text-dark-50 bg-dark-50 animate-pulse">
          ...
        </p>
        <p className="_assetExpiry text-right font-regular text-10px mt-1 mb-4 mr-6 block w-16 text-dark-50 bg-dark-50 animate-pulse">
          ...
        </p>
      </div>

      <div className="_detailsContainer ml-2 my-2 text-caption-3 flex justify-between text-tradeTitle">
        <p className="_assetQuantity text-10px">
          QUANTITY{" "}
          <span className="text-caption-3 font-bold ml-2 w-48 text-dark-50 bg-dark-50 animate-pulse">
            ...
          </span>
        </p>
        <p className="_assetPriceTitle text-10px ml-24">
          PRICE{" "}
          <span className="text-caption-3 font-bold ml-2 w-48 text-dark-50 bg-dark-50 animate-pulse">
            ...
          </span>
        </p>
      </div>
      {/* <div className="ml-2">
      <p className="_assetQuantityValue text-caption-2">
        242424
      </p>
          <p className="_assetPriceValue text-caption-2">
      10101
          </p>
    </div> */}
    </div>
  </div>
  );
}

function Column({ order }) {
  const { active, account, chainId } = useWeb3React();
  const EXPLORER_URL = chainId && getExplorerURL(chainId);
  const token = order.asset; //TODO Remove these hardcoded values upon passing props
  const placeHolderQuantity = convertToInternationalCurrencySystem(
    order.completedQuantity
  );
  const placeHolderPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 6,
  }).format(Number(order.price));
  return (
    <div
      className="_card flex justify-between py-3 px-4 pl-2 mx-0 my-0 border-b-2 border-dark-50"
      onClick={() => {
        // dispatch(setWithdrawTicker(record));
        // dispatch(setAssetBalance(record.quantity)); // For mapping data
      }}
    >
      <div className="_leftContainer text-left text-white w-full">
        <div className="titleContainer flex justify-between -mr-6">
          <p className="_assetName pl-2 text-caption-2 text-left flex">
            {token.length > 12 ? token.slice(0, 12) + "..." : token} <a
                target="_blank"
                rel="noreferrer"
                href={`${EXPLORER_URL}${order?.assetID}`}
                className="ml-1"
              >
                <img src={TokenLink} alt="deposit" />
              </a>
          </p>
          <p className="_assetExpiry text-right text-white font-regular text-10px mt-1 mb-4 mr-6 block">
            {order.fulfillOrderTimestamp}
          </p>
        </div>

        <div className="_detailsContainer ml-2 my-2 text-caption-3 flex justify-between text-tradeTitle">
          <p className="_assetQuantity text-10px">
            QUANTITY{" "}
            <span className="text-white text-caption-3 font-bold ml-2">
              {placeHolderQuantity}
            </span>
          </p>
          <p className="_assetPriceTitle text-10px ml-24">
            PRICE{" "}
            <span className="text-white text-caption-3 font-bold ml-2">
              {placeHolderPrice}
            </span>
          </p>
        </div>
        {/* <div className="ml-2">
				<p className="_assetQuantityValue text-caption-2">
					242424
				</p>
            <p className="_assetPriceValue text-caption-2">
				10101
            </p>
			</div> */}
      </div>
    </div>
  );
}

export default MobileMarketActivity;
