import * as actions from './actions';

const initialState = {
  accountId: 6027103981001,
  videos: []
};

/** see https://redux-docs.netlify.com/basics/reducers */
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LIST_VIDEOS_BY_ACCOUNT:
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
