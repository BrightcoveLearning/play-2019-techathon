/**
 * A Container Component that renders a dropdown based on
 * the videos in the store.
 */
import React, { Component } from 'react';
import makeApiCall from '../oauthUtils';

class VideoIdDropdown extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      videoIds: []
    }
    this.fetchVideoList = this.fetchVideoList.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount () {
    this.fetchVideoList();
  }

  fetchVideoList () {
    // call to CMS API for video information
    return makeApiCall(
      'https://cms.api.brightcove.com/v1/accounts/6027103981001/videos',
      'GET',
    ).then(response => this.setState({ videoIds: response.map(e => e.id) }));
  }

  handleChange (event) {
    this.props.onHandleVideoChange(event.target.value);
  };
  renderOptions () {
    const { videoIds } = this.state;

    return videoIds.map((videoId, i) => (
      <option value={videoId} key={`videoId-${i}`}>
        {videoId}
      </option>
    ));
  }
  render () {
    return (
      <div>
        <p>VideoIdDropdown</p>
        <select onChange={this.handleChange}>
          <option>SELECT VIDEO</option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}
export default VideoIdDropdown;
