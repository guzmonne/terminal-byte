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
  const text = `gcloud compute forwarding-rules create kubernetes-forwarding-rule \\
  --address KUBERNETES_PUBLIC_ADDRESS \\
  --ports 6443 \\
  --region $(gcloud config get-value compute/region) \\
  --target-pool kubernetes-target-pool`
  const el$ = document.querySelector('pre code')
  el$.innerHTML = Prism.highlight(text, Prism.languages.bash, 'bash');  //sanitize(text);
  new SimpleBar(document.querySelector('.content'));
});

function getQueryParameters() {
  var search = location.search.substring(1);
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}