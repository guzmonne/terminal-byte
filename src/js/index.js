import 'simplebar';
import 'simplebar/dist/simplebar.css';
import './plugins.js';

const app = window.app = App();

app.ready(function () {
  // Set the font-size on the HTML Element. This will modify how all
  // the elements sized with REM units look.
  document.querySelector('html').style.fontSize = app.options.size + 'px';

  // Set the window padding
  const { padding } = app.options;
  app.$body.style.padding = padding + 'rem';
  app.$window.style.height = `calc(100vh - ${2 * padding}rem)`;
  app.$content.style.height = `calc(100vh - ${3 + padding}rem)`;
  app.$content.style.width = `calc(100vw - ${2 * padding + 1}rem)`

  // Remove border-radius if paddign is 0
  if (padding === 0) {
    app.$window.style.borderRadius = 0;
    app.$taskbar.style.borderRadius = 0;
  }

  // Set the background gradient.
  const { gradientRot } = app.options;
  const [colorA, colorB] = app.getSwatches();
  document.body.style.background = `linear-gradient(${gradientRot}deg, ${colorA} 0%, ${colorB} 100%)`;

  // Set the window title
  const { title } = app.options;
  if (title !== undefined) {
    app.$title.textContent = title;
  }

  // Apply highlights to the code if the `highlight` flag is defined.
  const { commands, outputs, highlight } = app.options;
  function highlightCommand(text) {
    return !!highlight
      ? Prism.highlight(text, Prism.languages.bash, 'bash')
      : text
  }
  for (let i = 0; i < commands.length; i++) {
    const html = `
<pre class="command"><code>${highlightCommand( commands[i] )}</code></pre>
${!!outputs[i] ? `<pre class="output">${ outputs[i] }</pre>` : ''}
`;
    app.$content.innerHTML = app.$content.innerHTML + html;
  }

  // Add the output if defined
  if (!!app.options.output) {
    app.$output.textContent = app.options.output;
  }

  // Fit the lines to the size of the window if the `fit` flag is set.
  if (!!app.options.fit) {
    if (app.$code.offsetWidth > app.$content.offsetWidth) {
      shrinkLines();
    } else {
      expandLines();
    }
  }

  // Add the prompt if the `prompt` flag is set or an output is defined
  if (!!app.options.prompt) {
    app.$content.className = 'prompt';
  }
});

function shrinkLines() {
  const { size, minSize } = app.options;
  const fontSize = parseInt(app.$html.style.fontSize, 10);
  if (app.$code.offsetWidth <= app.$content.offsetWidth) {
    return;
  }
  if (isNaN(fontSize)) {
    app.$html.style.fontSize = size + 'px';
  } else if (fontSize > minSize) {
    app.$html.style.fontSize = (fontSize - 1) + 'px';
  } else {
    app.$html.style.fontSize = (fontSize + 1) + 'px';
    return;
  }
  shrinkLines();
}

function expandLines() {
  const { size, maxSize } = app.options;
  const fontSize = parseInt(app.$html.style.fontSize, 10);
  if (app.$code.offsetWidth >= app.$content.offsetWidth) {
    app.$html.style.fontSize = (fontSize - 1) + 'px';
    return;
  }
  if (isNaN(fontSize)) {
    app.$html.style.fontSize = size + 'px';
  } else if (fontSize < maxSize) {
    app.$html.style.fontSize = (fontSize + 1) + 'px';
  } else {
    app.$html.style.fontSize = (fontSize - 1) + 'px';
    return;
  }
  expandLines();
}

/**
 * @class
 * Main application global object.
 */
function App() {
  const DEFAULT_OPTIONS = {
    minSize: 12,
    size: 18,
    maxSize: 36,
    gradient: 'random',
    gradientRot: Math.round(Math.random() * 180, 0),
    highlight: false,
    fit: false,
    padding: 2.5,
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
  // Self object
  const self = {
    init,
    ready,
    getOptions,
    getRandomGradient,
    getSwatches,
  };
  
  // Return
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
    if (search === '') {
      self.options = {...DEFAULT_OPTIONS};
      return;
    }
    const query = {...DEFAULT_OPTIONS, ...JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') };
    if (typeof query.size === 'string')    query.size    = parseInt(query.size, 10);
    if (typeof query.minSize === 'string') query.minSize = parseInt(query.minSize, 10);
    if (typeof query.maxSize === 'string') query.maxSize = parseInt(query.maxSize, 10);
    if (typeof query.padding === 'string') query.padding = parseInt(query.padding, 10);
    if (query.commands !== undefined)      query.commands = query.commands.split(',').map(atob);
    if (query.outputs !== undefined)       query.outputs  = query.outputs.split(',').map(atob);
    if (query.title !== undefined)         query.title   = atob(query.title);
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
    if (self.$window === undefined)  self.$window = document.getElementById('window');
    if (self.$taskbar === undefined) self.$taskbar = document.getElementById('taskbar');
    if (self.$title === undefined)   self.$title = document.querySelector('#taskbar .title');
    if (self.$content === undefined) self.$content = document.getElementById('content')
    if (self.$command === undefined) self.$command = document.getElementById('command');
    if (self.$output === undefined)  self.$output = document.getElementById('output');
    if (self.$code === undefined)    self.$code = document.querySelector('#command code');
    if (self.options === undefined)  self.getOptions();
    if (callback !== undefined)      callback();
    // Now that the app is ready remove the overlay
    const $overlay = document.getElementById('overlay');
    if ($overlay !== undefined) $overlay.parentNode.removeChild($overlay);
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