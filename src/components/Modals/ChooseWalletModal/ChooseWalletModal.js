import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import MetamaskIcon from "../../../assets/MetamaskIcon.svg";
import WalletConnectIcon from "../../../assets/walletconnect-logo.svg";
import { Link } from "react-router-dom";
import "./ChooseWalletModal.scss";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { WRONG_CHAIN_MESSAGE } from "../../../constants/config";
import { injected, walletconnect } from "../../../utils/connector";
import { useTranslation } from "react-i18next";
import CrossIcon from "../../../assets/cross.svg";
import useWagmi from "../../../useWagmi";

const Landing = ({ setModalMode }) => {
  const { active, account, library, connector, connect } = useWagmi(injected);
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { error } = useWeb3React();
  const unsupportedChainIdError =
    error && error instanceof UnsupportedChainIdError;

  //   async function connect() {
  //     try {
  //       await activate(injected);
  //       if (unsupportedChainIdError) {
  //         enqueueSnackbar(`${WRONG_CHAIN_MESSAGE}`, {
  //           variant: "error",
  //         });
  //       }
  //     } catch (ex) {
  //       if (error instanceof UnsupportedChainIdError) {
  //         enqueueSnackbar(`${WRONG_CHAIN_MESSAGE}`, {
  //           variant: "error",
  //         });
  //       }
  //       alert(ex);
  //     }
  //   }

  async function walletConnect() {
    // try {
    //   await activate(walletconnect);
    //   if (unsupportedChainIdError) {
    //     enqueueSnackbar(`${WRONG_CHAIN_MESSAGE}`, {
    //       variant: "error",
    //     });
    //   }
    // } catch (ex) {
    //   if (error instanceof UnsupportedChainIdError) {
    //     enqueueSnackbar(`${WRONG_CHAIN_MESSAGE}`, {
    //       variant: "error",
    //     });
    //   }
    //   console.log(ex);
    // }
  }

  return (
    <article className="h-full bg-dark-400 flex choose_screen overflow-hidden m-auto phone:mt-20 tablet:-mt-10 breakpoint:mt-10">
      <Header hiddenNav />
      <div className="justify-center items-center m-auto breakpoint:mt-20 desktop:mt-20 tablet:mt-48 laptop:mt-auto overflow-hidden">
        <div className="herocontainer overflow-hidden phone:w-90v phone:mt-12 screen:mt-0 tablet:w-75v phone:px-8 phone:py-6 screen:px-16 screen:py-10 desktop:px-20 desktop:py-14 rounded-2xl bg-opacity-70 text-white relative screen:w-65v desktop:w-60v flex flex-col items-start">
          <img
            src={CrossIcon}
            className="absolute cursor-pointer phone:top-8 phone:right-5 phone:w-5 phone:h-5 breakpoint:top-10 breakpoint:right-10 tablet:w-10 tablet:h-10"
            onClick={() => {
              setModalMode(0);
            }}
            alt="close icon"
          />
          <div className="title phone:text-heading-3 phone:leading-1 tablet:text-heading-2 screen:text-heading-2 screen:leading-lh-64 desktop:text-40px desktop:leading-lh-64 twok:text-50px twok:leading-lh-54 tablet:leading-title-1 font-semibold w-10/12 text-left">
            {"Connect Your Wallet"}
          </div>
          <div className="tablet:text-paragraph-2 text-left desktop:mt-2 desktop:text-paragraph-1 desktop:leading-subheading twok:text-subheading twok:leading-subheading text-greylabel2">
            {"Connect with one of our available wallet providers"}
          </div>
          <div className="herobuttons flex flex-col gap-y-2 my-14 w-full">
            <div
              onClick={() => connect()}
              className="herocontainer_connectbutton flex flex-start rounded-xl items-center flex px-5 py-4 z-10 cursor-pointer"
            >
              <div>
                <img
                  src={MetamaskIcon}
                  alt="Metamask Icon"
                  className="inline-block phone:w-10 phone:h-10 desktop:w-16 desktop:h-16 ml-3 tablet:mr-12 phone:mr-6"
                />
              </div>
              <div className="text-white desktop:text-paragraph-2 breakpoint:text-caption-1 twok:text-subheading desktop-captions-1 twok:leading-subheading font-semibold">
                {"Metamask"}
              </div>
            </div>
            <div
              onClick={() => {
                walletConnect();
              }}
              className="herocontainer_connectbutton flex flex-start rounded-xl items-center flex px-5 py-4 z-10 cursor-pointer"
            >
              <div>
                <img
                  src={WalletConnectIcon}
                  alt="WalletConnect Icon"
                  className="inline-block phone:w-10 phone:h-10 desktop:w-16 desktop:h-16 ml-3 tablet:mr-12 phone:mr-6"
                />
              </div>
              <div className="text-white desktop:text-paragraph-2 breakpoint:text-caption-1 twok:text-subheading desktop-captions-1 twok:leading-subheading font-semibold">
                {"WalletConnect"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </article>
  );
};

export default Landing;
