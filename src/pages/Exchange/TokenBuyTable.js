import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TokenListTable.scss';

import dummyDataExchange from '../../layouts/TableLayout/dummyDataExchange.json';
import DepositIcon from '../../assets/DepositIcon.svg';

import { hideSideNav } from '../../redux/actions/sideNav';
import useWindowSize from '../../utils/windowSize';
import { fetchListedTokens } from '../../utils/fetchListedTokens';
import { useDispatch } from 'react-redux';
import { setBuyTicker } from '../../redux/actions/exchange';

const { Column, ColumnGroup } = Table;

function TokenBuyTable({ filter, setAmount }) {
  const [tokenList, setTokenList] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);
  const fetchListings = async () => {
    const listingData = await fetchListedTokens();
    setListings(listingData);
    setTokenList(listingData);
  };

  useEffect(() => {
    console.log(filter);
    if (filter === '' || filter === undefined) {
      setTokenList(listings);
    } else {
      const filteredList = listings.filter((token) => {
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
        dataSource={tokenList}
        pagination={false}
        scroll={{ y: 480 }}
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: (e) => {
              dispatch(setBuyTicker(record));
            },
          };
        }}
      >
        <Column
          title='Asset'
          sorter={(a, b) => a.asset - b.asset}
          showSorterTooltip={false}
          width={'22%'}
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
        <Column
          title='Price'
          dataIndex='price'
          key='price'
          render={(value, row) => {
            return (
              <div>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'USD',
                  maximumSignificantDigits: 6,
                }).format(Number(value))}
              </div>
            );
          }}
        />
        <Column
          title='Quantity'
          dataIndex='quantity'
          key='quantity'
          render={(value, row) => {
            return (
              <div>
                {new Intl.NumberFormat('en-IN', {
                  maximumSignificantDigits: 4,
                }).format(Number(value))}
              </div>
            );
          }}
        />
        <Column title='Expiry Time' dataIndex='expiryTime' key='expiryTime' />
        <Column
          title=''
          dataIndex='asset'
          key='asset'
          render={(value, row) => {
            return (
              <Link to={`/exchange/${value}`}>
                <div className='border cursor-pointer border-grayLabel py-2 rounded-lg flex flex-row justify-center w-fit-content px-3 mx-auto'>
                  <img src={DepositIcon} alt='deposit' className='mr-2' />
                  <p className='text-success-color-400 uppercase font-bold text-caption-2'>
                    BUY
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

export default TokenBuyTable;
