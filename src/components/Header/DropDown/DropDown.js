import React, { useEffect, useState } from "react";
import "./DropDown.scss";
import Web3 from "web3";
import bscLogo from "../../../assets/bsc-logo.svg";
import maticLogo from "../../../assets/matic-logo.svg";
import avalancheLogo from "../../../assets/avalanche-logo.svg";
import ethLogo from "../../../assets/ethereum-logo.svg";
import { useWeb3React } from "@web3-react/core";

function DropDown({ sortBy, chainChange, setShowMenu }) {
	const [open, setOpen] = useState(false);
	const { active, chainId, connector } = useWeb3React();

	const [web3, setWeb3] = useState(null);

	const setupProvider = async () => {
		let result = await connector?.getProvider().then((res) => {
			return res;
		});
		return result;
	};

	useEffect(() => {
		setupProvider().then((res) => {
			setWeb3(new Web3(res));
		});
	}, [active, chainId]);

	return (
		<div className="relative">
			<button
				className={`header-dropdown-button ${
					open ? "border-success-color-400" : "border-dark-50"
				}`}
				onClick={() => setOpen(!open)}
			>
				<span className="mr-4 flex flex-row items-center">
					<img
						src={
							sortBy === "Matic"
								? maticLogo
								: sortBy === "BSC"
								? bscLogo
								: sortBy === "Ethereum"
								? ethLogo
								: avalancheLogo
						}
						alt="chain-logo"
						className="w-4 h-4 tablet:w-3 tablet:h-3 breakpoint:w-4 breakpoint:h-4 mr-2"
					/>
					{sortBy === "matic" ? "Matic" : sortBy}
				</span>
				<svg
					className="w-5 h-5 text-grayLabel dark:text-white"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			{open && (
				<div className="absolute right-0 bg-dark-300 py-2 mt-2 bg-whitedivide-y divide-gray-600 rounded-md shadow-xl w-40">
					{/* <p
						className="option"
						onClick={() => {
							chainChange("Ethereum");
							setOpen(false);
						}}
					>
						<img src={ethLogo} alt="eth-logo" className="w-4 h-4 mr-2" />
						Ethereum
					</p> */}
					<p
						className="option"
						onClick={() => {
							chainChange("Matic");
							setOpen(false);
							setShowMenu && setShowMenu(false);
						}}
					>
						<img src={maticLogo} alt="matic-logo" className="w-4 h-4 mr-2" />
						Matic
					</p>
					<p
						className="option"
						onClick={() => {
							chainChange("BSC");
							setOpen(false);
							setShowMenu && setShowMenu(false);
						}}
					>
						<img src={bscLogo} alt="bsc-logo" className="w-4 h-4 mr-2" />
						BSC
					</p>
					<p
						className="option"
						onClick={() => {
							chainChange("Avalanche");
							setOpen(false);
							setShowMenu && setShowMenu(false);
						}}
					>
						<img src={avalancheLogo} alt="avax-logo" className="w-4 h-4 mr-2" />
						Avalanche
					</p>
				</div>
			)}
		</div>
	);
}

export default DropDown;
