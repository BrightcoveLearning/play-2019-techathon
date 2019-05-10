import React, { Component } from 'react';
import './BrightcovePlayer.css';
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {
  success = ({ ref }) => {
    this.playerRef = ref;
    this.loadSelectedVideo();
  };

  loadSelectedVideo() {
    if (this.props.selectedVideo !== null) {
      this.playerRef.catalog.get({
        type: 'video',
        id: this.props.selectedVideo
      }).then(this.playerRef.catalog.load);
    }
  }

  shouldComponentUpdate (nextProps) {
    return this.props.selectedVideo !== nextProps.selectedVideo;
  }

  componentDidUpdate (prevProps) {
    this.loadSelectedVideo();
  }

  render () {
    return (
      <Player
        attrs={{ id: 'videoPlayer' }}
        accountId='6027103981001'
        playerId='default'
        onSuccess={this.success}
        options={{
          controls: true,
          fluid: true
        }}
        embedOptions={{
          unminified: true
        }}
      />
    );
  }
}

export default BrightcovePlayer;
