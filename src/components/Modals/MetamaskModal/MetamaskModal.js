import "./MetamaskModal.scss";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import FirefoxIllustration from "../../../assets/FirefoxIllustration.png";
import NextIcon from "../../../assets/next-black.svg";
import { useTranslation } from "react-i18next";
import "../../../translations/i18n";

function MetamaskModal({ setModalMode }) {
	const { t } = useTranslation();

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
