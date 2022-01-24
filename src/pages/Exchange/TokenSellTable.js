import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TokenListTable.scss';

import dummyDataExchange from '../../layouts/TableLayout/dummyDataExchange.json';
import SellIcon from '../../assets/sell.svg';

import { hideSideNav } from '../../redux/actions/sideNav';
import useWindowSize from '../../utils/windowSize';
import { fetchPortfolio } from '../../utils/fetchPortfolio';
import { useDispatch } from 'react-redux';
import { setSellTicker } from '../../redux/actions/exchange';

const { Column, ColumnGroup } = Table;

function TokenSellTable({ filter }) {
  const [tokenList, setTokenList] = useState(dummyDataExchange);
  const [portfolioHoldings, setPortfolioHoldings] = useState([]);

  useEffect(() => {
    fetchPortfolioHoldings();
  }, []);
  const fetchPortfolioHoldings = async () => {
    const holdings = await fetchPortfolio();
    console.log(holdings);
    setPortfolioHoldings(holdings);
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
        pagination={false}
        scroll={{ y: 500 }}
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: (e) => {
              dispatch(setSellTicker(record));
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
              <Link to={`/info/${value}`}>
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
              <Link to={`/exchange/${value}`}>
                <div className='border cursor-pointer border-grayLabel px-3 py-2 rounded-lg flex flex-row justify-center w-fit-content mx-auto'>
                  <img src={SellIcon} alt='deposit' className='mr-2' />

                  <p className='text-error-color-400 uppercase font-bold text-caption-2'>
                    SELL
                  </p>
                </div>
              </Link>
            );
          }}
        />
      </Table>
    </div>
  );
}

export default TokenSellTable;
