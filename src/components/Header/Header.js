import "./Header.scss";
import CapxLogo from "../../assets/CapxExchangeLogo.svg";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import MenuIcon from "../../assets/hamburger.svg";
import { hideSideNav } from "../../redux/actions/sideNav";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { useLocation } from "react-router-dom";
import HeaderDropdown from "../HeaderSearch/HeaderDropdown";
import { fetchAllProjectData } from "../../utils/fetchAllProjectData";
import DropDown from "./DropDown/DropDown";
import AccountDropdown from "./AccountDropdown/AccountDropdown";
import {
	getExchangeURL,
	getMasterURL,
	getSortBy,
	getWrappedURL,
} from "../../constants/getChainConfig";
import useWagmi from "../../useWagmi";

function Header({ vesting, hiddenNav, showSteps, exchange, match }) {
	const location = useLocation();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { active, account, deactivate, chainId, switchNetwork } = useWagmi();

	const [projectData, setProjectData] = useState([]);

	const exchangeURL = chainId && getExchangeURL(chainId);
	const wrappedURL = chainId && getWrappedURL(chainId);
	const masterURL = chainId && getMasterURL(chainId);

	const [sortBy, setSortBy] = useState("Ethereum");
	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		if (active && chainId && exchangeURL) {
			fetchProjects();
		}
	}, [account, chainId, exchangeURL]);

	useEffect(() => {
		setSortBy(chainId && getSortBy(chainId));
	}, [chainId]);

	const fetchProjects = async () => {
		console.log("fetching projects", exchangeURL);
		const projects = await fetchAllProjectData(
			exchangeURL,
			masterURL,
			wrappedURL
		);
		console.log("projects-fetched", projects);
		setProjectData(projects);
	};

	const chainChange = async (chainId) => {
		await switchNetwork(chainId);
	};
	async function disconnect() {
		try {
			deactivate();
		} catch (ex) {
			// console.log(ex);
		}
	}
	return (
		<>
			{active && showMenu && (
				<div className="mobileMenu">
					<DropDown
						sortBy={sortBy}
						setShowMenu={setShowMenu}
						chainChange={chainChange}
					/>
					<AccountDropdown
						disconnect={disconnect}
						setShowMenu={setShowMenu}
						accountAddress={`${account?.substr(0, 6)}...${account?.substr(-4)}`}
					/>
				</div>
			)}
			<header
				className={`header z-40 ${
					vesting
						? "border-b border-dark-200 tablet:border-none"
						: "border-b border-dark-200 "
				}`}
			>
				<a href="/">
					<div>
						<img
							className={`${
								location.pathname === "/" && active
									? "header_logo"
									: "header_logoInfo"
							} ${vesting && "breakpoint:flex tablet:hidden "}`}
							src={CapxLogo}
							alt="capx logo"
						/>
					</div>
				</a>
				{active &&
					(location.pathname.includes("info") ? (
						<HeaderDropdown
							dropdownData={projectData}
							placeholderText={"Search for Assets"}
						/>
					) : location.pathname === "/exchange" || location.pathname === "/" ? (
						<ToggleSwitch />
					) : null)}
				{active ? (
					<img
						src={MenuIcon}
						className="tablet:hidden"
						alt="menu icon"
						onClick={() => setShowMenu(!showMenu)}
					/>
				) : null}
				{!hiddenNav && (
					<div className="header_navbar">
						{active && <DropDown sortBy={sortBy} chainChange={chainChange} />}
						{active ? (
							<>
								<div className="tablet:block breakpoint:hidden">
									<AccountDropdown
										disconnect={disconnect}
										accountAddress={`${account?.substr(0, 6)}...`}
									/>
								</div>

								<div className="tablet:hidden breakpoint:block">
									<AccountDropdown
										disconnect={disconnect}
										accountAddress={`${account?.substr(
											0,
											6
										)}...${account?.substr(-4)}`}
									/>
								</div>
							</>
						) : null}
					</div>
				)}{" "}
			</header>
		</>
	);
}

const mapStateToProps = (state) => {
	return {
		sideNavState: state.sideNav,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		hideSideNav: () => dispatch(hideSideNav()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
