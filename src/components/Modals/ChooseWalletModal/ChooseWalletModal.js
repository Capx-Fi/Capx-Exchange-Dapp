import React from "react";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import MetamaskIcon from "../../../assets/MetamaskIcon.svg";
import WalletConnectIcon from "../../../assets/walletconnect-logo.svg";
import "./ChooseWalletModal.scss";
import CrossIcon from "../../../assets/cross.svg";
import infoIcon from "../../../assets/info.svg";
import useWagmi from "../../../useWagmi";

const Landing = ({ setModalMode }) => {
	const { connectors, connect } = useWagmi();

	//TODO: Add notification for wrong chain

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
						{connectors[0].ready && (
							<div
								onClick={() => connect({ connector: connectors[0] })}
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
									{connectors[0].name}
								</div>
							</div>
						)}
						{connectors[1].ready && (
							<div
								onClick={() => connect({ connector: connectors[1] })}
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
									{connectors[1].name}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</article>
	);
};

export default Landing;
