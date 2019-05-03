import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  requestVideoCreate,
  createVideo
} from '../actions';

class VideoUploader extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleFileChange = this.handleFileChange.bind(this);
    this.submitVideoForUpload = this.submitVideoForUpload.bind(this);
    this.handleReaderLoad = this.handleReaderLoad.bind(this);

    this.state = {
      createdVideoInfo: null,
      videoName: ''
    };
  }

  componentDidMount () {
    this.fileReader = new FileReader();
  }

  handleReaderLoad (name, size, type) {
    const { accountId, dispatch } = this.props;

    return (event) => {
      this.setState({
        videoName: name,
        videoData: event.target.result
      });

      return dispatch(requestVideoCreate(accountId, name, size, type));
    }
  }

  handleFileChange () {
    const videoSelector = document.getElementById('video-selector');
    const files = videoSelector.files;

    if (files.length < 1) {
      return;
    }

    const { name, size, type } = videoSelector.files[0];

    this.fileReader.readAsArrayBuffer(videoSelector.files[0]);
    this.fileReader.onload = this.handleReaderLoad(name, size, type);
  }

  submitVideoForUpload () {
    const { accountId, dispatch, uploadVideoInfo } = this.props;

    if (!uploadVideoInfo) {
      console.log('A local video file must be selected');
      return;
    }

    return dispatch(createVideo(accountId, uploadVideoInfo.name, this.state.videoData));
  }

  render () {
    const { ingestJobStatus } = this.props;

    return (
      <div>
        <p>VideoUploader</p>
        <p>
          <label>
            Provide a name for the video to upload:
            <input
              type='text'
              placeholder='video name'
            />
          </label>
        </p>
        <p>
          <input
            id='video-selector'
            type='file'
            onChange={this.handleFileChange}
          />
        </p>
        <button
          type='submit'
          onClick={this.submitVideoForUpload}
        >
          Upload Video
        </button>
        {
          ingestJobStatus &&
          <div>
            ingestJobStatus
            <p>
              {`status: ${ingestJobStatus.state}`}
            </p>
            <p>
              {`error: ${ingestJobStatus.error_message || ''}`}
            </p>
          </div>
        }
      </div>
    );
  }
}

/**
 * see https://redux-docs.netlify.com/basics/usage-with-react#implementing-container-components
 */
const mapStateToProps = state => ({
  accountId: state.accountId,
  uploadVideoInfo: state.uploadVideoInfo,
  createdVideo: state.createdVideoInfo,
  remoteUploadInfo: state.remoteUploadInfo,
  ingestJobStatus: state.ingestJobStatus
});

export default connect(mapStateToProps)(VideoUploader);
