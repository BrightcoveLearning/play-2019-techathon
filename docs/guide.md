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

A few things that might be helpful when working with Brightcove APIs are the [documentation][documentation] and [the API References][api-refs]. Please also read the [OAuth doc][oauth] to understand how authentication ordinarily works and how it will work for just this project.

## Get All Videos in an Account

### API Call

The first thing we will want to do is to get information on the videos available for a specific Video Cloud account. We can use the [CMS API][cms] for this purpose. In this case, the [Get Videos][get-videos] operation is what we'll want to use.

```js
// This is the base url for the CMS API
const cmsBaseUrl = 'https://cms.api.brightcove.com/v1';
// The accountId here will need to be filled out with the
// the accountId of the Video Cloud account we would like to use.
const getVideosEndpoint = '/accounts/{account_id}/videos';
```

For the purposes of this project, we have set up a Video Cloud account with the [OAuth proxy registered][oauth-proj-workflow] to the account. We recommend you use the provided account for today. However, in a production setting and outside this workshop, you should set up your own OAuth proxy application [registered to a Video Cloud][oauth-normal-workflow] account you own.

```js
const defaultAccountId = '6027103981001';
```

We can use [Template Literals][template-literal] to replace the `{account_id}` in the `getVideosEndpoint` with the actual value of `defaultAccountId`:

```js
const defaultAccountId = '6027103981001';
const getVideosEndpoint = `/accounts/${defaultAccountId}/videos`;
```

Now we have the URL we need to call and we know that the [Get Videos][get-videos] operation is a `GET` to that URL. So we can make use of the `makeApiCall(url, method)` method in [oauthUtils.js][oauthUtils] to make the API call through the OAuth proxy we have setup for today. This method returns a [Promise][promise] so we'll need to capture the response in the `then` method. The `makeApiCall` will return the response as a JSON object if the request was successful or log an error to the browser console if the request failed.

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

If the request was successful, we will receive all the information about the videos in the Video Cloud account as an Array of Objects, with each Object containing information about a single video in the account's Catalog.

### Interactive UI

Let's think about how we can use this information to our advantage. We could provide a dropdown in which a user can select the video that they would like to see information about. Let's create a file `src/components/VideoIdDropdown.jsx` to store this dropdown, and create a React component to select a video by videoId.

```js
// src/components/VideoIdDropdown.jsx
// These need to be imported to create a React component
import React, { Component } from 'react';

class VideoIdDropdown extends Component {
  render () {
    return (
      <div>
        <select>
          <option>Select VideoId</option>
        </select>
      </div>
    );
  }
}

// we should export the class for use in other files
export default VideoIdDropdown;
```

Now we can add our React component to `App.jsx`. After that, we will render this component in our application.

```js
// src/components/App.jsx
import React, { Component } from 'react';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <VideoIdDropdown />
      </div>
    );
  }
}
```

If you run `npm start` in the project it will start a local server that renders our application!

Now we'll want to reuse some of the code from before to make an API call. Let's create a new class method `fetchVideoList`.

```js
// src/components/VideoIdDropdown.jsx
import React, { Component } from 'react';
// import our utlity method
import makeApiCall from '../oauthUtils';

class VideoIdDropdown extends Component {

  fetchVideoList () {
    const defaultAccountId = '6027103981001';
    // CMS API
    const cmsBaseUrl = 'https://cms.api.brightcove.com/v1';
    const getVideosEndpoint = `/accounts/${defaultAccountId}/videos`;

    makeApiCall(cmsBaseUrl + getVideosEndpoint, 'GET')
      .then((videos) => {
        console.log('video response', videos);
      });
  }

  render () {
    return (
      <div>
        <select>
          <option>Select VideoId</option>
        </select>
      </div>
    );
  }
}

// we should export the class for use in other files
export default VideoIdDropdown;
```

At this point, we aren't actually calling `fetchVideoList` at all, so we need to decide when to do that. We want the dropdown to be populated with the videoIds when the `VideoIdDropdown` component is first created, so we should look at the [React Lifecycle methods][lifecycle] to decide which point in the component's lifecycle is best to make the API call. In our case, `componentDidMount` is a good option as it is within the "commit phase" when we can make changes to the DOM.

```js
// src/components/VideoIdDropdown.jsx

class VideoIdDropdown extends Component {
  componentDidMount () {
    this.fetchVideoList();
  }

  ...
}

export default VideoIdDropdown;
```

Now when the component renders, the API call will be made and the response will be logged in the browser console. We can however, use the response to re-render the component, and show the videoIds as options in the `select`. We will use the component's `state` to do this, as changes to the state will schedule a render of the component.

```js
// src/components/VideoIdDropdown.jsx

class VideoIdDropdown extends Component {
  constructor (props) {
    super(props);

    this.state = {
      videoIds: []
    }
  }

  componentDidMount () {
    this.fetchVideoList();
  }

  fetchVideoList () {
    const defaultAccountId = '6027103981001';
    // CMS API
    const cmsBaseUrl = 'https://cms.api.brightcove.com/v1';
    const getVideosEndpoint = `/accounts/${defaultAccountId}/videos`;

    makeApiCall(cmsBaseUrl + getVideosEndpoint, 'GET')
      .then((videos) => {
        // This will schedule an update to the component's state
        // which will cause a re-render
        this.setState({
          videoIds: videos.map(v => v.id)
        });
      });
  }

  renderOptions () {
    const { videoIds } = this.state;

    return videoIds.map((videoId, i) => (
      <option value={videoId} key={`videoId-${i}`}>
        {videoId}
      </option>
    ));
  }

  render () {
    return (
      <div>
        <select>
          <option>Select VideoId</option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

export default VideoIdDropdown;
```

If we run `npm start`, we can see our `select` now has `<option>` tags for each of the videoIds in the account. The whole file for this code can be seen in:

https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/VideoIdDropdown.jsx


## Load a Video into a Player

Now that we have information about all the videos in an account, we could use that information to load the video into a Brightcove Player. Thankfully, we now provide a [React Player Loader][react-player-loader] component, which make it much easier to use Brightcove Players with React.

Take a look at [this doc][player] to get a sense of how to use the [React Player Loader][react-player-loader].

### Use in Project

Let's create another React Component that will create a player based on the video that is selected in the `VideoIdDropdown` component.

```js
// src/components/BrightcovePlayer.jsx
import React, { Component } from 'react';
// You can style the Player component
import './BrightcovePlayer.css';
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      playerRef: null
    };

    this.success = this.success.bind(this);
  }

  success ({ref}) {
    // This gives us a reference to the successfully created player
    this.setState({
      playerRef: ref
    });

    console.log('player reference', this.state.playerRef);
  }

  render () {
    // The onSucess callback is required
    return (
      <Player
        attrs={{ id: 'videoPlayer' }}
        accountId='6027103981001'
        playerId='default'
        onSuccess={this.success}
        options={{
          controls: true,
          fluid: true
        }}
        embedOptions={{
          unminified: true
        }}
      />
    );
  }
}

export default BrightcovePlayer;
```

Now, we'll want to provide a way for the `BrightcovePlayer` component to know that the selected video changed. Let's update `VideoIdDropdown` to add a `onChange` method to the `<select>`. Since we want the whole application to know which video has been selected, let's have `App.jsx` keep track of that state.

```js
// src/components/App.jsx
import React, { Component } from 'react';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedVideo: null
    };

    this.handleVideoChange = this.handleVideoChange.bind(this);
  }

  handleVideoChange (video) {
    this.setState({
      selectedVideo: video
    });
  }

  render () {
    return (
      <div className='App'>
        <VideoIdDropdown
          onHandleVideoChange={this.handleVideoChange}
        />
      </div>
    );
  }
}
```

```js
// src/components/VideoIdDropdown.jsx

class VideoIdDropdown extends Component {
  constructor (props) {
    super(props);

    this.state = {
      videoIds: []
    };

    // Bind your event handlers to the class so you can
    // modify state in the handler
    this.handleChange = this.handleChange.bind(this);
  }

  ...omitted code...

  handleChange (event) {
    this.props.onHandleVideoChange(event.target.value);
  };

  render () {
    return (
      <div>
        <select onChange={this.handleChange}>
          <option>Select VideoId</option>
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}
```

Now, the `BrightcovePlayer` component can take `selectedVideo` as a prop.

```js
// src/components/App.jsx
import React, { Component } from 'react';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';
import BrightcovePlayer from './BrightcovePlayer';

export default class App extends Component {
  ...omitted code...

  render () {
    return (
      <div className='App'>
        <VideoIdDropdown
          onHandleVideoChange={this.handleVideoChange}
        />
        <BrightcovePlayer
          selectedVideo={this.state.selectedVideo}
        />
      </div>
    );
  }
}
```

That prop can be used to either re-render the `Player` (by passing `videoId` as a prop to the component) or we can use the [Player Catalog][player-catalog] to load the video into the `Player`.

```js
// src/components/BrightcovePlayer.jsx
import React, { Component } from 'react';
// You can style the Player component
import './BrightcovePlayer.css';
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {
  ...omitted code...

  // This is provided to the `onSuccess` prop of `Player`
  success ({ref}) {
    // This gives us a reference to the successfully created player
    this.setState({
      playerRef: ref
    });
    this.loadSelectedVideo(ref);
  }

  loadSelectedVideo (playerRef) {
    if (this.props.selectedVideo !== null) {
      // call load using the videoId provided via the prop `selectedVideo`
      playerRef.catalog.get({
        type: 'video',
        id: this.props.selectedVideo
      }).then(playerRef.catalog.load);
    }
  }

  ...omitted code...
}

export default BrightcovePlayer;
```

The above will ensure that the selected video at the time of the `Player` component render will be loaded, but we need to make sure that when the selectedVideo changes, a new `catalog.load()` call is made. We can do that using the `shouldComponentUpdate` and `componentDidUpdate` lifecycle methods:

```js
// src/components/BrightcovePlayer.jsx
import React, { Component } from 'react';
// You can style the Player component
import './BrightcovePlayer.css';
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {
  ...omitted code...

  shouldComponentUpdate (nextProps) {
    return this.props.selectedVideo !== nextProps.selectedVideo;
  }

  componentDidUpdate (prevProps) {
    this.loadSelectedVideo(this.state.playerRef);
  }

  ...omitted code...
}

export default BrightcovePlayer;
```

Now the `BrightcovePlayer` component will load the selected video when a user makes a new selection! The whole file for this code can be seen in:

https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/BrightcovePlayer.jsx

## Get Analytics for a Video

### API Call

Now that we have a player with a video in our application, it would be interesting to look at the analytics for the video to see how well it is doing. We can do that by using the [Analytics API][analytics]. For the purposes of this project, let's get an [Analytics Report][analytics-report].

The request for an Analytics Report requires `dimensions` and `accounts`. `Accounts` is required and is a comma-separated string of accountIds, as data from multiple accounts (that you have permission to view analytics for) can be queried.

```js
// Analytics API
const analyticsReportEndpoint = 'https://analytics.api.brightcove.com/v1/data';
const accountsQueryParam = `accounts=${defaultAccountId}`;
```


A `dimension` is the dimension by which you want to view the data. In our case, we want to see the analytics for a specific video, so we'll use the `video` dimension.

```js
const dimensionsQueryParam = '&dimensions=video';
```

We also have the option of choosing the fields that we want returned. These vary by the dimension that we choose, so we can use this [tool][dimensions-fields-params] to help us see what we have available when the `video` dimension is used.

For our example, let's use the following fields:
- video: The videoId
- video_duration: The duration of the video content
- video_engagement_1: The number of views recorded at the 1% point of the video.
- video_engagement_100: The number of views recorded at the 100% point of the video.
- video_engagement_25: The number of views recorded at the 25% point of the video.
- video_engagement_50: The number of views recorded at the 50% point of the video.
- video_engagement_75: The number of views recorded at the 75% point of the video.
- video_impression: The number of times a video was loaded into a player and ready for interaction
- video_percent_viewed: The sum of the percent of the video watched by each viewer.
- video_seconds_viewed: The total number of seconds a video was viewed

Explanations of other fields can be found in the [Analytics API Glossary][analytics-glossary]. The fields are a comma-separated list of field names.

```js
const fieldsQueryParam = '&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed';
```

Right now, the query we've written will return analytics data for all the videos in the account. Since we're interested in the data for just one video, we should add a [where filter][analytics-where].

```js
const filterQueryParam = `&where=video==${videoId}`;
```

Now we just need to make the request using the `makeApiCall` utility from earlier:

```js
// Using ES6 imports
import makeApiCall from '../oauthUtils.js';

const defaultAccountId = '6027103981001';

// Analytics API
const analyticsReportEndpoint = 'https://analytics.api.brightcove.com/v1/data';
const accountsQueryParam = `accounts=${defaultAccountId}`;
const dimensionsQueryParam = '&dimensions=video';
const fieldsQueryParam = '&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed';
const filterQueryParam = `&where=video==${videoId}`;
const queryString = '?' + accountsQueryParam + dimensionsQueryParam + fieldsQueryParam + filterQueryParam;


makeApiCall(analyticsReportEndpoint + queryString, 'GET')
  .then((analyticData) => {
    console.log('analytics response', analyticData);
  });
```

### UI

Let's show the response in the UI. Let's create a React component called `AnalyticsFetcher.jsx` that will show the response in a `<pre>` tag. Similar to the `VideoIdDropdown` component, we'll use `componentDidMount` to make the API call, and use `componentDidUpdate` to request data again when the `selectedVideo` is changed in the `App` component.

```js
// src/components/AnalyticsFetcher.jsx
import React, { Component } from 'react';
// Import our utlity methodA
import makeApiCall from '../oauthUtils';
// Apply styles if needed
import './AnalyticsFetcher.css';

class AnalyticsFetcher extends Component {
  constructor (props) {
    super(props);
    this.state = {
      analyticData:  null
    };
    this.getAnalyticsForVideo = this.getAnalyticsForVideo.bind(this);
  }

  componentDidMount () {
    this.getAnalyticsForVideo(this.props.selectedVideo);
  }

  componentDidUpdate (prevProps) {
    if (this.props.selectedVideo !== prevProps.selectedVideo ) {
      this.getAnalyticsForVideo(this.props.selectedVideo);
    }
  }

  getAnalyticsForVideo (videoId) {
    const defaultAccountId = '6027103981001';

    // Analytics API
    const analyticsReportEndpoint = 'https://analytics.api.brightcove.com/v1/data';
    const accountsQueryParam = `accounts=${defaultAccountId}`;
    const dimensionsQueryParam = '&dimensions=video';
    const fieldsQueryParam = '&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed';
    const filterQueryParam = `&where=video==${videoId}`;
    const queryString = '?' + accountsQueryParam + dimensionsQueryParam + fieldsQueryParam + filterQueryParam;
    const apiCall = analyticsReportEndpoint + queryString;
    const method = 'GET';

    makeApiCall(apiCall, method)
      .then((response) => {
        this.setState({
          analyticData: response
        })
      })
      .catch(error => console.error('Error:', error))
  }

  render () {
    return (
      <div>
        <label>Video Analytics:</label>
        {
          this.state && this.state.analyticData &&
          <pre>{ JSON.stringify(this.state.analyticData, null, 2) }</pre>
        }
      </div>
    );
  }
}

export default AnalyticsFetcher;
```

Our `App.jsx` can now be updated to include  the `AnalyticsFetcher` component, and pass the `selectedVideo` in as a prop:

```js
// src/components/App.jsx
import React, { Component } from 'react';
import './App.css';
import VideoIdDropdown from './VideoIdDropdown';
import BrightcovePlayer from './BrightcovePlayer';
import AnalyticsFetcher from './AnalyticsFetcher';

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <VideoIdDropdown
          onHandleVideoChange={this.handleVideoChange}
        />
        <BrightcovePlayer
          selectedVideo={this.state.selectedVideo}
        />
        <AnalyticsFetcher
          selectedVideo={this.state.selectedVideo}
        />
      </div>
    );
  }
}
```

You can take a look at the full solution below, where we styled the response into a table:

https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/AnalyticsFetcher.jsx

## Write a Player Plugin

Now we have a Brightcove Player that loads video content and the analytics report for that video. We could make use of a field from that analytics report and add functionality to the player. We can do that by writing a [Player plugin][plugins].

### Generator and Setup

First, we'll need to use the [plugin generator][plugin-generator] to bootstrap a plugin. Let's create a directory for the plugin files: `/plugin`. Make sure you enter this directory then follow the project instructions to run the generator. The generator will ask you a number of questions as it sets up the project. Here is a sample of how you can answer:

```
? Enter a package scope, if any, for npm (optional): <hit enter>
? Enter the name of this plugin: techathon-proj-plugin-<your-team-name>
? Enter a description for your plugin: <A provided solution for the 2019 Play Tech-a-Thon project player plugin>
? Enter the author of this plugin: <your name>
? Choose a license for your plugin <MIT>
? Choose a type for your plugin Advanced plugin (class-based)
? Do you want to use css tooling? Yes
? Do you want to include documentation tooling? No
? Do you need video.js language file infrastructure for internationalized strings? No
? Should we lint changed files before allowing `git commit` Yes
? Should we run tests before allowing `git push` Yes
```

The generator will run `npm i` automatically so it may take a few minutes to set up. After that, you should be able to run `npm run build` to build the plugin files into a `dist` directory and `npm test` to run tests and linting in the project. You can also run `npm start` to get a test page that will load your player plugin into a plain Video.js player.

The code for the plugin will be in `plugin/src/plugin.js` and it will have a `plugin.css` file for any plugin specific CSS styles. These two files are where we want to make our changes.

### Plugin Development

Since we selected `Advanced plugin` in the generator, the plugin will be written with [ES6 classes][es6]. The important parts of the class are as follows:

1. Construction by extending a Plugin

```js
class TechAThonProjPluginSolution extends Plugin {
  ...omitted code...
}
```

2. Plugin registration

```js
videojs.registerPlugin('techAThonProjPluginSolution', TechAThonProjPluginSolution);
```

3. Version setting

```js
// Include the version number.
TechAThonProjPluginSolution.VERSION = VERSION;
```

4. Applying Styles

```js
this.player.ready(() => {
  this.player.addClass('vjs-tech-a-thon-proj-plugin-solution');
});
```

Let's make our plugin take a `video_seconds_viewed` field and display it in the control bar. We can do that by: taking the `videoSecondsViewed` value as plugin state and extending `Component` to create a custom element to add as a child to the player's `controlBar`.

Let's start by defining a default value for `videoSecondsViewed` state.

```js
// Define default values for the plugin's `state` object here.
TechAThonProjPluginSolution.defaultState = {
  videoSecondsViewed: 0
};
```

Now when the plugin is constructed, the value of the `state.videoSecondsViewed` will be 0 until `setState` is called on the plugin with another value, by doing the following:

```js
// This is outside the plugin
player.techAThonProjPluginSolution()
  .setState({ videoSecondsViewed: 5 });
```

Let's make another file `plugin/src/secondsViewedComponent.js`. This will extend the `Component` class and create a `<div>` to show the value of `videoSecondsViewed`. Check out the [Video.js docs about creating a component][create-component] for more information on how to do this.

```js
// plugin/src/secondsViewedComponent.js
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class SecondsViewedComponent extends Component {
  ...omitted code...
}

// Register the component with Video.js, so it can be used in players.
videojs.registerComponent('SecondsViewedComponent', SecondsViewedComponent);

export default SecondsViewedComponent;
```

You can create DOM element like `<div>` by implementing the `createEl` method and using the utility `videojs.dom.createEl` or by passing the correct options to the super class `Component`.

```js
// plugin/src/secondsViewedComponent.js
  ...omitted code...

  createEl (tag = 'div', props = {}, attributes = {}) {
    props = {
      // Prefixing classes of elements within a player with "vjs-"
      // is a convention used in Video.js.
      // applying the `vjs-control` class to match other control bar elements
      className: 'vjs-seconds-viewed-component vjs-control',
      textContent: ''
    };

    return super.createEl(tag, props, attributes);
  }
```

This will create a `div` with the given classname and set the `textContent` or `innerText` to the empty string. Now, we need to actually display something inside the `div`. We can do that by passing the `videoSecondsViewed` value to a method `updateText` that will set the `textContent` or `innerText` with a utility method `videojs.dom.textContent`.

```js
// plugin/src/secondsViewedComponent.js
  ...omitted code...
  updateText (secondsViewed) {
    return videojs.dom.textContent(this.el(), `viewed: ${secondsViewed}s`);
  }
```

And now, we need to listen to state changes on the plugin and call `updateText` on the instance of `SecondsViewedComponent` in the class.

```js
// plugin/src/plugin.js
  constructor (player, options) {
    ...omitted code...

    this.secondsViewedComponent = new SecondsViewedComponent(player, options);

    // listens to state changes on plugin
    this.on('statechanged', function (e) {
      // see https://docs.videojs.com/module-stateful-statefulmixin#event:statechanged
      if (e.changes && e.changes.videoSecondsViewed) {
        this.secondsViewedComponent.updateText(e.changes.videoSecondsViewed.to);
      }
    });

    ...omitted code...
  }
```

Now we need to add the `SecondsViewedComponent` as a child to the `controlBar` so we can actually see the value. We do that in the main plugin file.

```js
  constructor (player, options) {
    ...omitted code...

    // Adds component to control bar
    this.player.controlBar.addChild(
      this.secondsViewedComponent,
      {},
      // adds component as second last child
      this.player.controlBar.children().length - 2
    );

    ...omitted code...
  }
```

The last thing to do is to apply some styles to the component now that we can see it. We do that in `plugin/src/plugin.css`. This is a postcss file, so we can take advantage of that. There should be a [nested style rule][postcss-nesting] `.video-js` and another nested style rule with the name of the plugin ``. Within that, we can add our specific class:

```PostCSS
    & .vjs-seconds-viewed-component.vjs-control {
      ...add your style rules here...
    }
```

For now, we have a working plugin! You should be able to see this working in the Video.js sandbox when you run `npm start`. A full solution is linked below:

https://github.com/BrightcoveLearning/play-2019-techathon/tree/react-state/plugin/src

### Add to Player

To actually apply changes, we must call `playerRef.pluginName().setState` with the new `videoSecondsViewed` value. This can be done in our `BrightcovePlayer` component. Usually, you would [use Video Cloud to add a plugin and publish a player][deploy-player]. However, since we're using the provided account, a player with a solution plugin has been provided under the same account.

playerId: `mkvkPawzDS`

pluginName: `techAThonProjPluginSolution`

The actual implementation of this is left as an exercise for the reader. However, the full solution is linked below:

https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/BrightcovePlayer.jsx

## EXTRA CREDIT: Upload a Local Video File

If you've gotten this far, congratulations! You've completed the main project. From here on, everything is extra credit and will take a bit longer than the sections you completed above.

To be able to upload a video into a Video Cloud Catalog, you will need to use [a combination of the Dynamic Delivery API and CMS API][dd]. This section will go over the API steps to request an ingest of a local video file.

### API Calls

Before anything else, we have to make sure that the Video Cloud Catalog has a video object created that will contain the content we ingest. The way to do this is to use the [CMS API][cms-create-video] Create Video operation. Note that a video `name` is required.

```js
let videoId;

const createVideo = function(name) {
  const defaultAccountId = '6027103981001';
  const apiCall = `https://cms.api.brightcove.com/v1/accounts/${defaultAccountId}/videos`;
  const method = 'POST';
  const options = {
    name
  };

  return makeApiCall(apiCall, method, options)
    .then((data) => {
      console.log('video', data);
      videoId = data.id;
    });
};
```

The response we get back includes the `videoId` that we'll use later to ingest an uploaded file. Now we can get to uploading a local video file!

The [Dynamic Ingest API Get Temporary S3 URLs to Upload Videos][get-s3-urls] operation will give us a URL to upload local content to and the URL to use to ingest that content later.

```js
const getSourceFileUploadLocation = function(videoId, videoName, videoFile) {
  const defaultAccountId = '6027103981001';
  const apiCall = `https://ingest.api.brightcove.com/v1/accounts/${defaultAccountId}/videos/${videoId}/upload-urls/${videoName}`;
  const method = 'GET';

  return makeApiCall(apiCall, method)
    .then((data) => {
      const signedUrl = data.signed_url;
      const ingestUrl = data.api_request_url;
      console.log('s3 upload url', signedUrl, 'url to ingest', ingestUrl);
    });
};
```

Now you can upload your content to the `signedUrl`. We have provided a utility method in `src/oauthUtils.js` called `makeS3Call` that will make the request without passing it through the OAuth proxy as that is not needed in this case. You can do a simple `PUT` request with the `body` option set to the video data.

If the `PUT` request succeeded, then you can now use the [Dynamic Ingest API Ingest Videos and Assets][ingest-videos] operation to ingest the uploaded video.

```js
const postVideoIngest = function(videoId, ingestUrl) {
  const defaultAccountId = '6027103981001';
  const apiCall = `https://ingest.api.brightcove.com/v1/accounts/${defaultAccountId}/videos/${videoId}/ingest-requests`;
  const method = 'POST';
  const options = {
    master: {
      url: ingestUrl
    }
  };

  return makeApiCall(apiCall, method, options)
    .then((data) => {
      console.log('ingest job id', data.id);
    });
};
```

The response will include an Ingest Job `id`. This is what you will need to use if you complete the next section. Based on the calls above, you can build a `VideoUploader.jsx` component. You might want to look at [FileReader][filereader] to see how to read the video file data.

## EXTRA CREDIT: Check the Status of an Ingest Job

It often takes a few minutes to ingest and transcode an asset that has been uploaded. You can keep track of an Ingest Job's status with the [CMS Status API][api-ref-ingest-job-status]. This request requires `accountId`, `videoId` and the `ingestJobId` from the previous steps.

The response will include a `state` attribute. The value of `state` will be `'finished'` when the job is complete. As the job may take some time, this API will need to be polled until the `state === 'finished'`. Based on this information, you can build an `IngestJobStatus` component that polls the Status API to indicate when the uploaded video has been ingested.

## EXTRA CREDIT: Redux Version

Thus far, we've been using React state alone to store the results of our API calls and state changes. However, you might want to try out using [Redux][redux] to store state and manage making API calls. Our [Redux][redux] doc gives you a few basics and links, but the rest is left as an exercise for the reader.

## References

- [OAuth][oauth]
- [Brightcove Player][player]
- [Player Plugin][plugins]
- [Analytics API][analytics]
- [CMS API][cms]
- [Dynamic Delivery][dd]
- [React][react]
- [Redux][redux]
- [ES6 class][es6]
- [JSX Documentation][jsx]
- [CMS API Reference][cms-api-ref]
- [React Player Loader][react-player-loader]
- [VideoIdDropdown Full Solution][videoiddropdown-solution]
- [BrightcovePlayer Full Solution][brightcoveplayer-solution]
- [AnalyticsFetcher Full Solution][analyticsfetcher-solution]
- [Player Plugin Full Solution][playerplugin-solution]
- [VideoUploader Full Solution][videouploader-solution]
- [IngestJobStatus Full Solution][ingestjobstatus-solution]
- [Redux Full Solution][redux-solution]

[oauth]: ./oauth.md
[oauth-proj-workflow]: ./oauth.md#project-workflow
[oauth-normal-workflow]: ./oauth.md#normal-workflow
[player]: ./player.md
[plugins]: ./playerPlugin.md
[analytics]: ./analytics.md
[cms]: ./cms.md
[dd]: ./dynamicDelivery.md
[react]: ./react.md
[redux]: ./redux.md
[es6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[jsx]: https://reactjs.org/docs/introducing-jsx.html
[documentation]: https://support.brightcove.com/
[api-refs]: https://docs.brightcove.com/index.html

[cms-api-ref]: https://docs.brightcove.com/cms-api/v1/doc/index.html
[get-videos]: https://docs.brightcove.com/cms-api/v1/doc/index.html#operation/GetVideos
[template-literal]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
[oauthUtils]: ../src/oauthUtils.js
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[lifecycle]: https://reactjs.org/docs/react-component.html#the-component-lifecycle

[react-player-loader]: https://support.brightcove.com/react-player-loader
[player-catalog]: https://support.brightcove.com/player-catalog

[plugin-generator]: https://support.brightcove.com/quick-start-videojs-plugin-generator
[create-component]: https://docs.videojs.com/tutorial-components.html#creating-a-component
[postcss-nesting]: https://github.com/jonathantneal/postcss-nesting
[deploy-player]: https://support.brightcove.com/step-step-plugin-development#bc-ipnav-5

[analytics-report]: https://docs.brightcove.com/analytics-api/v1/doc/index.html#operation/GetAnalyticsReport
[dimensions-fields-params]: https://support.brightcove.com/analytics-api-overview-dimensions-fields-and-parameters
[analytics-glossary]: https://support.brightcove.com/analytics-api-glossary
[analytics-where]: https://support.brightcove.com/analytics-api-overview-dimensions-fields-and-parameters#filterValues

[cms-create-video]: https://docs.brightcove.com/cms-api/v1/doc/index.html#operation/CreateVideo
[filereader]: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[dd-ingest-status]: https://support.brightcove.com/overview-dynamic-ingest-api-dynamic-delivery#notifications
[api-ref-ingest-job-status]: https://docs.brightcove.com/cms-api/v1/doc/index.html#operation/GetStatusOfIngestJob
[ingest-videos]: https://docs.brightcove.com/dynamic-ingest-api/v1/doc/index.html#operation/AccountsVideosIngestRequestsByAccountIdAndVideoIdPost
[get-s3-urls]: https://docs.brightcove.com/dynamic-ingest-api/v1/doc/index.html#operation/AccountsVideosUploadUrlsSourceNameByAccountIdAndVideoIdGet

[videoiddropdown-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/VideoIdDropdown.jsx
[brightcoveplayer-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/BrightcovePlayer.jsx
[analyticsfetcher-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/AnalyticsFetcher.jsx
[videouploader-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/VideoUploader.jsx
[ingestjobstatus-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/IngestJobStatus.jsx
[redux-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/tree/redux-solution
[playerplugin-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/tree/react-state/plugin/src
