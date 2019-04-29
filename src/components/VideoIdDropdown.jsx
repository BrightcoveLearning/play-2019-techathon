/**
 * A Container Component that renders a dropdown based on
 * the videos in the store.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchVideoList
} from '../actions';

class VideoIdDropdown extends Component {
  constructor(props, context) {
    super(props, context);

    this.getVideoList = this.getVideoList.bind(this);
  }

  render() {
    const { videos } = this.props;

    return (
      <div>
        VideoIdDropdown
        <p>
          {videos.join(', ')}
        </p>
        <button onClick={this.getVideoList}>
          Get videos
        </button>
      </div>
    );
  }

  getVideoList() {
    const { dispatch } = this.props;

    dispatch(fetchVideoList());
  }
};

/**
 * see https://redux-docs.netlify.com/basics/usage-with-react#implementing-container-components
 */
const mapStateToProps = (state) => {
  const videoIds = state.videos.map((e) => e.id);

  return {
    videos: videoIds
  };
}

// mapDispatchToProps

export default connect(mapStateToProps)(VideoIdDropdown);
