const text = `kubectl config set-context gce \\
  --user=cluster-admin \\
  --namespace=foo \\
  && kubectl config use-context gce`

document.querySelector('.line').innerHTML = sanitize(text);

function sanitize(text) {
  return text.split('\n').map(line => {
    line = line.replace(/ /g, '&nbsp;')
    line = `<div class="segment">${line}</div>`;
    return line;
  }).join('');
}