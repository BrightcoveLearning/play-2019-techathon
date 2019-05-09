# Analytics API

The [Analytics API][api-overview] can be used to get a report on a specific video, player or account. In this workshop, we will [get an Analytics report][analytics-report].

## Usage

The [API Reference][api-ref] details the operations that can be performed. You will need an [access token][oauth] to make calls to this API.

The terms `dimensions`, `parameter` and `fields` are explained [here][fields-explain]. This document also explains how they can be combined.

### Examples

An example of getting an analytics report for a specific video is shown below. The `accounts` and `dimensions` query parameters are required. This assumes an [access token][oauth] has already been obtained.

```js
import fetch from 'cross-fetch';

let videoReport;

fetch(
  // base url
  'https://analytics.api.brightcove.com/v1/data?' +
  // accountIds, comma separated string
  'accounts=<accountId>&' +
  // dimensions
  'dimensions=video&' +
  // fields
  'fields=video,video_percent_viewed,video_seconds_viewed,video_view&' +
  // filter on videoIds, a comma separated string
  '&where=video==<video>',
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
  videoReport = data;
});
```

The above example will return an Analytics report that is bucketed by video.

```js
'dimensions=video'
```

We are asking for specific data about the video by specifying [fields][fields].

```js
'fields=video,video_percent_viewed,video_seconds_viewed,video_view&'
```

In this case, we are using a [dimension filter][where-filter] to restrict the results to one videoId.

```js
'&where=video==<video>'
```

## References

- [Overview: Analytics API][api-overview]
- [API Reference][api-ref]
- [Overview of Dimensions, Fields, and Parameters][fields-explain]
- [Quick Start: Analytics API][quick-start]
- [FAQ][faq]
- [Glossary][glossary]
- [All Time Video Views (Sample)][views-sample]

[api-overview]: https://support.brightcove.com/overview-analytics-api-v1
[api-ref]: https://docs.brightcove.com/analytics-api/v1/doc/index.html
[views-sample]: https://support.brightcove.com/brightcove-player-sample-all-time-video-views
[analytics-report]: https://docs.brightcove.com/analytics-api/v1/doc/index.html#operation/GetAnalyticsReport
[fields-explain]: https://support.brightcove.com/analytics-api-overview-dimensions-fields-and-parameters
[where-filter]: https://support.brightcove.com/analytics-api-overview-dimensions-fields-and-parameters#filterValues
[fields]: https://support.brightcove.com/analytics-api-overview-dimensions-fields-and-parameters#metrics
[quick-start]: https://support.brightcove.com/quick-start-analytics-api
[faq]: https://support.brightcove.com/faq-analytics-api
[glossary]: https://support.brightcove.com/analytics-api-glossary
