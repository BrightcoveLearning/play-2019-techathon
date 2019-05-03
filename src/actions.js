/** see https://redux-docs.netlify.com/basics/actions */
import makeApiCall from './oauthUtils';
import fetch from 'cross-fetch';

/** Action Types */
export const REQUEST_VIDEO_LIST = 'REQUEST_VIDEO_LIST';
export const RECEIVE_VIDEO_LIST = 'RECEIVE_VIDEO_LIST';
export const RECEIVE_SELECTED_VIDEO = 'RECEIVE_SELECTED_VIDEO';
export const RECEIVE_VIDEO_ANALYTICS = 'RECEIVE_VIDEO_ANALYTICS';
export const REQUEST_VIDEO_CREATE = 'REQUEST_VIDEO_CREATE';
export const RECEIVE_VIDEO_CREATE = 'RECEIVE_VIDEO_CREATE';
export const REQUEST_SOURCE_FILE_UPLOAD = 'REQUEST_SOURCE_FILE_UPLOAD';
export const RECEIVE_SOURCE_FILE_UPLOAD = 'RECEIVE_SOURCE_FILE_UPLOAD';
export const REQUEST_UPLOAD_TO_S3 = 'REQUEST_UPLOAD_TO_S3';
export const RECEIVE_UPLOAD_TO_S3 = 'RECEIVE_UPLOAD_TO_S3';
export const REQUEST_VIDEO_INGEST = 'REQUEST_VIDEO_INGEST';
export const RECEIVE_VIDEO_INGEST = 'RECEIVE_VIDEO_INGEST';
export const REQUEST_INGEST_STATUS = 'REQUEST_INGEST_STATUS';
export const RECEIVE_INGEST_STATUS = 'RECEIVE_INGEST_STATUS';

/** Action Creators */

export function requestVideoList (accountId = '6027103981001') {
  return {
    type: REQUEST_VIDEO_LIST,
    accountId
  };
};

export function receiveVideoList (accountId = '6027103981001', data) {
  return {
    type: RECEIVE_VIDEO_LIST,
    accountId,
    videos: data,
    receivedAt: Date.now()
  };
};

export function updateSelectedVideo (video) {
  return {
    type: RECEIVE_SELECTED_VIDEO,
    selectedVideo: video
  };
};

export function updateVideoAnalytics (data) {
  return {
    type: RECEIVE_VIDEO_ANALYTICS,
    analyticData: data
  };
};

export function requestVideoCreate (accountId = '6027103981001', videoName, fileSize, mimeType) {
  return {
    type: REQUEST_VIDEO_CREATE,
    accountId,
    videoName,
    fileSize,
    mimeType
  };
};

export function receiveVideoCreate (data) {
  return {
    type: RECEIVE_VIDEO_CREATE,
    createdVideoData: data,
    createdVideoId: data.id
  };
};

export function requestSourceFileUpload (videoId, videoName) {
  return {
    type: REQUEST_SOURCE_FILE_UPLOAD
  };
};

export function receiveSourceFileUpload (data) {
  return {
    type: RECEIVE_SOURCE_FILE_UPLOAD,
    remoteUploadInfo: data
  };
};

export function receiveUploadToS3 (data) {
  return {
    type: RECEIVE_UPLOAD_TO_S3
  };
};

export function requestVideoIngest () {
  return {
    type: REQUEST_VIDEO_INGEST
  };
};

export function receiveVideoIngest (data) {
  return {
    type: RECEIVE_VIDEO_INGEST,
    ingestJobId: data.id
  };
};

export function requestIngestState () {
  return {
    type: REQUEST_INGEST_STATUS
  };
};

export function receiveIngestStatus (data) {
  return {
    type: RECEIVE_INGEST_STATUS,
    ingestJobStatus: data
  };
};

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
    // dispatches action to app that the video list
    // has returned. This will then be made available
    // to the store by our reducer
  };
};

export function getAnalyticsForVideo (video) {
  return function (dispatch) {
    const apiCall = `https://analytics.api.brightcove.com/v1/data?accounts=6027103981001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed&video=${video}`;
    const method = 'GET';

    return makeApiCall(apiCall, method)
      .then((response) => {
        return dispatch(updateVideoAnalytics(response));
      })
      .catch(error => console.error('Error:', error));
  };
};

export function createVideo (accountId, name, videoFile) {
  return function (dispatch) {
    const apiCall = `https://cms.api.brightcove.com/v1/accounts/6027103981001/videos`;
    const method = 'POST';
    const options = {
      name
    };

    return makeApiCall(apiCall, method, options)
      .then((data) => {
        dispatch(receiveVideoCreate(data));

        return dispatch(getSourceFileUploadLocation(accountId, data.id, name, videoFile));
      });
  };
};

export function getSourceFileUploadLocation (accountId, videoId, videoName, videoFile) {
  return function (dispatch) {
    const apiCall = `https://ingest.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/upload-urls/${videoName}`;
    const method = 'GET';

    return makeApiCall(apiCall, method)
      .then((data) => {
        dispatch(receiveSourceFileUpload(data));

        return dispatch(uploadFile(accountId, videoId, data, videoFile));
      });
  };
};

export function uploadFile (accountId, videoId, remoteUploadInfo, videoFile) {
  return function (dispatch) {
    const signedUrl = remoteUploadInfo.signed_url;
    const ingestUrl = remoteUploadInfo.api_request_url;

    const options = {
      method: 'PUT',
      body: videoFile
    };

    return fetch(signedUrl, options)
      .then(
        response => dispatch(postVideoIngest(accountId, videoId, ingestUrl)),

        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.error('ERROR', error),
      );
  };
};

export function postVideoIngest (accountId, videoId, ingestUrl) {
  return function (dispatch) {
    const apiCall = `https://ingest.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/ingest-requests`;
    const method = 'POST';
    const options = {
      master: {
        url: ingestUrl
      }
    };

    return makeApiCall(apiCall, method, options)
      .then((data) => {
        dispatch(receiveVideoIngest(data));

        return dispatch(getIngestStatus(accountId, videoId, data.id));
      });
  };
};

export function getIngestStatus (accountId, videoId, ingestJobId) {
  accountId = 6027103981001;
  videoId = 6032744881001;

  return function (dispatch) {
    const apiCall = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/ingest_jobs/ea437a7f-5b6d-4f3e-a995-950770cf077a`;
    const method = 'GET';

    return makeApiCall(apiCall, method)
      .then((data) => {
        return dispatch(receiveIngestStatus(data));
      });
  };
};
