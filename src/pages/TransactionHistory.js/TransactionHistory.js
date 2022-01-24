import React from 'react';
import { TRANSACTION_COLUMNS } from '../../layouts/TableLayout/columns';
import TableInstanceWithSearch from '../../layouts/TableLayout/TableInstanceWithSearch';

import dummyHistory from '../../layouts/TableLayout/dummyDataHistory.json';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useSnackbar } from 'notistack';
import { injected } from '../../utils/connector';
import ConnectCTA from '../../components/CTA/ConnectCTA';

import NextIcon from '../../assets/next-black.svg';

function TransactionHistory() {
  const { active, activate } = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
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
        <div className='w-9/12 ml-10'>
          <TableInstanceWithSearch
            title={'Transaction History'}
            subTitle={'All Transaction History'}
            tableData={dummyHistory}
            columnName={TRANSACTION_COLUMNS}
          />
        </div>
      )}
    </>
  );
}

export default TransactionHistory;
