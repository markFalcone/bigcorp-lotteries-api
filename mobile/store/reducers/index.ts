import { combineReducers } from 'redux';
import lotteryReducer from './lotteryReducer';

// combine all reducers into one root reducer
const rootReducer = combineReducers({
  lotteries: lotteryReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
