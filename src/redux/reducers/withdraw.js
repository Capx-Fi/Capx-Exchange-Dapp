import {
  SET_WITHDRAW,
  SET_WITHDRAW_TICKER,
  SET_ASSET_BALANCE,

} from "../actions/types";

const initState = {
  exchangeMode: "withdraw",
  withdrawTicker: null,
  assetBalance: null
};

const withdrawReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_WITHDRAW:
      return {
        ...state,
        exchangeMode: "withdraw",
        assetBalance: null,
      };

    case SET_WITHDRAW_TICKER:
      return {
        ...state,
        withdrawTicker: action.payload,
      };
    case SET_ASSET_BALANCE:
      return {
        ...state,
        assetBalance: action.payload,
      };

    default:
      return state;
  }
};

export default withdrawReducer;
