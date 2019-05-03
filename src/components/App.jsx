import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';
import AnalyticsFetcher from './AnalyticsFetcher';
import BrightcovePlayer from './BrightcovePlayer';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <VideoIdDropdown />
        <BrightcovePlayer />
        <AnalyticsFetcher />
      </div>
    </Provider>
  );
}
