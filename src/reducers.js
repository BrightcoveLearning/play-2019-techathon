/** see https://redux-docs.netlify.com/basics/reducers */
import * as actions from './actions';

const initialState = {
  accountId: 6027103981001,
  videos: []
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
    default:
      return state;
  }
};

export {
  rootReducer
};
