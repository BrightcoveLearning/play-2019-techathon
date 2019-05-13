import React, { Component } from 'react';
import './BrightcovePlayer.css';
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      playerRef: null
    };

    this.success = this.success.bind(this);
  }

  success ({ ref }) {
    this.setState({
      playerRef: ref
    });
    this.loadSelectedVideo(ref);
  }

  loadSelectedVideo (playerRef) {
    const { selectedVideo } = this.props;

    if (selectedVideo !== null) {
      playerRef.catalog.get({
        type: 'video',
        id: selectedVideo
      }).then(playerRef.catalog.load);
    }
  }

  shouldComponentUpdate (nextProps) {
    return this.props.selectedVideo !== nextProps.selectedVideo ||
      this.props.videoSecondsViewed !== nextProps.videoSecondsViewed;
  }

  componentDidUpdate (prevProps) {
    this.loadSelectedVideo(this.state.playerRef);
  }

  render () {
    const options = {
      controls: true,
      fluid: true
    };

    if (this.props.videoSecondsViewed) {
      options.plugins = {
        techAThonProjPluginSolution: {
          videoSecondsViewed: this.props.videoSecondsViewed
        }
      };
    }

    return (
      <Player
        attrs={{ id: 'videoPlayer' }}
        accountId='6027103981001'
        playerId='default'
        onSuccess={this.success}
        options={options}
        embedOptions={{
          unminified: true
        }}
      />
    );
  }
}

export default BrightcovePlayer;
