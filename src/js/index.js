import 'simplebar';
import 'simplebar/dist/simplebar.css';
import ClipboardJS from 'clipboard';
import './plugins.js';
import App from './app.js';

const app = window.app = App();

app.ready(function () {
  // Set the font-size on the HTML Element. This will modify how all
  // the elements sized with REM units look.
  app.setFontSize(app.$html, app.options.size);

  // Set the window padding
  const { padding } = app.options;
  app.setPadding(app.$body, padding + 'rem');
  app.setHeight(app.$window, `calc(100vh - ${2 * padding}rem)`);
  app.setHeight(app.$content, `calc(100vh - ${3 + padding}rem)`);
  app.setWidth(app.$content, `calc(100vw - ${2 * padding + 1}rem)`);

  // Remove border-radius if paddign is 0
  if (padding === 0) {
    app.setBorderRadius(app.$window, 0);
    app.setBorderRadius(app.$taskbar, 0);
  }

  // Set the background gradient.
  const { gradientRot } = app.options;
  const [colorA, colorB] = app.getSwatches();
  const gradient = `linear-gradient(${gradientRot}deg, ${colorA} 0%, ${colorB} 100%)`;
  app.setBackground(app.$body, gradient);

  // Set the window title
  const { title } = app.options;
  if (title !== undefined) {
    app.setText(app.$title, title);
  }

  // Add all the commands and outputs
  const html = app.createCommandsAndOutputs();
  app.setInnerHTML(app.$content, html);

  // Add the prompt if the `prompt` flag is set or an output is defined
  if (!!app.options.prompt) {
    app.setClassName(app.$content, 'prompt');
  }

  // Fit the lines to the size of the window if the `fit` flag is set.
  if (!!app.options.fit) {
    if (app.$content.offsetWidth > app.getCommandsMaxWidth()) {
      console.log('The content is bigger than the commands');
      app.increaseFontSizeRecursively();
    } else {
      console.log('The content is smaller than the commands');
      app.reduceFontSizeRecursively();
    }
  }

  // Setup ClipboardJS
  const {commands, outputs} = app.options;
  app.$close.dataset['clipboardText'] = commands.map((c, i) => [c, outputs[i]].join('\n')).join('\n');
  app.clipboard = new ClipboardJS('.clipboard');
});