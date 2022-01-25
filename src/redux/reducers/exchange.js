import {
  SET_BUY_TICKER,
  SET_PROJECT_BUY_TICKER,
  SET_EXCHANGE_BUY,
  SET_EXCHANGE_SELL,
  SET_SELL_TICKER,
  SET_TICKER_BALANCE,
} from '../actions/types';

const initState = {
  exchangeMode: 'buy',
  buyTicker: null,
  projectBuyTicker: null,
  sellTicker: null,
  tickerBalance: null,
};

const exchangeReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_EXCHANGE_BUY:
      return {
        ...state,
        exchangeMode: 'buy',
        sellTicker: null,
        tickerBalance: null,
      };

    case SET_BUY_TICKER:
      return {
        ...state,
        buyTicker: action.payload,
      };
    
    case SET_PROJECT_BUY_TICKER:
      return {
        ...state,
        projectBuyTicker: action.payload,
      };
    case SET_TICKER_BALANCE:
      return {
        ...state,
        tickerBalance: action.payload,
      };

    case SET_SELL_TICKER:
      return {
        ...state,
        sellTicker: action.payload,
      };
    case SET_EXCHANGE_SELL:
      return {
        ...state,
        exchangeMode: 'sell',
        buyTicker: null,
        tickerBalance: null,
      };

    default:
      return state;
  }
};

export default exchangeReducer;
