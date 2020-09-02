import 'simplebar/dist/simplebar.css';
import './constants.js';
import SimpleBar from 'simplebar';
import getQueryParameters from './getQueryParameters.js';

(function ready(fn) {
  try {
    if (document.readyState != 'loading') fn(); 
    else document.addEventListener('DOMContentLoaded', fn);
  } catch (err) {
    console.error(err);
  }
})(function() {
  const options = { ...window.DEFAULTS, ...getQueryParameters() };
 
  setRemSize(options);
  setBackground(options);
  setCode(options);
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
  const content$ = document.querySelector('.content');
  
  code$.innerHTML = Prism.highlight(atob(text), Prism.languages.bash, 'bash');
  new SimpleBar(content$);
}