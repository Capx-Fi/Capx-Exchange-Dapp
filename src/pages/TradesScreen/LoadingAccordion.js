import "./TradesScreen.scss";
import React, { useRef, useState } from "react";
import dummyToken from "../../assets/dummyToken.svg";
import swapIcon from "../../assets/swapIcon.svg";
import threedot from "../../assets/threedot.svg";
import tradeInfo from "../../assets/tradeInfo.svg";
import cross from "../../assets/cross.svg";

const LoadingAccordion = () => {
	const getStatusColor = (status) => {
		switch (status) {
			case "Completed":
				return "bg-primary-green-300";
			case "In Progress":
				return "bg-warning-color-400";
			case "Expired":
				return "bg-cyan";
			case "Cancelled":
				return "bg-error-color-300";
			case "Partial":
				return "bg-primary-green-500";
			case "Loading":
				return "bg-dark-100";
			default:
				return "";
		}
	};

	return (
		<>
			<div className="pb-8">
				<div className="tradesScreen_body_assetPairContainer">
					<div className="tradesScreen_body_assetPairContainer_assetPair">
						<p className="tradesScreen_body_assetPairContainer_title">Assets</p>
						<div className="tradesScreen_body_assetPairContainer_value">
							<img className="w-5 mr-2" src={dummyToken} alt="token icon" />
							<p className="text-dark-50 bg-dark-50 animate-pulse px-8">" "</p>
						</div>
					</div>
					<div className="tradesScreen_body_assetPairContainer_giveToken ml-8 mt-4">
						<p className="tradesScreen_body_assetPairContainer_title text-dark-50 bg-dark-50 animate-pulse px-16 py-2 ml-4 -mt-4">
							{" "}
						</p>
						<div className="tradesScreen_body_assetPairContainer_value text-dark-50 bg-dark-50 animate-pulse px-16 py-6 mt-2 ml-4">
							{" "}
						</div>
					</div>
					<div className="tradesScreen_body_assetPairContainer_swapIcon ">
						<img className="" src={swapIcon} alt="swap icon" />
					</div>
					<div className="tradesScreen_body_assetPairContainer_getToken mt-4">
						<p className="tradesScreen_body_assetPairContainer_title text-dark-50 bg-dark-50 animate-pulse px-16 py-2 -mt-4">
							{" "}
						</p>
						<div className="tradesScreen_body_assetPairContainer_value text-dark-50 bg-dark-50 animate-pulse px-16 py-6 mt-2">
							{" "}
						</div>
					</div>
					<div className="tradesScreen_body_assetPairContainer_separator" />
					<div className="tradesScreen_body_assetPairContainer_status">
						<div
							className={`w-28 text-caption-1 text-dark-50 font-normal rounded-2xl text-center flex justify-center items-center pb-0.5 upper:text-caption-1 desktop:text-caption-2 breakpoint:text-caption-3 phone:mr-4 phone:text-10px phone:w-20 phone:h-6 phone:mt-2 tablet:w-28 tablet:text-caption-3 tablet:h-8 animate-pulse ${getStatusColor(
								"Loading"
							)}`}
						>
							{" "}
						</div>
					</div>
					<div className="tradesScreen_body_assetPairContainer_chevron">
						<div className={""}></div>
						<img className="" src={threedot} alt="dropdown icon" />
					</div>
				</div>
				<div
					ref={null}
					style={{ maxHeight: `0px` }}
					className={`accordion__content`}
				>
					<div className="accordion_header">
						<img className="w-4 mr-1" src={tradeInfo} alt="trade icon" />
						<div className="accordion_header_title">TRADE INFO</div>
					</div>
					<hr className="accordion_separator" />
					<div className="accordion_body">
						<div className="accordion_body_left">
							<div className="accordion_body_left_title">
								EXCHANGED SO FAR :
							</div>
							<div className="accordion_body_left_value">
								<div className="accordion_body_left_value_give">
									<span> : </span>{" "}
								</div>
								<div className="accordion_body_left_value_get">
									<span> : </span>{" "}
								</div>
							</div>
						</div>
						<div className="accordion_body_right">
							<div className="accordion_body_right_title">REMAINING :</div>
							<div className="accordion_body_right_value">
								<div className="accordion_body_right_value_give">
									<span> : </span>{" "}
								</div>
								<div className="accordion_body_right_value_get">
									<span> : </span>{" "}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			);
		</>
	);
};

export default LoadingAccordion;
