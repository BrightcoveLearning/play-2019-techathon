# Dynamic Delivery and Dynamic Ingest APIs

The [Dynamic Ingest API][overview-ingest] allows video source files to be downloaded to Video Cloud from an external storage location. It also allows uploading local source files to a temporary location where the API can access them.

## Usage

In this project, we weill be using the Dynamic Ingest API to [get a temporary location][api-ref-ingest-s3] to upload content to. After uploading our content, we will then [ingest the videos][api-ref-ingest] into Video Cloud with the default ingest profile of the account. You will then need to look at [notifications][dd-ingest-status] of when the Ingest Job has completed before accessing the video.

The full set of steps to upload local content to Video Cloud is detailed in [Source File Upload API for Dynamic Ingest][source-file-upload].

### Examples

An example of getting the external storage URLs to upload local content to is shown below. This assumes an access token has already been obtained.

**Note**: A [CMS Create Video][source-file-upload-cms] request must be made first if this is an upload of content for a new video.

```js
import fetch from 'cross-fetch';

let s3UploadUrl;
let ingestUrl;

fetch(
  `https://ingest.api.brightcove.com/v1/accounts/<accountId>/videos/<videoId>/upload-urls/<videoName>`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <access token>'
    }
  }
).then(
  (response) => response.json(),
  (error) => console.error('ERROR', error),
)
.then((data) => {
  // Url to upload local content to
  s3UploadUrl = data.signed_url;
  // Url to ingest from
  ingestUrl = data.api_request_url;
});
```

## Reference

- [Overview: Dynamic Ingest API for Dynamic Delivery][overview-ingest]
- [Source File Upload API for Dynamic Ingest][source-file-upload]
- [CMS API Create Video][api-ref-cms-create-video]
- [Dynamic Ingest API Reference][api-ref-ingest]
- [Dynamic Delivery Ingest Status][dd-ingest-status]
- [CMS API: Ingest Job Status][api-ref-ingest-job-status]


[overview-ingest]: https://support.brightcove.com/overview-dynamic-ingest-api-dynamic-delivery
[api-ref-ingest]: https://docs.brightcove.com/dynamic-ingest-api/v1/doc/index.html
[api-ref-ingest-s3]: https://docs.brightcove.com/dynamic-ingest-api/v1/doc/index.html#operation/AccountsVideosUploadUrlsSourceNameByAccountIdAndVideoIdGet
[api-ref-ingest]: https://docs.brightcove.com/dynamic-ingest-api/v1/doc/index.html#operation/AccountsVideosIngestRequestsByAccountIdAndVideoIdPost
[source-file-upload]: https://support.brightcove.com/source-file-upload-api-dynamic-ingest
[source-file-upload-cms]: https://support.brightcove.com/source-file-upload-api-dynamic-ingest#CMS_API_request
[api-ref-cms-create-video]: https://docs.brightcove.com/cms-api/v1/doc/index.html#operation/CreateVideo
[dd-ingest-status]: https://support.brightcove.com/overview-dynamic-ingest-api-dynamic-delivery#notifications
[api-ref-ingest-job-status]: https://docs.brightcove.com/cms-api/v1/doc/index.html#operation/GetStatusOfIngestJob
