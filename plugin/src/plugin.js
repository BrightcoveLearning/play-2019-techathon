import videojs from 'video.js';
import { version as VERSION } from '../package.json';
import SecondsViewedComponent from './secondsViewedComponent';

const Plugin = videojs.getPlugin('plugin');

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
    this.secondsViewedComponent = new SecondsViewedComponent(player, options);

    // listens to state changes on plugin
    this.on('statechanged', function (e) {
      if (e.changes && e.changes.videoSecondsViewed) {
        this.secondsViewedComponent.updateText(e.changes.videoSecondsViewed.to);
      }
    });

    // Adds component to control bar
    this.player.controlBar.addChild(
      this.secondsViewedComponent,
      {},
      this.player.controlBar.children().length - 2
    );

    this.player.ready(() => {
      this.player.addClass('vjs-tech-a-thon-proj-plugin-solution');
    });
  }
}

// Define default values for the plugin's `state` object here.
TechAThonProjPluginSolution.defaultState = {
  videoSecondsViewed: 0
};

// Include the version number.
TechAThonProjPluginSolution.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('techAThonProjPluginSolution', TechAThonProjPluginSolution);

export default TechAThonProjPluginSolution;
