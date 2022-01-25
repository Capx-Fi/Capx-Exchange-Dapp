import {
  SET_BUY_TICKER,
  SET_PROJECT_BUY_TICKER,
  SET_EXCHANGE_BUY,
  SET_EXCHANGE_SELL,
  SET_SELL_TICKER,
  SET_TICKER_BALANCE,
} from './types';

export const setExchangeBuy = () => {
  return function (dispatch) {
    dispatch({
      type: SET_EXCHANGE_BUY,
    });
  };
};

export const setExchangeSell = () => {
  return function (dispatch) {
    dispatch({
      type: SET_EXCHANGE_SELL,
    });
  };
};

export const setBuyTicker = (buyTicker) => {
  return function (dispatch) {
    dispatch({
      type: SET_BUY_TICKER,
      payload: buyTicker,
    });
  };
};
export const setProjectBuyTicker = (buyTicker) => {
  return function (dispatch) {
    dispatch({
      type: SET_PROJECT_BUY_TICKER,
      payload: buyTicker,
    });
  };
};

export const setTickerBalance = (tickerBalance) => {
  return function (dispatch) {
    dispatch({
      type: SET_TICKER_BALANCE,
      payload: tickerBalance,
    });
  };
};

export const setSellTicker = (sellTicker) => {
  return function (dispatch) {
    dispatch({
      type: SET_SELL_TICKER,
      payload: sellTicker,
    });
  };
};
