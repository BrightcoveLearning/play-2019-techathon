# CMS API

The Brightcove CMS API enables access and management of your media library in your Video Cloud Catalog. There are many operations that can be performed but we will focus on videos for this workshop.

## Usage

The [API Reference][api-ref] of the CMS API details all the operations that can be performed. You will need have an [access token][oauth] to make calls to this API.

### Examples

An example of getting the full list of videos in an account is below, this assumes that an access token has already been obtained.

```js
import fetch from 'cross-fetch';

let videoData;

fetch(
  'https://cms.api.brightcove.com/v1/accounts/<accountId>/videos',
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
  videoData = data;
});
```

## References

- [Overview: CMS API][overview]
- [CMS API Reference][api-ref]
- [Related Videos via Tags (Sample)][tags-sample]

[overview]: https://support.brightcove.com/overview-cms-api#General_Information
[api-ref]: https://docs.brightcove.com/cms-api/v1/doc/index.html
[tags-sample]: https://support.brightcove.com/brightcove-player-sample-related-videos-tags-cms-api
[oauth]: ./oauth.md
