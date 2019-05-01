import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers';

export default function configureStore() {
  return createStore(
    rootReducer,
    // lets us dispatch functions
    applyMiddleware(thunkMiddleware)
  );
}
