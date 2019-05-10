import React, { Component } from 'react';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';
import AnalyticsFetcher from './AnalyticsFetcher';
import BrightcovePlayer from './BrightcovePlayer';
import VideoUploader from './VideoUploader';

export default class App extends Component {
  constructor (props) {
    super(props);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.state = {
      selectedVideo: null
    };
  }

  handleVideoChange (video) {
    this.setState({ selectedVideo: video });
  }

  render () {
    return (
      <div className='App'>
        <VideoIdDropdown onHandleVideoChange={this.handleVideoChange} />
        <BrightcovePlayer selectedVideo={this.state.selectedVideo} />
        <AnalyticsFetcher selectedVideo={this.state.selectedVideo} />
        <VideoUploader />
      </div>
    );
  }
}
