import './Header.scss';
import CapxLogo from '../../assets/CapxExchangeLogo.svg';
import LogoutIcon from '../../assets/logout.svg';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import { useMetamask } from '../../metamaskReactHook/index';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { injected } from '../../utils/connector';

import { connect } from 'react-redux';

import { useEffect, useState } from 'react';
import DeskCTA from '../CTA/DeskCTA';

import NextIcon from '../../assets/next-black.svg';
import ConnectCTA from '../CTA/ConnectCTA';
import { hideSideNav } from '../../redux/actions/sideNav';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { useLocation } from 'react-router-dom';
import GlobalSearchBox from '../../layouts/TableLayout/GlobalSearchBox';
import HeaderSearch from '../HeaderSearch/HeaderSearch';

function Header({ vesting, hiddenNav, showSteps, exchange, match }) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const { metaState, getChain } = useMetamask();
  const desiredChainId = '4';
  const currentChainId = metaState.chain.id?.toString();
  const [dashboardModal, setDashboardModal] = useState(false);
  const handleCloseSelectDashboard = () => {
    setDashboardModal(false);
  };
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      if (ex instanceof UnsupportedChainIdError) {
        enqueueSnackbar('Please connect to the Rinkeby Chain.', {
          variant: 'error',
        });
      }
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }
  return (
    <>
      <header
        className={`header z-40 ${
          vesting
            ? 'border-b border-dark-200 tablet:border-none'
            : 'border-b border-dark-200 '
        }`}
      >
        <a href='/'>
          <div>
            <img
              className={`header_logo ${vesting && 'flex tablet:hidden '}`}
              src={CapxLogo}
              alt='capx logo'
            />
          </div>
        </a>
        
        {active && (location.pathname.includes('info') ? (
          <HeaderSearch />
        ) : (
          <ToggleSwitch />
        ))}
        {!hiddenNav && (
          <div className='header_navbar'>
            {active ? (
              <div className='header_navbar_logoutbutton'>
                <div className='header_navbar_logoutbutton_text'>
                  {' '}
                  {`${account.substr(0, 6)}...${account.substr(-4)}`}
                </div>
                <img
                  className='header_navbar_logoutbutton_icon'
                  onClick={disconnect}
                  src={LogoutIcon}
                  alt='logout icon'
                />
              </div>
            ) : (
              <ConnectCTA
                classes='cbutton'
                title='CONNECT'
                icon={NextIcon}
                onClick={connect}
              />
            )}
          </div>
        )}{' '}
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
