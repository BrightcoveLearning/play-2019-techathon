import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  createVideo
} from '../actions';
import './VideoUploader.css';
import IngestJobStatus from './IngestJobStatus';

class VideoUploader extends Component {
  constructor (props) {
    super(props);

    this.handleFileChange = this.handleFileChange.bind(this);
    this.submitVideoForUpload = this.submitVideoForUpload.bind(this);
    this.handleReaderLoad = this.handleReaderLoad.bind(this);

    this.state = {
      videoName: '',
      videoData: null,
      videoSize: 0,
      videoType: null,
      sentUpload: false
    };
  }

  componentDidMount () {
    this.fileReader = new FileReader();
  }

  handleReaderLoad (name, size, type) {
    return (event) => {
      this.setState({
        videoName: name,
        videoData: event.target.result,
        videoSize: size,
        videoType: type
      });
    }
  }

  handleFileChange () {
    const videoSelector = document.getElementById('video-selector');
    const files = videoSelector.files;

    if (files.length < 1) {
      return;
    }

    const { name, size, type } = videoSelector.files[0];

    this.fileReader.onload = this.handleReaderLoad(name, size, type);
    this.fileReader.readAsArrayBuffer(videoSelector.files[0]);
  }

  submitVideoForUpload () {
    const { dispatch, accountId } = this.props;
    const { videoName, videoData, videoSize, videoType } = this.state;

    if (!videoName) {
      console.log('A local video file must be selected');
      return;
    }

    this.setState({
      sentUpload: true
    });

    return dispatch(createVideo(accountId, videoName, videoData, videoSize, videoType));
  }

  render () {
    const { videoName, sentUpload } = this.state;

    return (
      <div className='video-uploader'>
        <p>VideoUploader</p>
        <label className='video-selector'>
          Select a file to upload
          <input
            id='video-selector'
            type='file'
            onChange={this.handleFileChange}
          />
        </label>

        <label>
          Provide a name for the video to upload:
          <input
            className='video-name-input'
            type='text'
            placeholder='video name'
            onChange={(e) => this.setState({ videoName: e.target.value })}
            value={videoName}
          />
        </label>
        <button
          className='video-upload-submit'
          type='submit'
          onClick={this.submitVideoForUpload}
        >
          Upload Video
        </button>
        {
          sentUpload &&
          <IngestJobStatus />
        }
      </div>
    );
  }
}

/**
 * see https://redux-docs.netlify.com/basics/usage-with-react#implementing-container-components
 */
const mapStateToProps = (state) => ({
  accountId: state.base.accountId
});

VideoUploader.propTypes = {
  dispatch: PropTypes.func,
  accountId: PropTypes.number
};

export default connect(mapStateToProps)(VideoUploader);
