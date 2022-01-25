import "./MetamaskModal.scss";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { Link } from "react-router-dom";
import FirefoxIllustration from "../../../assets/FirefoxIllustration.png";
import MetamaskIcon from "../../../assets/MetamaskIcon.svg";
import { injected } from "../../../utils/connector";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import "../../../translations/i18n";
function MetamaskModal() {
  const { active, account, library, connector, activate } = useWeb3React();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { error } = useWeb3React();
  const isMetamask = window.ethereum && window.ethereum.isMetaMask;
  const unsupportedChainIdError =
    error && error instanceof UnsupportedChainIdError;
  async function connect() {
    try {
      await activate(injected);
      if (unsupportedChainIdError) {
        enqueueSnackbar("Please connect to the Rinkeby Chain.", {
          variant: "error",
        });
      }
    } catch (ex) {
      if (error instanceof UnsupportedChainIdError) {
        enqueueSnackbar(
          "Please connect to the Rinkeby Chain.",
          {
            variant: "error",
          }
        );
      }
      alert(ex);
    }
  }
  return (
    <article className="metamaskmodalscreen">
      <Header hiddenNav />
      <section className="metamaskmodalscreen_maincontainer">
        <div className="metamaskmodalscreen_maincontainer_herocontainer">
          <div className="metamaskmodalscreen_maincontainer_herocontainer_title">
            {t("please_connect_metamask")}
            <br /> {t("please_connect_metamask_2")}
          </div>
          {/* <div className="metamaskmodalscreen_maincontainer_herocontainer_title">
            {t("please_connect_metamask_2")}
          </div> */}
          {isMetamask ? (
            <div
              className="metamaskmodalscreen_maincontainer_herocontainer_button"
              onClick={() => {
                connect();
              }}
            >
              <img
                className="metamaskmodalscreen_maincontainer_herocontainer_button_icon"
                src={MetamaskIcon}
                alt="Metamask Icon"
              />
              <div className="metamaskmodalscreen_maincontainer_herocontainer_button_text">
                {t("connect_metamask")}
              </div>
            </div>
          ) : (
            <div
              className="metamaskmodalscreen_maincontainer_herocontainer_button"
              onClick={() => {
                var win = window.open("https://metamask.io/", "_blank");
                win.focus();
              }}
            >
              <img
                className="metamaskmodalscreen_maincontainer_herocontainer_button_icon"
                src={MetamaskIcon}
                alt="Metamask Icon"
              />
              <div className="metamaskmodalscreen_maincontainer_herocontainer_button_text">
                {t("install_metamask")}
              </div>
            </div>
          )}
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
