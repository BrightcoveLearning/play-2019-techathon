import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    if (this.props.selectedVideo !== null) {
      playerRef.catalog.get({
        type: 'video',
        id: this.props.selectedVideo
      }).then(playerRef.catalog.load);
    }
  }

  shouldComponentUpdate (nextProps) {
    return this.props.selectedVideo !== nextProps.selectedVideo;
  }

  componentDidUpdate (prevProps) {
    this.loadSelectedVideo(this.state.playerRef);
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

BrightcovePlayer.propTypes = {
  selectedVideo: PropTypes.string
}

export default BrightcovePlayer;
