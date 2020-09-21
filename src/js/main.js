import 'simplebar/dist/simplebar.css';
import SimpleBar from 'simplebar';
import './constants.js';
import getQueryParameters from './getQueryParameters.js';

(function ready(fn) {
  try {
    if (document.readyState != 'loading') fn(); 
    else document.addEventListener('DOMContentLoaded', fn);
  } catch (err) {
    console.error(err);
  }
})(function() {
  const options = getQueryParameters();
 
  setRemSize(options);
  setBackground(options);
  setCode(options);
  fitLinesSize(options);
  setSimpleBar();
  window.addEventListener('resize', fitLinesSize);
});

function setRemSize({ size }) {
  document.querySelector('html').style.fontSize = size + 'px';
}

function setBackground({ gradient, gradientRot }) {
  if (gradient === 'random') {
    const keys = Object.keys(GRADIENT_SWATCHES);
    gradient = keys[Math.floor(Math.random() * keys.length)];
  }
  const [colorA, colorB] = GRADIENT_SWATCHES[gradient];
  document.body.style.background = `linear-gradient(${gradientRot}deg, ${colorA} 0%, ${colorB} 100%)`;
}

function setCode({ text }) {
  const code$ = document.querySelector('pre code');
  
  code$.innerHTML = Prism.highlight(atob(text), Prism.languages.bash, 'bash');
}

function setSimpleBar() {
  const content$ = document.querySelector('.content');
  
  new SimpleBar(content$);
}

function fitLinesSize(options) {
  const { linesWidth, commandWidth } = getWidths();
  if (linesWidth > commandWidth) {
    shrinkLines(options);
  } else {
    growLines(options);
  }
}

function shrinkLines(options) {
  const { linesWidth, commandWidth } = getWidths();
  if (linesWidth < commandWidth) return;
  const { size, minSize } = options;
  const code$ = document.querySelector('.lines code');
  const fontSize = parseInt(code$.style.fontSize, 10);
  if (isNaN(fontSize)) {
    console.log('fontSize is empty');
    code$.style.fontSize = size + 'px';
  } else if ( fontSize > minSize ) {
    console.log('fontSize is too big');
    code$.style.fontSize = (fontSize - 1) + 'px';
  } else {
    console.log(`fontSize ${fontSize} is smaller or equal to minSize ${minSize}`);
    return;
  }
  shrinkLines(options);
}

function getWidths() {
  const command$ = document.querySelector('.command');
  const lines$ = document.querySelector('.lines');
  const commandWidth = getWidth(command$);
  const linesWidth = getWidth(lines$);
  return {linesWidth, commandWidth};
}

function getWidth(el) {
  return parseFloat(getComputedStyle(el, null).width.replace("px", ""));
}