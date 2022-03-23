import { useDispatch } from "react-redux";
import marketActivity from "../../assets/marketActivity.svg";
import { convertToInternationalCurrencySystem } from "../../utils/convertToInternationalCurrencySystem";

function MobileMarketActivity({ completeOrders }) {
  return (
    <>
      <div className="mobileMarketActivity h-fit max-h-60v w-full overflow-y-hidden mb-12">
        <div className="_header border border-dark-50 text-left pl-4 py-4 overflow-hidden bg-dark-300 rounded-tl-2xl rounded-tr-2xl text-tradeTitle text-10px flex items-center font-bold tracking-wide">
          <img src={marketActivity} className="w-3 h-3 mr-1" alt="" />
          MARKET ACTIVITY
        </div>
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-fit overflow-y-auto overflow-x-hidden">
          {completeOrders.map((order) => (
            <Column order={order} />
          ))}
        </div>
      </div>
    </>
  );
}

function Column({ order }) {
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
      className="_card flex justify-between py-3 px-4 mx-0 my-0 border-b-2 border-dark-50"
      onClick={() => {
        // dispatch(setWithdrawTicker(record));
        // dispatch(setAssetBalance(record.quantity)); // For mapping data
      }}
    >
      <div className="_leftContainer text-left text-white">
        <div className="titleContainer flex justify-between -mr-6">
          <p className="_assetName pl-2 text-caption-2 text-left">
            {token.length > 12 ? token.slice(0, 12) + "..." : token}
          </p>
          <p className="_assetExpiry text-right text-white font-regular text-10px mt-1 mb-4 mr-10">
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
