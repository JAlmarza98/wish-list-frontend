#!/bin/sh
# Genera public/config/env.js a partir de la variable de entorno API_URL,
# para que la misma imagen sirva para cualquier dominio sin reconstruirla.
set -e

cat > /usr/share/nginx/html/config/env.js <<EOF
window.__env = {
  apiUrl: "${API_URL:-}"
};
EOF
