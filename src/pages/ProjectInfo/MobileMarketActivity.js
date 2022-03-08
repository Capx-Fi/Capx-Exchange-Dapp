import { useDispatch } from "react-redux";
import marketActivity from "../../assets/marketActivity.svg";

function MobileMarketActivity() {
	return (
		<>
		<div className="mobileMarketActivity h-60v w-77v overflow-y-auto">
        <div className="_header text-left pl-4 py-2 bg-dark-300 rounded-tl-2xl rounded-tr-2xl text-tradeTitle text-10px flex items-center"><img src={marketActivity} className="w-3 h-3" alt="" /> Market Trades</div>
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-55v overflow-y-auto">
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
	const dispatch = useDispatch();
	return(<div
	className="_card flex justify-between py-3 px-4 mx-0 my-0 border-dark-50 border-2"
	onClick={() => {
	// dispatch(setWithdrawTicker(record));
	// dispatch(setAssetBalance(record.quantity)); // For mapping data
    }}
    >
		<div className="_leftContainer text-left text-white">
			<p className="_assetName pl-2 text-caption-2 text-left">
				TOKEN
			</p>

			<div className="_detailsContainer flex ml-2 my-2 items-center">
			<div className="text-caption-3 text-tradeTitle pr-2">
            <p className="_assetQuantityTitle">Quantity</p>
            <p className="_assetPriceTitle">Price</p>
			</div>
			<div className="ml-2">
				<p className="_assetQuantityValue text-caption-2">
					242424
				</p>
            <p className="_assetPriceValue text-caption-2">
				10101
            </p>
			</div>
			</div>
			</div>

			<div className="_rightContainer">
				<p className="_assetExpiry text-white font-regular text-10px mt-2 mb-4">
					24/09/2020
				</p>
		</div>
			</div>
)}

export default MobileMarketActivity;