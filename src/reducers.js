/** see https://redux-docs.netlify.com/basics/reducers */
import * as actions from './actions';

const initialState = {
  accountId: 6027103981001,
  videos: [],
  selectedVideo: null,
  analyticData: null
};

const rootReducer = (state = initialState, action) => {
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
    case actions.RECEIVE_SOURCE_FILE_UPLOAD:
      return Object.assign({}, state, {
        remoteUploadInfo: action.remoteUploadInfo
      });
    case actions.RECEIVE_VIDEO_INGEST:
      return Object.assign({}, state, {
        ingestJobId: action.ingestJobId
      });
    case actions.RECEIVE_INGEST_STATUS:
      return Object.assign({}, state, {
        ingestJobStatus: action.ingestJobStatus
      });
    default:
      return state;
  }
};

export default rootReducer;
