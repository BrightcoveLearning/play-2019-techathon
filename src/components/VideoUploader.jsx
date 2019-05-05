import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  createVideo
} from '../actions';

class VideoUploader extends Component {
  constructor (props, context) {
    super(props, context);

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

  renderIngestJobStatus () {
    const { sentUpload } = this.state;

    if (!sentUpload) {
      return null;
    }

    const { ingestJob } = this.props;
    let jobState;
    let errorMsg;

    if (ingestJob && ingestJob.status) {
      jobState = `status: ${ingestJob.status.state}`;
      errorMsg = ingestJob.status.error_message
        ? `error: ${ingestJob.status.error_message}`
        : '';
    }

    return (
      <div>
        ingestJobStatus
        {
          ingestJob && ingestJob.status &&
          <div>
            <p>
              {jobState}
            </p>
            <p>
              {errorMsg}
            </p>
          </div>
        }
      </div>
    );
  }

  render () {
    return (
      <div>
        <p>VideoUploader</p>
        <p>
          <input
            id='video-selector'
            type='file'
            onChange={this.handleFileChange}
          />
        </p>
        <p>
          <label>
            Provide a name for the video to upload:
            <input
              type='text'
              placeholder='video name'
              onChange={(e) => this.setState({ videoName: e.target.value })}
              value={this.state.videoName}
            />
          </label>
        </p>
        <button
          type='submit'
          onClick={this.submitVideoForUpload}
        >
          Upload Video
        </button>
        {this.renderIngestJobStatus()}
      </div>
    );
  }
}

/**
 * see https://redux-docs.netlify.com/basics/usage-with-react#implementing-container-components
 */
const mapStateToProps = state => ({
  accountId: state.accountId,
  ingestJob: state.currentIngest
});

export default connect(mapStateToProps)(VideoUploader);
