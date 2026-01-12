// @ts-nocheck
export function getAppUrl(): string {
  let url = '';
  let backendPort = 4466;
  let useLocalhost = false;
  if (isElectron()) {
    if (window?.headlampBackendPort) {
      backendPort = window.headlampBackendPort;
    }
    useLocalhost = true;
  }
  if (isDevMode()) {
    useLocalhost = true;
  }
  if (isDockerDesktop()) {
    backendPort = 64446;
    useLocalhost = true;
  }
  if (useLocalhost) {
    url = `http://localhost:${backendPort}`;
  } else {
    url = window.location.origin;
  }
  const baseUrl = getBaseUrl();
  url += baseUrl ? baseUrl + '/' : '/';
  return url;
}