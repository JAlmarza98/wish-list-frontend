// Sobrescrito al arrancar el contenedor Docker (ver docker-entrypoint.d/30-wishu-env.sh)
// a partir de la variable de entorno API_URL. En desarrollo o si no se
// inyecta nada, se usa el fallback de src/environments/environment*.ts.
window.__env = {
  apiUrl: ''
};
