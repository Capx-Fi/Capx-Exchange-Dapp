import './Header.scss';
import CapxLogo from '../../assets/CapxExchangeLogo.svg';
import LogoutIcon from '../../assets/logout.svg';
import { useSnackbar } from 'notistack';
import { hexStripZeros } from '@ethersproject/bytes';
import Web3 from 'web3';
import { Web3Provider } from '@ethersproject/providers';

import { useMetamask } from '../../metamaskReactHook/index';

import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { injected } from '../../utils/connector';

import { connect } from 'react-redux';

import { useEffect, useState } from 'react';

import NextIcon from '../../assets/next-black.svg';
import ConnectCTA from '../CTA/ConnectCTA';
import { hideSideNav } from '../../redux/actions/sideNav';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { useLocation } from 'react-router-dom';
import HeaderDropdown from '../HeaderSearch/HeaderDropdown';
import { fetchAllProjectData } from '../../utils/fetchAllProjectData';
import {
  BSC_CHAIN_ID,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC,
  CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM,
  CONTRACT_ADDRESS_CAPX_USDT_BSC,
  CONTRACT_ADDRESS_CAPX_USDT_MATIC,
  CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM,
  MATIC_CHAIN_ID,
  GRAPHAPIURL_EXCHANGE_BSC,
  GRAPHAPIURL_EXCHANGE_MATIC,
  GRAPHAPIURL_EXCHANGE_ETHEREUM,
  GRAPHAPIURL_MASTER_BSC,
  GRAPHAPIURL_MASTER_MATIC,
  GRAPHAPIURL_MASTER_ETHEREUM,
  GRAPHAPIURL_WRAPPED_MATIC,
  GRAPHAPIURL_WRAPPED_BSC,
  GRAPHAPIURL_WRAPPED_ETHEREUM,
  WRONG_CHAIN_MESSAGE,
} from '../../constants/config';
import DropDown from './DropDown/DropDown';
import AccountDropdown from './AccountDropdown/AccountDropdown';

function Header({ vesting, hiddenNav, showSteps, exchange, match }) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { active, account, library, connector, activate, deactivate, chainId } =
    useWeb3React();
  const { metaState, getChain } = useMetamask();
  const [projectData, setProjectData] = useState([]);
  const desiredChainId = '4';
  const currentChainId = metaState.chain.id?.toString();
  const [dashboardModal, setDashboardModal] = useState(false);

  const web3 = new Web3(Web3.givenProvider);
  const CHAIN_EXCHANGE_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_EXCHANGE_MATIC
      : CONTRACT_ADDRESS_CAPX_EXCHANGE_ETHEREUM;
  const CHAIN_USDT_CONTRACT_ADDRESS =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? CONTRACT_ADDRESS_CAPX_USDT_MATIC
      : CONTRACT_ADDRESS_CAPX_USDT_ETHEREUM;
  const exchangeURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_EXCHANGE_MATIC
      : GRAPHAPIURL_EXCHANGE_ETHEREUM;
  const wrappedURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? GRAPHAPIURL_WRAPPED_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_WRAPPED_MATIC
      : GRAPHAPIURL_WRAPPED_ETHEREUM;
  const masterURL =
    chainId?.toString() === BSC_CHAIN_ID.toString()
      ? GRAPHAPIURL_MASTER_BSC
      : chainId?.toString() === MATIC_CHAIN_ID.toString()
      ? GRAPHAPIURL_MASTER_MATIC
      : GRAPHAPIURL_MASTER_ETHEREUM;

  const [sortBy, setSortBy] = useState('Ethereum');
  const handleCloseSelectDashboard = () => {
    setDashboardModal(false);
  };
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      if (ex instanceof UnsupportedChainIdError) {
        enqueueSnackbar(WRONG_CHAIN_MESSAGE, {
          variant: 'error',
        });
      }
    }
  }
  useEffect(() => {
    if (active) fetchProjects();
  }, [account, chainId]);
  useEffect(() => {
    if (chainId === 80001) setSortBy('Matic');
    else if (chainId === 97) setSortBy('BSC');
    else setSortBy('Ethereum');
  }, [chainId]);
  const fetchProjects = async () => {
    const projects = await fetchAllProjectData(
      exchangeURL,
      masterURL,
      wrappedURL
    );
    setProjectData(projects);
  };

  const chainChange = async (chainName) => {
    if (chainName === 'Ethereum') {
      try {
        await web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }],
        });
      } catch (error) {}
    } else if (chainName === 'Matic') {
      try {
        await web3.currentProvider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881',
              chainName: 'Polygon Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        });
        // await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [
        //     {
        //       chainId: "0x89",
        //       chainName: "Polygon",
        //       nativeCurrency: {
        //         name: "MATIC",
        //         symbol: "MATIC",
        //         decimals: 18,
        //       },
        //       rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
        //       blockExplorerUrls: ["https://polygonscan.com/"],
        //     },
        //   ],
        // });
      } catch (error) {}
    } else if (chainName === 'BSC') {
      try {
        await web3.currentProvider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'Binance Smart Chain Test',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            },
          ],
        });
        // await window.ethereum.request({
        //   method: "wallet_addEthereumChain",
        //   params: [
        //     {
        //       chainId: "0x38",
        //       chainName: "Binance Smart Chain",
        //       nativeCurrency: {
        //         name: "BNB",
        //         symbol: "BNB",
        //         decimals: 18,
        //       },
        //       rpcUrls: ["https://bsc-dataseed.binance.org/"],
        //       blockExplorerUrls: ["https://bscscan.com/"],
        //     },
        //   ],
        // });
      } catch (error) {
        console.log(error);
      }
    }
  };
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
        {active &&
          (location.pathname.includes('info') ? (
            <HeaderDropdown
              dropdownData={projectData}
              placeholderText={'Search for Assets or Projects'}
            />
          ) : location.pathname === '/exchange' || location.pathname === '/' ? (
            <ToggleSwitch />
          ) : null)}
        {!hiddenNav && (
          <div className='header_navbar'>
            <DropDown sortBy={sortBy} chainChange={chainChange} />
            {active ? (
              // <div className="ml-4 header_navbar_logoutbutton">
              //   <div className="header_navbar_logoutbutton_text">
              //     {" "}
              //     {`${account.substr(0, 6)}...${account.substr(-4)}`}
              //   </div>
              //   <svg
              //     className="w-5 h-5 text-white dark:text-white"
              //     xmlns="http://www.w3.org/2000/svg"
              //     viewBox="0 0 20 20"
              //     fill="currentColor"
              //   >
              //     <path
              //       fill-rule="evenodd"
              //       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              //       clip-rule="evenodd"
              //     />
              //   </svg>
              // </div>
              <AccountDropdown
                disconnect={disconnect}
                accountAddress={`${account.substr(0, 6)}...${account.substr(
                  -4
                )}`}
              />
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
