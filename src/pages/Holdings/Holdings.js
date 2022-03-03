import React, { useEffect } from 'react';
import { HOLDINGS_COLUMNS } from '../../layouts/TableLayout/columns';
import TableInstanceWithSearch from '../../layouts/TableLayout/TableInstanceWithSearch';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';

import dummyHoldings from '../../layouts/TableLayout/dummyDataHoldings.json';
import { injected } from '../../utils/connector';
import { useSnackbar } from 'notistack';
import ConnectCTA from '../../components/CTA/ConnectCTA';
import { fetchHoldings } from '../../utils/fetchHoldings';
import { WRONG_CHAIN_MESSAGE } from '../../constants/config';

import NextIcon from '../../assets/next-black.svg';

function Holdings() {
  const { active, activate } = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const [holdings, setHoldings] = React.useState([]);
  useEffect(() => {
    if (active) {
      activate(injected, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          enqueueSnackbar(WRONG_CHAIN_MESSAGE, {
            variant: "error",
          });
        }
      });
    }
  }, [active, activate, enqueueSnackbar]);
  useEffect(() => {
    if (active) {
      fetchHoldings(active.account).then((holdings) => {
        setHoldings(holdings);
      });
    }
  }, [active]);
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      if (ex instanceof UnsupportedChainIdError) {
        enqueueSnackbar(WRONG_CHAIN_MESSAGE, {
          variant: "error",
        });
      }
      // console.log(ex);
    }
  }
  return (
    <>
      {!active ? (
        <div className='justify-center align-middle mx-auto flex flex-col'>
          <p className='text-white font-semibold mx-auto mt-10'>
            Connect your MetaMask Wallet to Proceed.
          </p>
          <ConnectCTA
            classes='cbutton mx-auto mt-5'
            title='CONNECT WALLET'
            icon={NextIcon}
            onClick={connect}
          />
        </div>
      ) : (
        <div className='w-9/12 ml-10 desktop:w-10/12 desktop:mt-10'>
          <TableInstanceWithSearch
            title={'Holdings'}
            subTitle={'Discover new derivative assets to trade on Capx'}
            tableData={holdings}
            columnName={HOLDINGS_COLUMNS}
          />
        </div>
      )}
    </>
  );
}

export default Holdings;
