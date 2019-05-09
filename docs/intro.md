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

### API Call

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
};

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
};
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
};

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
};

export default VideoIdDropdown;
```

Now when the component renders, the API call will be made and the response will be logged in the browser console. We can however, use the response to re-render the component, and show the videoIds as options in the `select`. We will use the component's `state` to do this, as changes to the state will schedule a render of the component.

```js
// src/components/VideoIdDropdown.jsx

class VideoIdDropdown extends Component {
  constructor (props, context) {
    super(props, context);

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
};

export default VideoIdDropdown;
```

If we run `npm start`, we can see our `select` now has options for each of the videoIds in the account. The whole file for this code can be seen in:

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
  success = ({ ref }) => {
    // This gives us a reference to the successfully created player
    this.playerRef = ref;
    console.log('player reference', this.playerRef);
  };

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
};
```

```js
// src/components/VideoIdDropdown.jsx

class VideoIdDropdown extends Component {
  constructor (props, context) {
    super(props, context);

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
};
```

That prop can be used to either re-render the `Player` (by passing `videoId` as a prop to the component) or we can use the [Player Catalog][player-catalog] to load the video into the `Player`.

```js
// src/components/BrightcovePlayer.jsx
import React, { Component } from 'react';
// You can style the Player component
import './BrightcovePlayer.css';
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {
  // This is provided to the `onSuccess` prop of `Player`
  success = ({ ref }) => {
    // This gives us a reference to the successfully created player
    this.playerRef = ref;

    // call load using the videoId provided via the prop `selectedVideo`
    if (this.props.selectedVideo !== null) {
      this.playerRef.catalog.load({
        sources: [this.props.selectedVideo]
      });
    }
  };

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
    this.playerRef.catalog.getVideo(this.props.selectedVideo, (error, video) => {
      this.playerRef.catalog.load(video);
    });
  }

  ...omitted code...
}

export default BrightcovePlayer;
```

Now the `BrightcovePlayer` component will load the selected video when a user makes a new selection! The whole file for this code can be seen in:

https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/BrightcovePlayer.jsx

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
- [React Player Loader][react-player-loader]
- [VideoIdDropdown Full Solution][videoiddropdown-solution]
- [BrightcovePlayer Full Solution][brightcoveplayer-solution]

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
[lifecycle]: https://reactjs.org/docs/react-component.html#the-component-lifecycle
[videoiddropdown-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/VideoIdDropdown.jsx
[react-player-loader]: https://support.brightcove.com/react-player-loader
[player-catalog]: https://support.brightcove.com/player-catalog
[brightcoveplayer-solution]: https://github.com/BrightcoveLearning/play-2019-techathon/blob/react-state/src/components/BrightcovePlayer.jsx
