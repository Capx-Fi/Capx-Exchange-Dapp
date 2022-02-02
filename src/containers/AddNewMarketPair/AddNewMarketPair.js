import React, { useEffect, useState } from 'react';
import './AddNewMarketPair.scss';
import BackIcon from '../../assets/previous-cyan.svg';
import CloseIcon from '../../assets/close-cyan.svg';
import NextIcon from '../../assets/next-black.svg';
import Select from 'react-select';
import { DropdownData } from './DropdownData';
import AddNewMarketPairHeader from './Header';
import CapxSelect from '../../components/CapxSelect/CapxSelect';

function AddNewMarketPair() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTokenA, setSelectedTokenA] = useState(null);
  const [selectedTokenB, setSelectedTokenB] = useState(null);
  const [tokenInputValue, setTokenInputValue] = useState(null);
  const [dropdownData, setDropdownData] = useState(DropdownData);
  useEffect(() => {
    verifyInput();
  }, [tokenInputValue]);
  const verifyInput = () => {
    if (tokenInputValue === null) {
      return false;
    } else if (tokenInputValue?.length < 42) {
      return false;
    } else {
      verifyAddress(tokenInputValue);
    }
  };
  const verifyAddress = (address) => {
    setTimeout(() => {
      setDropdownData([
        {
          value: 5,
          text: 'CAPX',
          icon: (
            <svg
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle cx='11' cy='10.9995' r='11' fill='white' />
              <circle cx='11' cy='11.0425' r='10' fill='#7CC1D7' />
              <circle
                cx='11'
                cy='11.0425'
                r='10'
                fill='url(#paint0_linear_1989_38862)'
              />
              <path
                opacity='0.8'
                d='M12.7605 11.7643L11.0927 15.0425L9.41967 11.7588L8.68311 13.1684L10.1562 16.0533C10.1983 16.1298 10.2352 16.2063 10.2772 16.2828L10.3456 16.4194C10.3614 16.4467 10.3719 16.474 10.3877 16.4959C10.4298 16.5778 10.4666 16.6543 10.514 16.709C10.6455 16.8729 10.8612 16.9767 11.0822 16.9767C11.1296 16.9767 11.1769 16.9712 11.2243 16.9658C11.319 16.9494 11.4084 16.9111 11.5031 16.8565C11.5662 16.8182 11.6241 16.7581 11.6925 16.6489C11.8346 16.4412 11.945 16.2172 12.066 15.9823L12.1344 15.8457L13.5023 13.163L12.7605 11.7643Z'
                fill='white'
              />
              <path
                opacity='0.8'
                d='M9.02906 10.9927L6.40899 5.84035H6.40373L6.29325 5.63819C6.26168 5.57809 6.21959 5.52891 6.15646 5.47427C6.01967 5.37046 5.86709 5.32129 5.68295 5.32129C5.49355 5.32129 5.34624 5.37046 5.20945 5.4852C5.07266 5.59448 5.00952 5.72014 5.00952 5.87313C5.00952 5.96601 5.03057 6.04797 5.07792 6.12446L5.08318 6.13539L8.26093 12.3477L9.02906 10.9927Z'
                fill='white'
              />
              <path
                opacity='0.8'
                d='M16.9485 5.48471C16.8117 5.37544 16.6591 5.3208 16.475 5.3208C16.2856 5.3208 16.1383 5.36997 16.0067 5.47925C15.912 5.55028 15.8594 5.62677 15.8331 5.71419L15.8278 5.73605L13.1499 10.9977L13.918 12.3472L17.0747 6.14037L17.1116 6.04202C17.1326 5.98738 17.1431 5.93274 17.1431 5.86718C17.1484 5.71966 17.0853 5.59399 16.9485 5.48471Z'
                fill='white'
              />
              <path
                d='M11.0767 5.32129C11.2976 5.32129 11.5133 5.41964 11.6449 5.58901C11.6922 5.64911 11.729 5.72561 11.7711 5.8021C11.7817 5.82942 11.7974 5.85674 11.8132 5.87859L11.8816 6.01519C11.9237 6.09168 11.9605 6.16817 12.0026 6.24467L17.0639 16.1669L17.0691 16.1778C17.1165 16.2543 17.1375 16.3362 17.1375 16.4291C17.1375 16.5821 17.0744 16.7078 16.9376 16.8116C16.8008 16.9209 16.6483 16.9755 16.4641 16.9755C16.28 16.9755 16.1274 16.9263 15.9906 16.817C15.9327 16.7624 15.8854 16.7078 15.8538 16.6531L15.7433 16.451H15.7381L11.0556 7.26093L6.32056 16.5603L6.31529 16.5821C6.28899 16.6641 6.23112 16.7406 6.14168 16.817C6.01015 16.9263 5.86283 16.9755 5.67343 16.9755C5.48403 16.9755 5.33672 16.9263 5.19992 16.8116C5.06313 16.7023 5 16.5766 5 16.4291C5 16.3636 5.01052 16.3035 5.03157 16.2543L5.0684 16.1559L10.0086 6.45229L10.077 6.31569C10.198 6.08075 10.3085 5.85674 10.4506 5.64911C10.519 5.5453 10.5768 5.4852 10.64 5.44149C10.7347 5.38139 10.8294 5.34314 10.9188 5.33222C10.982 5.32675 11.0293 5.32129 11.0767 5.32129Z'
                fill='white'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_1989_38862'
                  x1='11'
                  y1='23.5425'
                  x2='11'
                  y2='0.328195'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#1E4047' />
                  <stop offset='1' stop-opacity='0' />
                </linearGradient>
              </defs>
            </svg>
          ),
        },
        ...dropdownData,
      ]);
      setTokenInputValue('');
    }, 300);
  };
  const placeholderComponent = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg
        width='24'
        height='25'
        viewBox='0 0 24 25'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='12' cy='12.5' r='12' fill='#A0B2F8' />
        <circle cx='12' cy='12.5' r='9' fill='#8162F4' />
        <circle cx='12' cy='12.5' r='9' fill='url(#paint0_linear_1989_38464)' />
        <defs>
          <linearGradient
            id='paint0_linear_1989_38464'
            x1='12'
            y1='23.75'
            x2='12'
            y2='2.85714'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#301E47' />
            <stop offset='1' stop-opacity='0' />
          </linearGradient>
        </defs>
      </svg>
      <span style={{ marginLeft: 5 }}>Select Token</span>
    </div>
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#151517',
      boxShadow: state.isFocused ? 0 : 0,
      borderColor: state.isFocused ? '#46beed' : '#4A6269',
      '&:hover': {
        borderColor: state.isFocused ? '#46beed' : '#4A6269',
      },
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: isFocused ? '#2A383C' : '#151517',
      color: '#F1FAF2',
    }),
    menuList: (provided, state) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#F1FAF2',
      alignItems: 'start',
      marginLeft: '0px',
      textAlign: 'left',
    }),
  };

  const handleChange = (e) => {
    setSelectedOption(e);
  };
  const handleChangeA = (e) => {
    setSelectedTokenA(e);
  };
  const handleChangeB = (e) => {
    setSelectedTokenB(e);
  };
  const handleInputChange = (inputValue) => {
    setTokenInputValue(inputValue);
  };
  return (
    <div className='addNewMarketPairScreen'>
      <div className='addNewMarketPairScreen_maincontainer'>
        <AddNewMarketPairHeader />
        <div className='addNewMarketPairScreen_maincontainer_body'>
          <div className='addNewMarketPairScreen_maincontainer_body_title'>
            Add New Market Pair
          </div>
          <div className='addNewMarketPairScreen_maincontainer_body_innercontainer'>
            <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_box'>
              <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_box_title'>
                SELECT TOKEN A
              </div>
              <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_box_value'>
                <CapxSelect
                  selectedValue={selectedTokenA}
                  dropdownData={dropdownData}
                  tokenInputValue={tokenInputValue}
                  handleChange={handleChangeA}
                  handleInputChange={handleInputChange}
                  placeholderText={'Select or enter Contract Address'}
                />
              </div>
            </div>
            <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_box'>
              <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_box_title'>
                SELECT TOKEN B
              </div>
              <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_box_value'>
                <CapxSelect
                  selectedValue={selectedTokenB}
                  dropdownData={dropdownData}
                  tokenInputValue={tokenInputValue}
                  handleChange={handleChangeB}
                  placeholderComponent={placeholderComponent}
                />
              </div>
            </div>
            <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_button'>
              <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_button_title'>
                ADD PAIR
              </div>
              <div className='addNewMarketPairScreen_maincontainer_body_innercontainer_button_logo'>
                <img src={NextIcon} alt='next icon' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewMarketPair;
