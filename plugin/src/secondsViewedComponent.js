import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class SecondsViewedComponent extends Component {
  constructor (player, options) {
    // the parent class will add player under this.player
    super(player, options);

    if (options.videoSecondsViewed) {
      this.updateText(options.videoSecondsViewed);
    }
  }

  /**
   * The `createEl` function of a component creates its DOM element.
   */
  createEl (tag = 'div', props = {}, attributes = {}) {
    props = {
      // Prefixing classes of elements within a player with "vjs-"
      // is a convention used in Video.js.
      className: 'vjs-seconds-viewed-component vjs-control',
      textContent: ''
    };

    return super.createEl(tag, props, attributes);
  }

  updateText (secondsViewed) {
    return videojs.dom.textContent(this.el(), `viewed: ${secondsViewed}s`);
  }
}

// Register the component with Video.js, so it can be used in players.
videojs.registerComponent('SecondsViewedComponent', SecondsViewedComponent);

export default SecondsViewedComponent;
