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
    default:
      return state;
  }
};

export default rootReducer;
