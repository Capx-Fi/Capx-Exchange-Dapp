import {useDispatch} from "react-redux";
import WithdrawIcon from "../../assets/WithdrawIcon.svg";
import {setWithdrawTicker} from "../../redux/actions/withdraw";

function MobileWithdraw(
	{filter, refetch}
) {
	return (
		<>
		<div className="mobileWithdrawTable h-60v w-85v overflow-y-auto">
        <div className="_header py-2 bg-dark-50 rounded-tl-2xl rounded-tr-2xl"></div>
        <div className="_body border border-dark-50 rounded-br-2xl rounded-bl-2xl h-55v overflow-y-auto">
		<Column />
		<Column />
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
	return (
		<>
		<div 
		className="_card flex justify-between py-3 px-4 mx-0  border-dark-50 border-2"
		onClick={() => {dispatch(setWithdrawTicker(null))}}
		>
		<div className="_leftContainer text-left text-white">
		<p className="_assetName bg-dark-300 p-2 rounded-full px-3 border-2 border-dark-50 text-caption-2 text-center">
			$CAPX
        </p>

		<div className="_detailsContainer flex flex-row ml-2 my-2 items-center">
		<div className="text-caption-3 text-tradeTitle pr-2">
			<p className="_assetQuantityTitle">Quantity</p>
		</div>
		<div className="ml-2">
            <p className="_assetQuantityValue text-caption-2">
            24
        </p>
		</div>
		</div>
		</div>

		<div className="_rightContainer">
        <p className="_assetExpiry text-white font-regular text-10px mt-2 mb-4">
		17
        </p>
        <Button />
	</div>
	</div>
		</>
	)
}



function Button() {
	return (
	<div className="border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto">
    <img src={WithdrawIcon} alt="deposit" className="mr-2" />

    <p className="text-success-color-400 uppercase font-bold text-caption-2">
		WITHDRAW
    </p>
    </div>
	)
}


export default MobileWithdraw;