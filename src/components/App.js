import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <header className="App-header">
        <VideoIdDropdown />
      </header>
    </div>
    </Provider>
  );
};
