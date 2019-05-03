/** see https://redux-docs.netlify.com/basics/actions */
import makeApiCall from './oauthUtils';

/** Action Types */
export const REQUEST_VIDEO_LIST = 'REQUEST_VIDEO_LIST';
export const RECEIVE_VIDEO_LIST = 'RECEIVE_VIDEO_LIST';
export const RECEIVE_SELECTED_VIDEO = 'RECEIVE_SELECTED_VIDEO';
export const RECEIVE_VIDEO_ANALYTICS = 'RECEIVE_VIDEO_ANALYTICS';

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

export function updateSelectedVideo(video) {
    return {
        type: RECEIVE_SELECTED_VIDEO,
        selectedVideo: video
    }
}

export function updateVideoAnalytics(data) {
    return {
        type: RECEIVE_VIDEO_ANALYTICS,
        analyticData: data
    }
}

/**
 * see https://redux-docs.netlify.com/advanced/async-actions#async-action-creators
 */
export function fetchVideoList(accountId) {
    return function (dispatch) {
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

export function getAnalyticsForVideo(video) {
    return function (dispatch) {

        let apiCall = `https://analytics.api.brightcove.com/v1/data?accounts=6027103981001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed&video=${video}`;
        let method = 'GET';

        makeApiCall(apiCall, method)
            .then(response => {
                console.log('Success:', JSON.stringify(response));

                dispatch(updateVideoAnalytics(response));
            })
            .catch(error => console.error('Error:', error));
    }
}