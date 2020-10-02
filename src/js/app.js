exports = module.exports = App;
/**
 * @class
 * Main application global object.
 */
function App() {
  const DEFAULT_OPTIONS = {
    minSize:     12,
    size:        18,
    maxSize:     36,
    gradient:    'random',
    gradientRot: Math.round(Math.random() * 180, 0),
    highlight:   false,
    fit:         false,
    padding:     2.5,
    commands:    [],
    outputs:     [],
  };
  
  const GRADIENT_SWATCHES = {
    vitalOcean:    ['#1CB5E0', '#000851'],
    kaleSalad:     ['#00C9FF', '#92FE9D'],
    discoClub:     ['#FC466B', '#3F5EFB'],
    shadyLane:     ['#3F2B96', '#A8C0FF'],
    retroWagon:    ['#FDBB2D', '#22C1C3'],
    frescoCrush:   ['#FDBB2D', '#3A1C71'],
    cucumberWater: ['#e3ffe7', '#d9e7ff'],
    seaSalt:       ['#4b6cb7', '#182848'],
    parFour:       ['#9ebd13', '#008552'],
    ooeyGooey:     ['#0700b8', '#00ff88'],
    bloodyMimosa:  ['#d53369', '#daae51'],
    lovelyLilly:   ['#efd5ff', '#515ada'],
    aquaSpray:     ['#00d2ff', '#3a47d5'],
    melloYellow:   ['#f8ff00', '#3ad59f'],
    dustyCactus:   ['#fcff9e', '#c67700']
  }
  // Self object
  const self = {
    init,
    ready,
    getOptions,
    getRandomGradient,
    getSwatches,
    getCommandsMaxWidth,
    getFontSize: createStyleGetter('fontSize'),
    setPadding: createStyleSetter('padding'),
    setHeight: createStyleSetter('height'),
    setWidth: createStyleSetter('width'),
    setBorderRadius: createStyleSetter('borderRadius'),
    setBackground: createStyleSetter('background'),
    setFontSize,
    setText,
    setInnerHTML,
    setClassName,
    isElement,
    createStyleSetter,
    createStyleGetter,
    createCommandsAndOutputs,
    reduceFontSizeRecursively,
    increaseFontSizeRecursively,
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
    if (self.options === undefined)  self.getOptions();
    if (callback !== undefined)      callback();
    // Now that the app is ready remove the overlay
    const $overlay = document.getElementById('overlay');
    if ($overlay === undefined || $overlay === null) return;
    $overlay.parentNode.removeChild($overlay);
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
    var search = window.location.search.substring(1);
    if (search === '') {
      self.options = {...DEFAULT_OPTIONS};
      return;
    }
    const query = {...DEFAULT_OPTIONS, ...JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') };
    if (typeof query.size === 'string')    query.size     = parseInt(query.size, 10);
    if (typeof query.minSize === 'string') query.minSize  = parseInt(query.minSize, 10);
    if (typeof query.maxSize === 'string') query.maxSize  = parseInt(query.maxSize, 10);
    if (typeof query.padding === 'string') query.padding  = parseFloat(query.padding, 10);
    if (query.commands !== undefined)      query.commands = Array.isArray(query.commands) ? query.commands : query.commands.split(',').map(atou);
    if (query.outputs !== undefined)       query.outputs  = Array.isArray(query.outputs)  ? query.outputs  : query.outputs.split(',').map(atou);
    if (query.title !== undefined)         query.title    = atou(query.title);
    self.options = query;
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
  /**
   * Checks if the source is an HTML element.
   * @param {any} element - Element source to check.
   * @return {boolean}
   * 
   * @example
   *
   * ```js
   * console.log(app.isElement(document.body))
   * // true
   * console.log(app.isElement(undefined))
   * // false
   * ```
   */
  function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;  
  }
  /**
   * Returns a function to set a style attribute on an HTML element.
   * @param {string} attribute - Style attribute to be set by the function.
   * @return {function} - (element, value) => void
   * 
   * @example
   *
   * ```js
   * const setPadding = app.createStyleSetter('padding');
   * setPadding(document.body, '1rem');
   * console.log(document.body.style.padding);
   * // '1rem'
   * ```
   */
  function createStyleSetter(attribute) {
    return (el, value) => {
      if (!isElement(el)) return;
      el.style[attribute] = value;
    }
  }
  /**
   * Returns a function to get a style attribute from an HTML element.
   * @param {string} attribute - Style attribute to be set by the function.
   * @return {function} - (element) => any
   * 
   * @example
   *
   * ```js
   * const getFontSize = app.createStyleGetter('fontSize');
   * const bodyFontSize = getFontSize(document.body);
   * console.log(bodyFontSize);
   * // '12px'
   * ```
   */
  function createStyleGetter(attribute) {
    return (el) => {
      if (!isElement(el)) return;
      return el.style[attribute];
    }
  }
  /**
   * Sets the font-size of a given element.
   * @param {HTMLElement} el - Element on which to set the font-size.
   * @param {number} size - Font size to set on the $el element.
   * 
   * @example
   *
   * ```js
   * app.setFontSize(document.body, 12);
   * ```
   */
  function setFontSize(el, size) {
    if (!isElement(el)) return;
    el.style.fontSize = size + 'px';
  }
  /**
   * Sets the text of an element.
   * @param {HTMLElement} el - Element on which to set the text.
   * @param {string} value - Value to set on the element.
   * 
   * @example
   *
   * ```js
   * app.setText(document.body, 'Hello World');
   * console.log(document.body.textContent);
   * // 'Hello World'
   * ```
   */
  function setText(el, value) {
    if (!isElement(el)) return;
    el.textContent = value;
  }
  /**
   * Sets the innerHTML of an element.
   * @param {HTMLElement} el - Element on which to set the text.
   * @param {string} value - Value to set on the element.
   * 
   * @example
   *
   * ```js
   * app.setInnerHTML(document.body, '<div></div>');
   * console.log(document.body.innerHTML);
   * // '<div></div>'
   * ```
   */
  function setInnerHTML(el, value) {
    if (!isElement(el)) return;
    el.innerHTML = value;
  }
  /**
   * Sets the className of an element.
   * @param {HTMLElement} el - Element on which to set the text.
   * @param {string} value - Value to set on the element.
   * 
   * @example
   *
   * ```js
   * app.setClassName(document.body, 'example-class');
   * console.log(document.body.className);
   * // 'example-class'
   * ```
   */
  function setClassName(el, value) {
    if (!isElement(el)) return;
    el.className = value;
  }
  /**
   * Creates an HTML string with the commands and outputs correctly formatted.
   * By default, it will take the information from the app.options object. You
   * can override this behaviour by providing your own values through the 
   * `overrides` object.
   * @param {Object} overrides - Overrides object passed.
   * @param {string[]} overrides.commands - List of commands.
   * @param {string[]} overrides.outputs - List of outputs.
   * @param {boolean} overrides.highlight - Flag that indicates if the command 
   *                                        should be highlighted.
   */
  function createCommandsAndOutputs(overrides = {}) {
    const { commands, outputs = [], highlight } = { ...self.options, ...overrides };

    if (commands === undefined || commands.length === 0) return '';

    let html = '';

    for (let i = 0; i < commands.length; i++) {
      const command = !!highlight 
        ? Prism.highlight(commands[i], Prism.languages.bash, 'bash') 
        : commands[i];
      const output = outputs[i];

      if (command !== undefined)
        html += `<pre class="command"><code>${ command }</code></pre>`

      if (output !== undefined)
        html += `<pre class="output">${ output }</pre>`
    }

    return html;
  }
  /**
   * Gets the maximum width being used by the command elements.
   * @return {number}
   * 
   * @example
   *
   * ```js
   * console.log(app.getCommandsMaxWidth());
   * // 1280
   * ```
   */
  function getCommandsMaxWidth() {
    return [...document.querySelectorAll('code')]
      .reduce((acc, x) => acc < x.offsetWidth ? x.offsetWidth : acc, 0);
  }
  /**
   * Reduces the `fontSize` of the `html` element recursively, one pixel
   * at a time, until the width of the `$code` element is less or equal
   * to the width of the `$content` element.
   */
  function reduceFontSizeRecursively() {
    const { size, minSize } = self.options;
    const fontSize = parseInt(self.getFontSize(self.$html), 10) || size;
    if (self.$content.offsetWidth - fontSize > self.getCommandsMaxWidth()) {
      return;
    }
    if (fontSize > minSize) {
      self.setFontSize(self.$html, fontSize - 1);
    } else {
      self.setFontSize(self.$html, fontSize + 1);
      return;
    }
    self.reduceFontSizeRecursively();
  }
  /**
   * Increases the `fontSize` of the `html` element recursively, one pixel
   * at a time, until the width of the `$code` element is less or equal
   * to the width of the `$content` element.
   */
  function increaseFontSizeRecursively() {
    const { size, maxSize } = self.options;
    const fontSize = parseInt(self.getFontSize(self.$html), 10) || size;
    if (self.$content.offsetWidth - fontSize < self.getCommandsMaxWidth()) {
      self.setFontSize(self.$html, fontSize - 1);
      return;
    }
    if (fontSize < maxSize) {
      self.setFontSize(self.$html, fontSize + 1);
    } else {
      self.setFontSize(self.$html, fontSize - 1);
      return;
    }
    self.increaseFontSizeRecursively();
  }
}

/**
 * ASCII to Unicode (decode Base64 to original data)
 * @param {string} b64
 * @return {string}
 */
function atou(b64) {
  return decodeURIComponent(escape(atob(b64)));
}

/**
 * Unicode to ASCII (encode data to Base64)
 * @param {string} data
 * @return {string}
 */
function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)));
}