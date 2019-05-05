import React, { Component } from 'react';
import makeApiCall, { makeS3Call } from '../oauthUtils';
import './VideoUploader.css';
import IngestJobStatus from './IngestJobStatus';

class VideoUploader extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleFileChange = this.handleFileChange.bind(this);
    this.submitVideoForUpload = this.submitVideoForUpload.bind(this);
    this.handleReaderLoad = this.handleReaderLoad.bind(this);

    this.state = {
      accountId: 6027103981001,
      videoName: '',
      videoData: null,
      videoSize: 0,
      videoType: null,
      sentUpload: false,
      uploaded: false,
      ingestJobId: null
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
    const { accountId, videoName, videoData } = this.state;

    if (!videoName) {
      console.log('A local video file must be selected');
      return;
    }

    this.setState({
      sentUpload: true
    });

    return this.createVideo(accountId, videoName, videoData);
  }

  createVideo (accountId, name, videoData) {
    const apiCall = `https://cms.api.brightcove.com/v1/accounts/6027103981001/videos`;
    const method = 'POST';
    const options = {
      name
    };

    return makeApiCall(apiCall, method, options)
      .then((data) => {
        this.setState({
          videoId: data.id
        });

        return this.getSourceFileUploadLocation(accountId, data.id, name, videoData);
      });
  }

  getSourceFileUploadLocation (accountId, videoId, videoName, videoFile) {
    const apiCall = `https://ingest.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/upload-urls/${videoName}`;
    const method = 'GET';

    return makeApiCall(apiCall, method)
      .then((data) => {
        return this.uploadFile(accountId, videoId, data, videoFile);
      });
  }

  uploadFile (accountId, videoId, remoteUploadInfo, videoFile) {
    const signedUrl = remoteUploadInfo.signed_url;
    const ingestUrl = remoteUploadInfo.api_request_url;
    const options = {
      method: 'PUT',
      body: videoFile
    };

    return makeS3Call(signedUrl, options)
      .then(
        (response) => {
          this.setState({
            uploaded: true
          });

          return this.postVideoIngest(accountId, videoId, ingestUrl);
        },

        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => {
          console.error('ERROR', error);
          this.setState({
            uploaded: false
          });
        }
      );
  }

  postVideoIngest (accountId, videoId, ingestUrl) {
    const apiCall = `https://ingest.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/ingest-requests`;
    const method = 'POST';
    const options = {
      master: {
        url: ingestUrl
      }
    };

    return makeApiCall(apiCall, method, options)
      .then((data) => {
        this.setState({
          ingestJobId: data.id
        })
      });
  }

  render () {
    const { accountId, videoName, videoId, sentUpload, ingestJobId } = this.state;

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
              value={videoName}
            />
          </label>
        </p>
        <button
          type='submit'
          onClick={this.submitVideoForUpload}
        >
          Upload Video
        </button>
        {
          sentUpload &&
          <IngestJobStatus
            accountId={accountId}
            videoId={videoId}
            ingestJobId={ingestJobId}
          />
        }
      </div>
    );
  }
}

export default VideoUploader;
