import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import 'simplebar/dist/simplebar.css';

const app = App();

app.ready(function () {
  // Set the font-size on the HTML Element. This will modify how all
  // the elements sized with REM units look.
  document.querySelector('html').style.fontSize = app.options.size + 'px';

  // Set the background gradient.
  const { gradientRot } = app.options;
  const [colorA, colorB] = app.getSwatches();
  document.body.style.background = `linear-gradient(${gradientRot}deg, ${colorA} 0%, ${colorB} 100%)`;

  // Apply highlights to the code if the `highlight` flag is defined.
  if (!!app.options.highlight) {
    const { text } = app.options;
    app.$code.innerHTML = Prism.highlight(text, Prism.languages.bash, 'bash');
  }
});

/**
 * @class
 * Main application global object.
 */
function App() {
  const DEFAULT_OPTIONS = {
    text: 'WW91IG11c3QgY29uZmlndXJlIHRoZSAidGV4dCIgcXVlcnkgYXR0cmlidXRl',
    minSize: 12,
    size: 18,
    maxSize: 24,
    gradient: 'random',
    gradientRot: 90,
    highlight: true,
  };
  
  const GRADIENT_SWATCHES = {
    vitalOcean: ['#1CB5E0', '#000851'],
    kaleSalad: ['#00C9FF', '#92FE9D'],
    discoClub: ['#FC466B', '#3F5EFB'],
    shadyLane: ['#3F2B96', '#A8C0FF'],
    retroWagon: ['#FDBB2D', '#22C1C3'],
    frescoCrush: ['#FDBB2D', '#3A1C71'],
    cucumberWater: ['#e3ffe7', '#d9e7ff'],
    seaSalt: ['#4b6cb7', '#182848'],
    parFour: ['#9ebd13', '#008552'],
    ooeyGooey: ['#0700b8', '#00ff88'],
    bloodyMimosa: ['#d53369', '#daae51'],
    lovelyLilly: ['#efd5ff', '#515ada'],
    aquaSpray: ['#00d2ff', '#3a47d5'],
    melloYellow: ['#f8ff00', '#3ad59f'],
    dustyCactus: ['#fcff9e', '#c67700']
  }

  const self = {
    init,
    ready,
    getOptions,
    getWidth,
    getRandomGradient,
    getSwatches,
  };

  return self;

  // Functions
  /**
   * Application entry function. Runs the app when the DOM is ready.
   * @param {function} fn - Function to run when the DOM is ready.
   * 
   * @example
   *
   * ```js
   * const app = App();
   * 
   * app.ready(function() {
   *   console.log('DOM is ready');
   *   // 'DOM is ready';
   * });
   * ```
   */
  function ready(callback) {
    try {
      if (document.readyState != 'loading') self.init(callback); 
      else document.addEventListener('DOMContentLoaded', self.init(callback));
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Gets the app configuration options from the url query parameters.
   * 
   * @example
   *
   * ```js
   * app.getOptions();
   * // { ... } 
   * ```
   */
  function getOptions() {
    var search = location.search.substring(1);
    if (search === '') return {};
    const query = {...DEFAULT_OPTIONS, ...JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') };
    if (typeof query.size === 'string') query.size = parseInt(query.size, 10);
    if (typeof query.minSize === 'string') query.size = parseInt(query.size, 10);
    if (typeof query.maxSize === 'string') query.size = parseInt(query.size, 10);
    if (query.text !== undefined) query.text = atob(query.text);
    self.options = query;
  }
  /**
   * Initializes the App.
   * @param {function} [callback] - Optional callback to call after initialization.
   * @example
   *
   * ```js
   * app.init(callback);
   * ```
   */
  function init(callback) {
    if (self.$html === undefined)    self.$html = document.querySelector('html');
    if (self.$body === undefined)    self.$body = document.body;
    if (self.$code === undefined)    self.$code = document.querySelector('pre code');
    if (self.$content === undefined) self.$content = document.querySelector('.content');
    if (self.$lines === undefined)   self.$lines = document.querySelector('.lines');
    if (self.$command === undefined) self.$command = document.querySelector('.command');
    if (self.options === undefined)  self.getOptions();
    if (callback !== undefined) {
      callback();
    }
  }
  /**
   * Gets the width from an `HTMLElement`.
   * @param {HTMLElement} $el - DOM element from which to get the width.
   * @return {number} The given DOM element's width.
   * 
   * @example
   *
   * ```js
   * const bodyWidth = App.getWidth(document.body);
   * console.log(bodyWidth);
   * // 768
   * ```
   */
  function getWidth($el) {
    return parseFloat(getComputedStyle($el, null).width.replace("px", ""));
  }
  /**
   * Returns a random gradient from the pre-defined `GRADIENT_SWATCHES` object.
   * @return {string} - A random GRADIENT SWATCH name.
   * 
   * @example
   *
   * ```js
   * const randomGradient = App.getRandomGradient();
   * console.log(randomGradient);
   * // vitalOcean
   * ```
   */
  function getRandomGradient() {
    const keys = Object.keys(GRADIENT_SWATCHES);
    return keys[Math.floor(Math.random() * keys.length)];
  }
  /**
   * Gets the corresponding swatches for a pre-defined or random gradient.
   * By default, if a `gradient` is not specified, it will try to return the
   * swatches corresponding to the gradient defined in `App.options`. 
   * If gradient it equals `random`, is `undefined`, or doesn't exist on the 
   * `GRADIENT_SWATCHES` object it will return a random swatch.
   * @param {string} [gradient] - The gradient name from which to get the swatches.
   * @return {string[]} - An array with both color swatches of the gradient.
   * 
   * @example
   *
   * ```js
   * const [colorA, colorB] = App.getSwatches('vitalOcean');
   * console.log(colorA, colorB);
   * // '#1CB5E0', '#000851'
   * ```
   */
  function getSwatches(gradient) {
    gradient || (gradient = self.options.gradient);

    if (gradient === undefined || gradient === 'random' || GRADIENT_SWATCHES[gradient] === undefined) {
      gradient = getRandomGradient();
    }
    return GRADIENT_SWATCHES[gradient];
  }
}