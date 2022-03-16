import { useDispatch } from "react-redux";
import marketActivity from "../../assets/marketActivity.svg";

function MobileMarketActivity() {
	return (
		<>
		<div className="mobileMarketActivity h-fit max-h-60v w-full overflow-y-hidden mb-12">
        <div className="_header border border-dark-50 text-left pl-4 py-4 overflow-hidden bg-dark-300 rounded-tl-2xl rounded-tr-2xl text-tradeTitle text-10px flex items-center font-bold tracking-wide">
		<img src={marketActivity} className="w-3 h-3 mr-1" alt="" />MARKET ACTIVITY</div>
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-fit overflow-y-auto overflow-x-hidden">
		<Column />
		<Column />
		<Column />
		<Column />
		</div>
		</div>
		</>
	)
}

function Column() {
	const placeHolderQuantity = 2424;
	const placeHolderPrice = "$1.44";
	const dispatch = useDispatch();
	return(<div
	className="_card flex justify-between py-3 px-4 mx-0 my-0 border-b-2 border-dark-50"
	onClick={() => {
	// dispatch(setWithdrawTicker(record));
	// dispatch(setAssetBalance(record.quantity)); // For mapping data
    }}
    >
		<div className="_leftContainer text-left text-white">
			<div className="titleContainer flex justify-between -mr-6">
				<p className="_assetName pl-2 text-caption-2 text-left">
				TOKEN
				</p>
				<p className="_assetExpiry text-white font-regular text-10px mt-2 mb-4 mr-10">
					24/09/2020
				</p>
			</div>

			<div className="_detailsContainer ml-2 my-2 text-caption-3 flex justify-between text-tradeTitle">
            <p className="_assetQuantity text-10px">QUANTITY <span className="text-white text-caption-3 font-bold ml-2">{placeHolderQuantity}</span></p>
            <p className="_assetPriceTitle text-10px ml-24">PRICE <span className="text-white text-caption-3 font-bold ml-2">{placeHolderPrice}</span></p>
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
)}

export default MobileMarketActivity;