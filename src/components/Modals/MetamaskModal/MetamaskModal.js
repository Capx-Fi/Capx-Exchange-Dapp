import "./MetamaskModal.scss";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { Link } from "react-router-dom";
import FirefoxIllustration from "../../../assets/FirefoxIllustration.png";
import MetamaskIcon from "../../../assets/MetamaskIcon.svg";
import NextIcon from "../../../assets/next-black.svg";
import { injected } from "../../../utils/connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { WRONG_CHAIN_MESSAGE } from "../../../constants/config";
import "../../../translations/i18n";
import { useState } from "react";

function MetamaskModal({ setModalMode }) {
	const { active, account, library, connector, activate } = useWeb3React();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { t } = useTranslation();
	const { error } = useWeb3React();
	const isMetamask = window.ethereum && window.ethereum.isMetaMask;
	const unsupportedChainIdError =
		error && error instanceof UnsupportedChainIdError;

	return (
		<article className="metamaskmodalscreen">
			<Header hiddenNav />
			<section className="metamaskmodalscreen_maincontainer">
				<div className="metamaskmodalscreen_maincontainer_herocontainer">
					<div className="metamaskmodalscreen_maincontainer_herocontainer_title">
						{t("please_connect_metamask")}
						<br /> {"Wallet to Proceed"}
					</div>
					<div
						className="metamaskmodalscreen_maincontainer_herocontainer_button"
						onClick={() => {
							setModalMode(1);
						}}
					>
						<div className="metamaskmodalscreen_maincontainer_herocontainer_button_text">
							{t("Connect Wallet")}
						</div>
						<img
							className="metamaskmodalscreen_maincontainer_herocontainer_button_icon"
							src={NextIcon}
							alt="Next Icon"
						/>
					</div>
					<img
						className="metamaskmodalscreen_maincontainer_herocontainer_firefoxillustration"
						src={FirefoxIllustration}
						alt="ETH Illustration"
					/>
				</div>
			</section>
			<Footer />
		</article>
	);
}

export default MetamaskModal;
