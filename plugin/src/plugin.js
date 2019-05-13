import videojs from 'video.js';
import { version as VERSION } from '../package.json';
import SecondsViewedComponent from './secondsViewedComponent';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  videoSecondsViewed: 0
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class TechAThonProjPluginSolution extends Plugin {
  /**
   * Create a TechAThonProjPluginSolution plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor (player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    const secondsViewedComponent = new SecondsViewedComponent(player, this.options);

    // Adds component to control bar
    this.player.controlBar.addChild(
      secondsViewedComponent,
      { videoSecondsViewed: this.options.videoSecondsViewed },
      this.player.controlBar.children().length - 2
    );

    this.player.ready(() => {
      this.player.addClass('vjs-tech-a-thon-proj-plugin-solution');
    });
  }
}

// Define default values for the plugin's `state` object here.
TechAThonProjPluginSolution.defaultState = {};

// Include the version number.
TechAThonProjPluginSolution.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('techAThonProjPluginSolution', TechAThonProjPluginSolution);

export default TechAThonProjPluginSolution;
