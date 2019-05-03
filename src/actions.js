/** see https://redux-docs.netlify.com/basics/actions */
import makeApiCall from './oauthUtils';

/**
 * see https://redux-docs.netlify.com/advanced/async-actions#async-action-creators
 */
export function fetchVideoList (accountId) {
  return function (dispatch) {
    // dispatches action to app that the video list
    // is being requested
    dispatch(requestVideoList(accountId));

    // call to CMS API for video information
    return makeApiCall(
      'https://cms.api.brightcove.com/v1/accounts/6027103981001/videos',
      'GET',
    ).then(json => dispatch(receiveVideoList(accountId, json)));
  };
}

export function getAnalyticsForVideo (video) {
  return function (dispatch) {
    const apiCall = `https://analytics.api.brightcove.com/v1/data?accounts=6027103981001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed&video=${video}`;
    const method = 'GET';

    makeApiCall(apiCall, method)
      .then((response) => {
        console.log('Success:', JSON.stringify(response));

        dispatch(updateVideoAnalytics(response));
      })
      .catch(error => console.error('Error:', error));
  };
}
