import { SET_ASSET_BALANCE, SET_WITHDRAW, SET_WITHDRAW_TICKER,  } from "./types";


export const setWithdraw = () => {
  return function (dispatch) {
    dispatch({
      type: SET_WITHDRAW,
    });
  };
};

export const setWithdrawTicker = (withdrawTicker) => {
  return function (dispatch) {
    dispatch({
      type: SET_WITHDRAW_TICKER,
      payload: withdrawTicker,
    });
  };
};

export const setAssetBalance = (assetBalance) => {
  return function (dispatch) {
    dispatch({
      type: SET_ASSET_BALANCE,
      payload: assetBalance,
    });
  };
};