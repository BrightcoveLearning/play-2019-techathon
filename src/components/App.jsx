import React, { Component } from 'react';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';
import AnalyticsFetcher from './AnalyticsFetcher';
import BrightcovePlayer from './BrightcovePlayer';
import VideoUploader from './VideoUploader';

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedVideo: null,
      videoSecondsViewed: 0
    };

    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.onReceiveAnalytics = this.onReceiveAnalytics.bind(this);
  }

  handleVideoChange (video) {
    this.setState({
      selectedVideo: video
    });
  }

  onReceiveAnalytics (data) {
    if (data.items.length === 0) {
      return;
    }

    const item = data.items[0];

    this.setState({
      videoSecondsViewed: item.video_seconds_viewed
    });
  }

  render () {
    return (
      <div className='App'>
        <VideoIdDropdown onHandleVideoChange={this.handleVideoChange} />
        <BrightcovePlayer
          selectedVideo={this.state.selectedVideo}
          videoSecondsViewed={this.state.videoSecondsViewed}
        />
        <AnalyticsFetcher
          selectedVideo={this.state.selectedVideo}
          onReceiveData={this.onReceiveAnalytics}
        />
        <VideoUploader />
      </div>
    );
  }
}
