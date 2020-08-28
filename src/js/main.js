import 'simplebar/dist/simplebar.css';
import SimpleBar from 'simplebar';

(function ready(fn) {
  try {
    if (document.readyState != 'loading') fn(); 
    else document.addEventListener('DOMContentLoaded', fn);
  } catch (err) {
    console.error(err);
  }
})(function() {
  const query = getQueryParameters();
  const text = JSON.stringify(query, null, 2);
  const el$ = document.querySelector('.line')
  el$.innerHTML = sanitize(text);
  new SimpleBar(document.querySelector('.content'));
});

function sanitize(text) {
  return text.split('\n').map(line => {
    line = line.replace(/ /g, '&nbsp;')
    line = `<div class="segment">${line}</div>`;
    return line;
  }).join('');
}

function getQueryParameters() {
  var search = location.search.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}