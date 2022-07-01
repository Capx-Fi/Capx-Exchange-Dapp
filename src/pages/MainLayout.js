import { Route, Switch } from "react-router";
import "./MainLayout.scss";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import TradesScreen from "./TradesScreen/TradesScreen";

import { connect } from "react-redux";
import { hideSideNav } from "../redux/actions/sideNav";
import ExchangeScreen from "./Exchange/Exchange";
import WithdrawScreen from "./Withdraw/Withdraw";
import ProjectInfo from "./ProjectInfo/ProjectInfo";
import useWagmi from "../constants/useWagmi";

const MainLayout = ({ sideNavState }) => {
	const { active } = useWagmi();
	return (
		<div className="layout">
			<Header />
			<div className="flex pt-20 md:flex-row flex-col desktop:pt-20">
				<div
					className={`${
						/* sideNavState.visible */ false ? "w-19v" : "hidden"
					} bg-dark-50`}
				></div>
				<div
					className={`${
						/* sideNavState.visible */ false ? "w-81v" : "w-full"
					} root_maincontainer`}
				>
					<main>
						<div
							className={`w-11/12 mx-auto phone:pb-0 ${
								!active ? `tablet:pb-0 desktop:-mt-8` : `tablet:pb-12`
							} bg-dark-400 desktop:w-full desktop:mb-0 phone:w-full`}
						>
							<Switch>
								<Route exact path="/" component={ExchangeScreen} />
								<Route exact path="/trades" component={TradesScreen} />
								<Route exact path="/exchange" component={ExchangeScreen} />
								<Route exact path="/info/:ticker" component={ProjectInfo} />
								<Route exact path="/withdraw" component={WithdrawScreen} />
							</Switch>
						</div>
					</main>
				</div>
			</div>
			<Footer />
		</div>
	);
};

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

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
