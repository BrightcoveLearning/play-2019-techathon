/** see https://redux-docs.netlify.com/basics/actions */
import fetch from 'cross-fetch'

const oAuthProxyUrl = 'http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds';

/** Action Types */
export const REQUEST_VIDEO_LIST = 'REQUEST_VIDEO_LIST';
export const RECEIVE_VIDEO_LIST = 'RECEIVE_VIDEO_LIST';

/** Constants */

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

function makeApiCall(url) {
  return fetch(oAuthProxyUrl, {
    method: 'POST',
    body: JSON.stringify({
      'apiCall': url,
      'method': 'GET'
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(
    (response) => response.json(),

    // Do not use catch, because that will also catch
    // any errors in the dispatch and resulting render,
    // causing a loop of 'Unexpected batch number' errors.
    // https://github.com/facebook/react/issues/6895
    (error) => console.error('ERROR', error)
  );
}

/**
 * see https://redux-docs.netlify.com/advanced/async-actions#async-action-creators
 */
export function fetchVideoList(accountId) {
  return function(dispatch) {
    // request video list
    dispatch(requestVideoList(accountId));

    return makeApiCall(
      `https://cms.api.brightcove.com/v1/accounts/6027103981001/videos`
    )
    .then((json) => {
      return dispatch(receiveVideoList(accountId, json))
    });
  }
};
