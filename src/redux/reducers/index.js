import { combineReducers } from 'redux';
import exchangeReducer from './exchange';
import sideNavReducer from './sideNav';
import withdrawReducer from './withdraw';

const rootReducer = combineReducers({
  sideNav: sideNavReducer,
  exchange : exchangeReducer,
  withdraw : withdrawReducer
});

export default rootReducer;