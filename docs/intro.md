# Guide

## Project Structure

```
assets
  video.mp4
public
  index.html
  manifest.json
src
  components
    App.jsx
    App.css
  index.jsx
  oauthUtils.js
  tests
    App.test.jsx
```

### Assets

We have provided a short (roughly 5s long) video file for usage in a later section in which we will upload content to a Video Cloud Catalog.

### Public

This is where the base `index.html` file for the application is stored. When `npm start` is called, a local server is started that points to the `public/index.html` file. This html file provides the `root` element used to mount our React `App` component.

### src

This is where the source code for our application lives. There are a few starter files provided which will be detailed in the sections below.

#### index.jsx

This file sets up the entire React application, mounting the `App` React component on the `root` DOM element.

#### components

The `App` React component is defined in `App.jsx`. This is a React component built as an [ES6 class][es6]. The extension `.jsx` indicates that we will be using [JSX][jsx] in the `render` method of the class and that it is a React component. The file imports `App.css` to apply styles to the elements. You will be adding new components you build later in the project to the `render` method of this class.

Learn more about React in our [React doc][react].

#### oauthUtils.js

This is a file with utility methods for calling Brightcove APIs. The method `makeApiCall` will call the OAuth proxy we setup with the API endpoint we eventually want to hit, the method we want to use and a payload if one should be sent with the request. The method `makeS3Call` is provided to make a request to upload a video file directly to S3, which does not need to go through the OAuth proxy.

Learn more about using OAuth with the Brightcove APIs in the [OAuth doc][oauth].

#### tests

There is not much provided in App.test.jsx currently, however the project is setup to run `Jest` tests in that directory using the `npm test` command.

## Getting Started with Brightcove APIs


## Get All Videos in an Account

The first thing we will want to do is to get information on the videos available for a specific Video Cloud account. We can use the [CMS API][cms] for this purpose. In this case, the [Get Videos][get-videos] operation is what we'll want to use.

```js
// This is the base url for the CMS API
const cmsBaseUrl = 'https://cms.api.brightcove.com/v1';
// The accountId here will need to be filled out with the
// the accountId of the Video Cloud account we would like to use.
const getVideosEndpoint = '/accounts/{account_id}/videos';
```

For the purposes of this project, we have setup a Video Cloud account with the [OAuth proxy registered][oauth-proj-workflow] to the account. We recommend you use this account for today, and setup your own OAuth proxy application [registered to a Video Cloud][oauth-normal-workflow] account you own.

```js
const defaultAccountId = '6027103981001';
```

We can use [Template Literals][template-literal] to replace the `{account_id}` in the `getVideosEndpoint` with the actual value of `defaultAccountId`:

```js
const defaultAccountId = '6027103981001';
const getVideosEndpoint = `/accounts/${defaultAccountId}/videos`;
```

Now we have the URL we need to call and we know that the [Get Videos][get-videos] operation is a `GET` to that URL. So we can make use of the `makeApiCall(url, method)` method in [oauthUtils.js][oauthUtils] to make the API call through the OAuth proxy we have setup for today. This method returns a [Promise][promise] so we'll need to capture the response in the `then` method. The `makeApiCall` will return the response as a JSON object if the request was successful or log an error to the browser console if the request failed.

If the request was successful, we will receive all the information about the videos in the Video Cloud account as an Array of Objects, with each Object containing information about a single video in the account's Catalog.

```js
// Using ES6 imports
import makeApiCall from '../oauthUtils.js';

const defaultAccountId = '6027103981001';
// CMS API
const cmsBaseUrl = 'https://cms.api.brightcove.com/v1';
const getVideosEndpoint = `/accounts/${defaultAccountId}/videos`;

makeApiCall(cmsBaseUrl + getVideosEndpoint, 'GET')
  .then((videos) => {
    console.log('video response', videos);
  });
```

## Load a Video into a Player

## Write a Player Plugin

## Get Analytics for a Video

## Upload a Local Video File

## Check the Status of an Ingest Job

## References

- [OAuth][oauth]
- [Brightcove Player][player]
- [Analytics API][analytics]
- [CMS API][cms]
- [Dynamic Delivery][dd]
- [React][react]
- [ES6 class][es6]
- [JSX Documentation][jsx]
- [CMS API Reference][cms-api-ref]

[oauth]: ./oauth.md
[oauth-proj-workflow]: ./oauth.md#project-workflow
[oauth-normal-workflow]: ./oauth.md#normal-workflow
[player]: ./player.md
[analytics]: ./analytics.md
[cms]: ./cms.md
[dd]: ./dynamicDelivery.md
[react]: ./react.md
[es6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[cms-api-ref]: https://docs.brightcove.com/cms-api/v1/doc/index.html
[get-videos]: https://docs.brightcove.com/cms-api/v1/doc/index.html#operation/GetVideos
[template-literal]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
[oauthUtils]: ../src/oauthUtils.js
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
