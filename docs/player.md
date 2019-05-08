# Brightcove Player

The Brightcove Player is generally provided as an embed code that is included in client code. For more technical users, we provide a [Brightcove Player Loader][player-loader] and a [Brightcove React Player Loader][react-player-loader] to make it easier to load Brightcove Players in Javascript applications.

Players can be [created and styled][create-player] in Video Cloud. In this project, we're going to use the default player that is provided.

## Usage

[React Player Loader][react-player-loader] provides a React component that will load a Brightcove Player for a specific account. At least the `accountId` and `onSuccess` callback must be provided as props. For example:

```js
import document from 'global/document';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayerLoader from '@brightcove/react-player-loader';

let reactPlayerLoader;
const onSuccess = function(success) {
  // two ways to get the underlying player/iframe at this point.
  console.log(success.ref)
  console.log(reactPlayerLoader.player);
};

reactPlayerLoader = ReactDOM.render(
  <ReactPlayerLoader accountId='1234678' onSuccess={onSuccess}/>,
  document.getElementById('fixture')
);
```

Other methods of using the library are provided in the [repo][react-repo-usage]. There are a number of other [properties][loader-params] that can be passed into the component.

There are also several methods of loading videos supported, including using the [Player Catalog][player-catalog].


## References

- [Brightcove Player Loader][player-loader]
- [Brightcove React Player Loader][react-player-loader]
- [React Player Loader Repo][react-repo-usage]
- [Player Loader Parameters][loader-params]
- [Player Catalog][player-catalog]
- [Creating and Styling a Player][create-player]

[player-loader]: https://support.brightcove.com/brightcove-player-loader
[react-player-loader]: https://support.brightcove.com/react-player-loader
[react-repo-usage]: https://github.com/brightcove/react-player-loader#usage
[loader-params]: https://support.brightcove.com/brightcove-player-loader#Available_parameters
[player-catalog]: https://support.brightcove.com/player-catalog
[create-player]: https://support.brightcove.com/quick-start-creating-and-styling-player
