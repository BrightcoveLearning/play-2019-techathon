/** see https://redux-docs.netlify.com/basics/actions */
import makeApiCall from './oauthUtils';

/** Action Types */
export const REQUEST_VIDEO_LIST = 'REQUEST_VIDEO_LIST';
export const RECEIVE_VIDEO_LIST = 'RECEIVE_VIDEO_LIST';

/** Action Creators */

export function requestVideoList(accountId = '6027103981001') {
  return {
    type: REQUEST_VIDEO_LIST,
    accountId
  };
};

export function receiveVideoList(accountId = '6027103981001', data) {
  return {
    type: RECEIVE_VIDEO_LIST,
    accountId,
    videos: data,
    receivedAt: Date.now()
  };
};

/**
 * see https://redux-docs.netlify.com/advanced/async-actions#async-action-creators
 */
export function fetchVideoList(accountId) {
  return function(dispatch) {
    // dispatches action to app that the video list
    // is being requested
    dispatch(requestVideoList(accountId));

    // call to CMS API for video information
    return makeApiCall(
      `https://cms.api.brightcove.com/v1/accounts/6027103981001/videos`,
      'GET'
    )
    .then((json) => {
      // dispatches action to app that the video list
      // has returned. This will then be made available
      // to the store by our reducer
      return dispatch(receiveVideoList(accountId, json))
    });
  }
};
