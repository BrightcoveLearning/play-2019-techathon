/** see https://redux-docs.netlify.com/basics/reducers */
import * as actions from './actions';

const initialState = {
  accountId: 6027103981001,
  videos: [],
  selectedVideo: null,
  analyticData: null
};

const rootReducer = (state = initialState, action) => {
  let ingestJobId;
  let updatedIngest;

  switch (action.type) {
    case actions.REQUEST_VIDEO_LIST:
      return Object.assign({}, state, {
        accountId: action.accountId
      });
    case actions.RECEIVE_VIDEO_LIST:
      return Object.assign({}, state, {
        videos: action.videos
      });
    case actions.RECEIVE_SELECTED_VIDEO:
      return Object.assign({}, state, {
        selectedVideo: action.selectedVideo
      });
    case actions.RECEIVE_VIDEO_ANALYTICS:
      return Object.assign({}, state, {
        analyticData: action.analyticData
      });
    case actions.REQUEST_VIDEO_CREATE:
      return Object.assign({}, state, {
        uploadVideoInfo: {
          name: action.videoName,
          type: action.mimeType,
          size: action.fileSize
        }
      });
    case actions.RECEIVE_VIDEO_CREATE:
      return Object.assign({}, state, {
        createdVideoInfo: action.createdVideoData
      });
    case actions.REQUEST_SOURCE_FILE_UPLOAD:
      return Object.assign({}, state, {
        currentRemoteUpload: {
          accountId: action.accountId,
          videoId: action.videoId,
          videoName: action.videoName
        }
      });
    case actions.RECEIVE_SOURCE_FILE_UPLOAD:
      const updatedRemoteUpload = Object.assign({}, state.currentRemoteUpload, {
        data: action.remoteUploadInfo
      });

      return Object.assign({}, state, {
        currentRemoteUpload: updatedRemoteUpload
      });
    case actions.REQUEST_UPLOAD_TO_S3:
      return Object.assign({}, state, {
        currentS3Upload: {
          s3SignedUrl: action.s3SignedUrl,
          videoData: action.videoData,
          uploaded: false
        }
      });
    case actions.RECEIVE_UPLOAD_TO_S3:
      const updatedS3Upload = Object.assign({}, state.currentS3Upload, {
        uploaded: true
      });

      return Object.assign({}, state, {
        currentS3Upload: updatedS3Upload
      });
    case actions.REQUEST_VIDEO_INGEST:
      return Object.assign({}, state, {
        currentIngest: {
          ingestUrl: action.ingestUrl
        }
      });
    case actions.RECEIVE_VIDEO_INGEST:
      updatedIngest = Object.assign({}, state.currentIngest, {
        ingestJobId: action.ingestJobId
      });

      return Object.assign({}, state, {
        currentIngest: updatedIngest
      });
    case actions.REQUEST_INGEST_STATUS:
      ingestJobId = action.ingestJobId;

      if (state.currentIngest.ingestJobId !== ingestJobId) {
        return state;
      }

      updatedIngest = Object.assign({}, state.currentIngest, {
        status: null
      });

      return Object.assign({}, state, {
        currentIngest: updatedIngest
      });
    case actions.RECEIVE_INGEST_STATUS:
      ingestJobId = action.ingestJobId;

      if (state.currentIngest.ingestJobId !== ingestJobId) {
        return state;
      }

      updatedIngest = Object.assign({}, state.currentIngest, {
        status: action.ingestJobStatus
      });

      return Object.assign({}, state, {
        currentIngest: updatedIngest
      });
    default:
      return state;
  }
};

export default rootReducer;
