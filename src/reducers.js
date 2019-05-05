/** see https://redux-docs.netlify.com/basics/reducers */
import { combineReducers } from 'redux'
import * as actions from './actions';

const remoteUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.REQUEST_SOURCE_FILE_UPLOAD:
      return Object.assign({}, state, {
        accountId: action.accountId,
        videoId: action.videoId,
        videoName: action.videoName
      });
    case actions.RECEIVE_SOURCE_FILE_UPLOAD:
      return Object.assign({}, state, action.remoteUploadInfo);
    default:
      return state;
  }
};

const s3UploadReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.REQUEST_UPLOAD_TO_S3:
      return Object.assign({}, state, {
        s3SignedUrl: action.s3SignedUrl,
        videoData: action.videoData,
        uploaded: false
      });
    case actions.RECEIVE_UPLOAD_TO_S3:
      return Object.assign({}, state, {
        uploaded: true
      });
    default:
      return state;
  }
};

const ingestByJobId = (currentIngest, jobId, update) => {
  if (currentIngest.jobId !== jobId) {
    return currentIngest;
  }

  return Object.assign({}, currentIngest, update);
};

const ingestJobReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.REQUEST_VIDEO_INGEST:
      return Object.assign({}, state, {
        ingestUrl: action.ingestUrl
      });
    case actions.RECEIVE_VIDEO_INGEST:
      return Object.assign({}, state, {
        jobId: action.ingestJobId
      });
    case actions.REQUEST_INGEST_STATUS:
      return ingestByJobId(state, action.jobId, {
        status: null
      });
    case actions.RECEIVE_INGEST_STATUS:
      return ingestByJobId(state, action.jobId, {
        status: action.ingestJobStatus
      });
    default:
      return state;
  }
};

const baseReducer = (state = {
  accountId: 6027103981001,
  videos: [],
  selectedVideo: null,
  analyticData: null
}, action) => {
  // This can be used to debug action flow
  // if (actions[action.type]) {
  //   console.debug(action.type);
  // }

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
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  base: baseReducer,
  currentRemoteUpload: remoteUploadReducer,
  currentS3Upload: s3UploadReducer,
  currentIngest: ingestJobReducer
});

export default rootReducer;
