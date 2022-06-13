import React from "react";
import { useDispatch } from "react-redux";
import WarningCard from "../WarningCard/WarningCard";
import { Tooltip, withStyles } from "@material-ui/core";

import "./RefresherInput.scss";

function RefresherInput({
	ticker,
	setTicker,
	disabled,
	icon,
	balance,
	isMax,
	setMaxAmount,
	value,
	warningText,
	warningRedirect,
	type,
}) {
	const HtmlTooltip = withStyles((theme) => ({
		tooltip: {
			background: "#2A383C",
			color: "#F1FAF2",
			maxWidth: 800,
			fontSize: theme.typography.pxToRem(12),
			borderRadius: "4px",
			zIndex: 100,
		},
	}))(Tooltip);
	return (
		<>
			<div
				className={`refresherInput_inputContainer ${disabled && "opacity-50"} ${
					ticker
						? warningText
							? "warning_gradient_bg ring-warning-color-500"
							: "ring-success-color-500"
						: "ring-dark-50"
				}`}
			>
				<div className="refresherInput_inputContainer_lockWrapper">
					<img
						className={`refresherInput_inputContainer_lockWrapper_icon ${
							!icon && "hidden"
						}`}
						src={icon}
						alt="lock icon"
					/>
					<input
						className="refresherInput_inputContainer_input"
						type={type ? type : "number"}
						placeholder="0"
						value={ticker && value}
						disabled={disabled}
						onChange={(e) => {
							setTicker(e);
						}}
					/>
				</div>
				{balance !== null && (
					<div className="refresherInput_inputContainer_balanceContainer">
						<div className="refresherInput_inputContainer_balanceContainer_main">
							<p className="refresherInput_inputContainer_balanceContainer_main_text">
								BAL
							</p>
							{isMax && (
								<p
									className="refresherInput_inputContainer_balanceContainer_main_max"
									onClick={() => setMaxAmount()}
								>
									MAX
								</p>
							)}
						</div>
						<div className="refresherInput_inputContainer_balanceContainer_value">
							{" "}
							{balance?.length > 10 ? (
								<HtmlTooltip
									arrow
									placement="bottom-center"
									title={
										<React.Fragment className="flex justify-between">
											<span className="flex justify-between items-center font-bold pr-2">
												{balance ? balance : "0"}
											</span>
										</React.Fragment>
									}
								>
									<div>
										{balance?.length > 10
											? balance.substring(0, 10) + "..."
											: balance}
									</div>
								</HtmlTooltip>
							) : (
								<p>{balance}</p>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default RefresherInput;
