import {
  SET_BUY_TICKER,
  SET_EXCHANGE_BUY,
  SET_EXCHANGE_SELL,
  SET_SELL_TICKER,
} from '../actions/types';

const initState = {
  exchangeMode: 'buy',
  buyTicker: null,
  sellTicker: null,
};

const exchangeReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_EXCHANGE_BUY:
      return {
        ...state,
        exchangeMode: 'buy',
        sellTicker: null,
      };

    case SET_BUY_TICKER:
      return {
        ...state,
        buyTicker: action.payload,
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
      };

    default:
      return state;
  }
};

export default exchangeReducer;
