import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TokenListTable.scss';

import dummyDataExchange from '../../layouts/TableLayout/dummyDataExchange.json';
import SellIcon from '../../assets/sell.svg';

import { hideSideNav } from '../../redux/actions/sideNav';
import useWindowSize from '../../utils/windowSize';
import { fetchPortfolio } from '../../utils/fetchPortfolio';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { setSellTicker, setTickerBalance } from '../../redux/actions/exchange';
import { fetchContractBalances } from '../../utils/fetchContractBalances';

const { Column, ColumnGroup } = Table;

function TokenSellTable({ filter }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);
  const { active, account, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPortfolioHoldings();
  }, [account, chainId]);
  const fetchPortfolioHoldings = async () => {
    setLoading(true);
    const holdings = await fetchPortfolio(account);
    const contractHoldings = await fetchContractBalances(account);
    const combinedHoldings = [...holdings, ...contractHoldings];
    // sort combine holdings absed on unlock date
    combinedHoldings.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    setPortfolioHoldings(combinedHoldings);
    console.log(holdings);
    setLoading(false);
  };

  useEffect(() => {
    console.log(filter);
    if (filter === '' || filter === undefined) {
      setTokenList(portfolioHoldings);
    } else {
      const filteredList = portfolioHoldings.filter((token) => {
        return token.asset.toLowerCase().includes(filter?.toLowerCase());
      });
      setTokenList(filteredList);
    }
  }, [filter]);

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }

  const dispatch = useDispatch();
  return (
    <div className='tokenListTableContainer'>
      <Table
        dataSource={portfolioHoldings}
        locale={{ emptyText: loading ? 'Loading Tokens...' : 'No Token Found' }}
        pagination={false}
        scroll={{ y: 500 }}
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: (e) => {
              console.log(record);
              dispatch(setSellTicker(record));
              dispatch(setTickerBalance(record.quantity));
            },
          };
        }}
      >
        <Column
          title='Asset'
          sorter={(a, b) => a.asset - b.asset}
          showSorterTooltip={false}
          width={'30%'}
          dataIndex='asset'
          key='asset'
          render={(value, row) => {
            return (
              <Link to={`/info/${row.assetID}`}>
                <p className='text-white hover:text-primary-green-400'>
                  {value}
                </p>
              </Link>
            );
          }}
        />
        <Column title='Quantity' dataIndex='quantity' key='quantity' />
        <Column title='Unlock Date' dataIndex='unlockDate' key='unlockDate' />
        <Column
          title=''
          dataIndex='asset'
          key='asset'
          render={(value, row) => {
            return (
              <div className='border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto'>
                <img src={SellIcon} alt='deposit' className='mr-2' />

                <p className='text-error-color-400 uppercase font-bold text-caption-2'>
                  SELL
                </p>
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
}

export default TokenSellTable;
