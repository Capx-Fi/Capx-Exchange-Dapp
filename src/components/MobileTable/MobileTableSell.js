import SellIcon from "../../assets/sell.svg";


const placeholderQuantity = "0.00";
const placeholderPrice = "100.00";
function MobileTableSell() {

	return(
		<div className="mobileTableBuy h-60v overflow-y-auto">
			<div className="_header py-2 bg-dark-50 rounded-tl-2xl rounded-tr-2xl">
			</div>
			<div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-55v overflow-y-auto">
				<Column />
				<Column />
				<Column />
				<Column />
				<Column />
			</div>
		</div>
	)
}

function Button() {
	return (
		<div className="border cursor-pointer border-grayLabel my-1 py-2 rounded-lg flex flex-row items-center justify-center w-fit-content px-4 mx-auto">
                <img src={SellIcon} alt="deposit" className="mr-2" />
                <p className="text-error-color-400 uppercase font-bold text-caption-2">
                SELL
                </p>
        </div>
	)
}

function Column() {
	return (
		<div className="_card flex justify-between py-2 px-2 mx-0 border border-dark-50 border-2">
					<div className="_leftContainer text-left text-white">
						<p className="_assetName bg-dark-300 p-2 rounded-full px-3 border border-2 border-dark-50 text-caption-2 text-center">12Apr2022.CAPX</p>
						
						<div className="_detailsContainer flex ml-2 my-2 items-center">
						<div className="text-caption-3 text-tradeTitle pr-2">
						<p className="_assetQuantityTitle">Quantity</p>
						<p className="_assetPriceTitle">Price</p>
						</div>
						<div className="ml-2">
							<p className="_assetQuantityValue text-caption-2">{placeholderQuantity}</p>
							<p className="_assetPriceValue text-caption-2">{placeholderPrice}</p>
						</div>
						</div>
					
					
					</div>
					<div className="_rightContainer">
						<p className="_assetExpiry text-white font-regular text-10px mt-2 mb-4">12th April, 2022</p>
						<Button />
					</div>
				</div>
	)
}

export default MobileTableSell;