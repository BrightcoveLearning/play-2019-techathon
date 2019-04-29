import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { rootReducer } from './reducers';

const rootElement = document.getElementById('root');
const store = createStore(
  rootReducer,
  // lets us dispatch functions
  applyMiddleware(thunkMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
