export function fixupLocalUrl(url) {
  if (url.substring(0, 10) === 'undefined/') {
    url = url.substring(9);
  }
  return url;
}

export function getPrefixUrl(url) {
  const matches = url.match(/[a-z0-9]+$/i);
  return url.substr(0, matches['index']);
}
