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

  renderOptions() {
    const { videoIds } = this.props;

    return videoIds.map((videoId, i) => {
      return (
        <option value={videoId} key={`videoId-${i}`}>
          {videoId}
        </option>
      );
    });
  }

  render() {
    return (
      <div>
        <p>VideoIdDropdown</p>
        <p>
          <button onClick={this.getVideoList}>
            Get videos
          </button>
        </p>
        <select>
          {
            this.renderOptions()
          }
        </select>
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
  return {
    videoIds: state.videos.map((e) => e.id)
  };
};

export default connect(mapStateToProps)(VideoIdDropdown);
