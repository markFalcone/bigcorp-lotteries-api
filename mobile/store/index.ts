import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';

// add a type for the store to the root state
const store: Store<RootState> = createStore(
  rootReducer,
  applyMiddleware(thunk, logger),
);

export default store;
