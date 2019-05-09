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

We have provided a short, roughly 5s long video file for usage in a later section in which we will upload content to a Video Cloud Catalog.

### Public

This is where the base `index.html` file for the application is stored. When `npm start` is called, a local server is started that points to the `public/index.html` file. This html file provides the `root` element used to mount our React `App` component.

### src

This is where the source code for our application lives. There a few starter files provided which will be detailed in the sections below.

#### index.jsx

This file sets up the entire React application, mounting the `App` React component on the `root` DOM element.

#### components

The `App` React component is defined in `App.jsx`. This is a React component built as an [ES6 class][es6]. The extension `.jsx` indicates that we will be using [JSX][jsx] in the `render` method of the class and that it is a React component. The file imports `App.css` to apply styles to the elements. You will be adding new components you build later in the project to the `render` method of this class.

Learn more about React in our [React doc][react].

#### oauthUtils.js

This is a file with utility methods for calling Brightcove APIs. The method `makeApiCall` will the OAuth proxy we setup with the API endpoint we eventually want to hit, the method we want to use and a payload if one should be sent with the request. The method `makeS3Call` is provided to make a request to upload a video file directly to S3, which does not need to go through the OAuth proxy.

Learn more about using OAuth with the Brightcove APIs in the [OAuth doc][oauth].

#### tests

There is not much provided in App.test.jsx currently, however the project is setup to run `Jest` tests in that directory using the `npm test` command.

## Getting Started with Brightcove APIs

## Get All Videos in an Account

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

[oauth]: ./oauth.md
[player]: ./player.md
[analytics]: ./analytics.md
[cms]: ./cms.md
[dd]: ./dynamicDelivery.md
[react]: ./react.md
[es6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[jsx]: https://reactjs.org/docs/introducing-jsx.html
