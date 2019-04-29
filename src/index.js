import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './reducers';
import listVideosByAccountAction from './actions';

const store = createStore(rootReducer);
const rootElement = document.getElementById('root');

console.log('initial state', store.getState());

const unsubscribe = store.subscribe(() => console.log(store.getState()));

store.dispatch(listVideosByAccountAction([
    {
      "id": "6029594036001",
      "account_id": "6027103981001",
      "ad_keys": null,
      "clip_source_video_id": null,
      "complete": true,
      "created_at": "2019-04-24T20:29:37.624Z",
      "created_by": {
        "type": "user",
        "id": "76076156632",
        "email": "playtechathon@brightcove.com"
      }
    }
  ]
));

unsubscribe();

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
