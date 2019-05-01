import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';
import AnalyticsFetcher from './analytics-fetcher';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <VideoIdDropdown />
        <AnalyticsFetcher />
      </div>
    </Provider>
  );
};
