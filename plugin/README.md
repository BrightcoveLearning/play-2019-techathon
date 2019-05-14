<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [videojs-tech-a-thon-proj-plugin-solution](#videojs-tech-a-thon-proj-plugin-solution)
  - [Installation](#installation)
  - [Usage](#usage)
    - [`<script>` Tag](#script-tag)
    - [Browserify/CommonJS](#browserifycommonjs)
    - [RequireJS/AMD](#requirejsamd)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# videojs-tech-a-thon-proj-plugin-solution



## Installation

```sh
npm install --save @n/videojs-tech-a-thon-proj-plugin-solution
```

## Usage

To include videojs-tech-a-thon-proj-plugin-solution on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-tech-a-thon-proj-plugin-solution.min.js"></script>
<script>
  var player = videojs('my-video');

  player.techAThonProjPluginSolution();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-tech-a-thon-proj-plugin-solution via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('@n/videojs-tech-a-thon-proj-plugin-solution');

var player = videojs('my-video');

player.techAThonProjPluginSolution();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', '@n/videojs-tech-a-thon-proj-plugin-solution'], function(videojs) {
  var player = videojs('my-video');

  player.techAThonProjPluginSolution();
});
```

## License

MIT. Copyright (c) ldayananda &lt;ldayananda@brightcove.com&gt;


[videojs]: http://videojs.com/
