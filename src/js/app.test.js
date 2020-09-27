const App = require('./app.js');

const GRADIENTS = [
  'vitalOcean',
  'kaleSalad',
  'discoClub',
  'shadyLane',
  'retroWagon',
  'frescoCrush',
  'cucumberWater',
  'seaSalt',
  'parFour',
  'ooeyGooey',
  'bloodyMimosa',
  'lovelyLilly',
  'aquaSpray',
  'melloYellow',
  'dustyCactus',
];

const SWATCHES = {
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
};

const PRIMITIVES = [
  undefined,
  null,
  '1',
  1,
  false,
  {},
  [],
];

describe('App', () => {

  test('should be defined', () => {
    expect(App).toBeDefined();
  });

  test('should create a new app instance without errors', () => {
    expect(() => App()).not.toThrow();
  });

  describe('ready()', () => {

    test('should be defined', () => {
      const app = App();
      expect(app.ready).toBeDefined();
    });

    test('should call the init function', () => {
      const app = App();
      app.init = jest.fn();
      app.ready(() => {});
      expect(app.init).toHaveBeenCalled();
    });

    test('should call the callback function', () => {
      const app = App();
      const callback = jest.fn();
      app.ready(callback);
      expect(callback).toHaveBeenCalled();
    });

  });

  describe('init()', () => {
    let app;

    beforeEach(() => {
      app = App();
    });
    
    test('should be defined', () => {
      expect(app.init).toBeDefined();
    });

    test('should not throw an error when called without a callback', () => {
      expect(() => app.init()).not.toThrow();
    });

    test('should call the getOptions function', () => {
      app.getOptions = jest.fn();
      app.init(() => {});
      expect(app.getOptions).toHaveBeenCalled();
    });

    test('should call the callback function', () => {
      const callback = jest.fn();
      app.init(callback);
      expect(callback).toHaveBeenCalled();
    });

    test('should remove the overlay if defined', () => {
      document.body.innerHTML = `<div id="overlay"></div>`;
      const app = App();
      app.init();
      expect(document.body.innerHTML).toBe("");
    });

    test('should set a reference to all the required HTML elements', () => {
      document.body.innerHTML = `
        <div id="window">
          <div id="taskbar">
            <div class="buttons">
              <div class="close"></div>
              <div class="minimize"></div>
              <div class="maximize"></div>
            </div>
            <div class="title"></div>
          </div>
          <div id="content" data-simplebar></div>
        </div>      
      `;
      const app = App();
      app.init();
      expect(isElement(app.$html)).toBe(true);
      expect(isElement(app.$body)).toBe(true);
      expect(isElement(app.$window)).toBe(true);
      expect(isElement(app.$taskbar)).toBe(true);
      expect(isElement(app.$title)).toBe(true);
      expect(isElement(app.$content)).toBe(true);
    });

  });

  describe('isElement()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.isElement).toBeDefined();
    });

    test('should return true if the input is an HTML element', () => {
      expect(app.isElement(document.body)).toBe(true);
    });

    test('should return false if the input is anything but an HTML element', () => {
      expect(PRIMITIVES.every(x => isElement(x) === false)).toBe(true);
    });

  })

  describe('getOptions()', () => {
    let app;

    test('should not fail if a search string is not defined', () => {
      expect(() => App().getOptions()).not.toThrow();
    });

    test('should create the options object with an empty `commands` array', () => {
      const app = App()
      app.getOptions();
      expect(app.options.commands.length).toBe(0);
    });

    test('should create the options object with an empty `outputs` array', () => {
      const app = App()
      app.getOptions();
      expect(app.options.outputs.length).toBe(0);
    });

    test('should not fail with the most basic configuration', () => {
      setLocationSearch('?commands=dGVzdA');
      const app = App();
      expect(() => app.getOptions()).not.toThrow();
    });

    test('should parse the `commands` options as a list of strings', () => {
      setLocationSearch('?commands=dGVzdA,dGVzdA,dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.commands.length).toBe(3);
    });

    test('should parse the `outputs` options as a list of strings', () => {
      setLocationSearch('?commands=dGVzdA&outputs=dGVzdA,dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.commands.length).toBe(1);
      expect(app.options.outputs.length).toBe(2);
    });

    test('should convert the `size` option to a number', () => {
      setLocationSearch('?size=1&commands=dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.size).toBe(1);
    });
    
    test('should convert the `minSize` option to a number', () => {
      setLocationSearch('?minSize=1&commands=dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.minSize).toBe(1);
    });

    test('should convert the `maxSize` option to a number', () => {
      setLocationSearch('?maxSize=1&commands=dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.maxSize).toBe(1);
    });

    test('should convert the `padding` option to a number', () => {
      setLocationSearch('?padding=1&commands=dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.padding).toBe(1);
    });

    test('should convert the `title` option to a string', () => {
      setLocationSearch('?title=dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.options.title).toBe("test");
    });
  });

  describe('getRandomGradient()', () => {
    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.getRandomGradient).toBeDefined();
    });

    test('should return an string', () => {
      expect(typeof app.getRandomGradient() === 'string').toBe(true);
    });

    test('should be one of the predefined gradients', () => {
      const actual = app.getRandomGradient();
      expect(GRADIENTS.includes(actual)).toBe(true);
    });

  });

  describe('getSwatches()', () => {
    let app;
    const gradient = GRADIENTS[0];

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.getSwatches).toBeDefined();
    });

    test('should not fail if given a non existant gradient', () => {
      expect(() => app.getSwatches('non existing gradient')).not.toThrow();
    });

    test('should return an array', () => {
      expect(Array.isArray(app.getSwatches(gradient))).toBe(true);
    });

    test('should return an array with only two string', () => {
      const actual = app.getSwatches(gradient);
      expect(actual.length).toBe(2);
      expect(actual.every(string => typeof string === 'string')).toBe(true);
    });

    test('should return an array of two hexadecimal colors', () => {
      const actual = app.getSwatches(gradient);
      expect(actual.length).toBe(2);
      expect(actual.every(isHex)).toBe(true);
    });

    test('should return a valid array of hexadecimal colors for each existing gradient', () => {
      for (let gradient of GRADIENTS) {
        let actual = app.getSwatches(gradient);
        expect(actual).toEqual(SWATCHES[gradient]);
      }
    });

    test('should use the `gradient` option if gradient is undefined', () => {
      const expected = 'cucumberWater';
      setLocationSearch(`?gradient=${ expected }`);
      const app = App();
      app.getOptions();
      const actual = app.getSwatches();
      expect(actual).toEqual(SWATCHES[expected]);
    });
    
  });

  describe('getFontSize', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.getFontSize).toBeDefined();
    });

    test('should return the font size of an element', () => {
      const expected = '12px';
      document.body.style.fontSize = expected;
      expect(app.getFontSize(document.body)).toBe(expected);
    });

  })

  describe('createStyleSetter()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.createStyleSetter).toBeDefined();
    });

    test('should return a function', () => {
      expect(typeof app.createStyleSetter('something')).toBe('function');
    });

  });

  describe('createStyleGetter()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.createStyleGetter).toBeDefined();
    });

    test('should return a function', () => {
      expect(typeof app.createStyleGetter('something')).toBe('function');
    });

  });

  describe('setFontSize()', () => {
    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setFontSize).toBeDefined();
    });

    test('should set the font size of an element', () => {
      const expected = 100;
      app.setFontSize(document.body, expected);
      expect(document.body.style.fontSize).toBe(expected + 'px');
    });

  });

  describe('setPadding()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setPadding).toBeDefined();
    });

    test('should set the padding of an element', () => {
      const expected = '1em';
      app.setPadding(document.body, expected);
      expect(document.body.style.padding).toEqual(expected);
    });

  });

  describe('setHeight()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setHeight).toBeDefined();
    });

    test('should set the height of an element', () => {
      const expected = '100px';
      app.setHeight(document.body, expected);
      expect(document.body.style.height).toEqual(expected);
    });

  });

  describe('setWidth()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setWidth).toBeDefined();
    });

    test('should set the width of an element', () => {
      const expected = '100px';
      app.setWidth(document.body, expected);
      expect(document.body.style.width).toEqual(expected);
    });

  });

  describe('setBorderRadius()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setBorderRadius).toBeDefined();
    });

    test('should set the borderRadius of an element', () => {
      const expected = '50%';
      app.setBorderRadius(document.body, expected);
      expect(document.body.style.borderRadius).toEqual(expected);
    });

  });

  describe('setBackground()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setBackground).toBeDefined();
    });

    test('should set the background of an element', () => {
      const expected = 'rgb(255, 255, 255)';
      app.setBackground(document.body, expected);
      expect(document.body.style.background).toEqual(expected);
    });

  });

  describe('setText()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setText).toBeDefined();
    });

    test('should set the text of an element', () => {
      const expected = 'Hello World!';
      app.setText(document.body, expected);
      expect(document.body.textContent).toEqual(expected);
    });

  });

  describe('setInnerHTML()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setInnerHTML).toBeDefined();
    });

    test('should set the innerHTML of an element', () => {
      const expected = '<div id="main"></div>';
      app.setInnerHTML(document.body, expected);
      expect(document.body.innerHTML).toEqual(expected);
    });

  });

  describe('setClassName()', () => {

    let app;

    beforeEach(() => {
      app = App();
    });

    test('should be defined', () => {
      expect(app.setClassName).toBeDefined();
    });

    test('should set the className of an element', () => {
      const expected = 'test-class';
      app.setClassName(document.body, expected);
      expect(document.body.className).toEqual(expected);
    });

  });

  describe('createCommandsAndOutputs()', () => {

    beforeEach(() => {
      global.window.Prism = {
        highlight: jest.fn((x) => `<div class="highlight">${ x }</div>`),
        languages: {
          bash: jest.fn(),
        }
      };
    })

    test('should be defined', () => {
      const app = App();
      expect(app.createCommandsAndOutputs).toBeDefined();
    });

    test('should not throw an error if no arguments are given', () => {
      const app = App();
      expect(() => app.createCommandsAndOutputs()).not.toThrow();
    });

    test('should return an empty string if `commands` is undefined', () => {
      const app = App();
      expect(app.createCommandsAndOutputs({commands: undefined})).toBe('');
    });

    test('should return an empty string if `commands` is an empty list', () => {
      const app = App();
      expect(app.createCommandsAndOutputs({commands: []})).toBe('');
    });

    test('should return a string if `commands` is not an empty list', () => {
      const app = App();
      const actual = app.createCommandsAndOutputs({commands: ['test']});
      expect(typeof actual).toBe('string');
      expect(actual.length > 0).toBe(true);
    });

    test('should get the `commands` value from the `app.options` object if no override is defined', () => {
      setLocationSearch('?commands=dGVzdA');
      const app = App();
      app.getOptions();
      expect(app.createCommandsAndOutputs()).toBe('<pre class="command"><code>test</code></pre>');
    });

    test('should get the `outputs` value from the `app.options` object if no override is defined', () => {
      setLocationSearch('?commands=dGVzdA&outputs=dGVzdA');
      const app = App();
      app.getOptions();
      const expected = '<pre class="command"><code>test</code></pre><pre class="output">test</pre>'
      expect(app.createCommandsAndOutputs()).toBe(expected);
    });

    test('should use the override outputs if defined', () => {
      setLocationSearch('?commands=dGVzdA&outputs=dGVzdA');
      const app = App();
      app.getOptions();
      const expected = '<pre class="command"><code>test</code></pre><pre class="output">override</pre>'
      expect(app.createCommandsAndOutputs({outputs: ['override']})).toBe(expected);
    });

    test('should call the Prism.highlight function if the `highlight` flag is set on the `app.options` object', () => {
      setLocationSearch('?commands=dGVzdA&highlight=true');
      const app = App();
      app.getOptions();
      app.createCommandsAndOutputs();
      expect(global.window.Prism.highlight).toHaveBeenCalled();
    });

    test('should call the Prism.highlight function if the `highlight` flag is set on the `overrides` object', () => {
      setLocationSearch('?commands=dGVzdA');
      const app = App();
      app.getOptions();
      app.createCommandsAndOutputs({highlight: true});
      expect(global.window.Prism.highlight).toHaveBeenCalled();
    });

    test('should call the Prism.highlight function for each command', () => {
      setLocationSearch('?commands=dGVzdA&highlight=true');
      const app = App();
      app.getOptions();
      app.createCommandsAndOutputs({commands: ['1', '2']});
      expect(global.window.Prism.highlight).toHaveBeenCalledTimes(2);
    });

    test('should highlight the commands if the highlight flag is set on the `app.options` object', () => {
      setLocationSearch('?commands=dGVzdA&highlight=true');
      const app = App();
      app.getOptions();
      const expected = '<pre class="command"><code><div class="highlight">test</div></code></pre>'
      expect(app.createCommandsAndOutputs()).toBe(expected);
    });

  });

  describe('getCommandsMaxWidth()', () => {

    test('should be defined', () => {
      const app = App();
      expect(app.getCommandsMaxWidth).toBeDefined();
    });

    test('should return 0 if there are no commands', () => {
      const app = App();
      app.ready();
      expect(app.getCommandsMaxWidth()).toBe(0);
    });

    test('should return the maximum width of all the commands elements', () => {
      document.querySelectorAll = jest.fn(() => [
        { offsetWidth: 1000 },
        { offsetWidth: 1000 - 1 },
      ]);
      const app = App();
      app.ready();
      expect(app.getCommandsMaxWidth()).toBe(1000);
    });

  });

  describe('reduceFontSizeRecursively()', () => {
    let app, spy;
    
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="window">
          <div id="taskbar">
            <div class="buttons">
              <div class="close"></div>
              <div class="minimize"></div>
              <div class="maximize"></div>
            </div>
            <div class="title"></div>
          </div>
          <div id="content" data-simplebar></div>
        </div>
      `;
      app = App();
      app.ready();
      const codeWidths = [2000, 200, 20];
      let i = 0;
      app.options.minSize = 1;
      app.getCommandsMaxWidth = jest.fn(() => i > 3 ? 20 : codeWidths[i++]);
      spy = jest.spyOn(app, 'reduceFontSizeRecursively');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test('should be defined', () => {
      expect(app.reduceFontSizeRecursively).toBeDefined();
    });

    test('should be called only once if the content width is bigger than the code', () => {
      app.$content = { offsetWidth: 9999 };
      app.reduceFontSizeRecursively();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should be called enough times to make the code smaller than the content width', () => {
      app.$content = { offsetWidth: 100 };
      app.reduceFontSizeRecursively();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    test('should return if the fontSize is equal to the minSize', () => {
      app.$content = { offsetWidth: 100 };
      app.options.minSize = app.options.size;
      app.reduceFontSizeRecursively();
      expect(spy).toHaveBeenCalledTimes(1);
    });

  });

  describe('increaseFontSizeRecursively()', () => {
    let app, spy;
    
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="window">
          <div id="taskbar">
            <div class="buttons">
              <div class="close"></div>
              <div class="minimize"></div>
              <div class="maximize"></div>
            </div>
            <div class="title"></div>
          </div>
          <div id="content" data-simplebar></div>
        </div>
      `;
      app = App();
      app.ready();
      const codeWidths = [20, 200, 20000];
      let i = 0;
      app.options.maxSize = 9999;
      app.getCommandsMaxWidth = jest.fn(() => i > 3 ? 2000 : codeWidths[i++]);
      spy = jest.spyOn(app, 'increaseFontSizeRecursively');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test('should be defined', () => {
      expect(app.increaseFontSizeRecursively).toBeDefined();
    });

    test('should be called only once if the content width is bigger than the code', () => {
      app.$content = { offsetWidth: 1 };
      app.increaseFontSizeRecursively();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should be called enough times to make the code as big as the content width', () => {
      app.$content = { offsetWidth: 2000 };
      app.increaseFontSizeRecursively();
      expect(spy).toHaveBeenCalledTimes(3);
    });

    test('should return if the fontSize is equal to the maxSize', () => {
      app.$content = { offsetWidth: 2000 };
      app.setFontSize(app.$html, 18);
      app.options.maxSize = app.options.size;
      app.increaseFontSizeRecursively();
      expect(spy).toHaveBeenCalledTimes(1);
    });

  });

});

function setLocationSearch(search) {
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = { search };
}

function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;  
}

function isHex(string) {
  return new RegExp(/[0-9A-Fa-f]{6}/g).test(string);
}