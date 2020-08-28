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
  const text = `{

    cat > ca-config.json <<EOF
    {
      "signing": {
        "default": {
          "expiry": "8760h"
        },
        "profiles": {
          "kubernetes": {
            "usages": ["signing", "key encipherment", "server auth", "client auth"],
            "expiry": "8760h"
          }
        }
      }
    }
    EOF
    
    cat > ca-csr.json <<EOF
    {
      "CN": "Kubernetes",
      "key": {
        "algo": "rsa",
        "size": 2048
      },
      "names": [
        {
          "C": "US",
          "L": "Portland",
          "O": "Kubernetes",
          "OU": "CA",
          "ST": "Oregon"
        }
      ]
    }
    EOF
    
    cfssl gencert -initca ca-csr.json | cfssljson -bare ca
    
    }`
  
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