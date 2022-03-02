import "./MobileTableBuy.scss";
import DepositIcon from "../../assets/DepositIcon.svg";


const placeholderQuantity = "0.00";
const placeholderPrice = "100.00";
function MobileTableBuy() {

	return(
		<div className="mobileTableBuy">
			<div className="_header py-2 bg-dark-50 rounded-tl-2xl rounded-tr-2xl">
				{/* <p className="_title">Header Placeholder</p> */}
			</div>
			<div className="_body border border-dark-50 my-0">
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
		<div className="border cursor-pointer border-grayLabel py-2 rounded-lg flex flex-row items-center justify-center w-fit-content px-5 mx-auto">
                <img src={DepositIcon} alt="deposit" className="mr-2" />
                <p className="text-success-color-400 uppercase font-bold text-caption-2">
                BUY
                </p>
        </div>
	)
}

function Column() {
	return (
		<div className="_card flex justify-between py-4 px-2 mx-0 border border-dark-50 border-2">
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
						<p className="_assetExpiry text-white text-[10px] mt-2 mb-4">12th April, 2022</p>
						<Button />
					</div>
				</div>
	)
}

export default MobileTableBuy;