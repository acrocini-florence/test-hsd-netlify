export function toAbsoluteUrl(url: string) {
  return /^http(s)?:\/\//.test(url) ? url : `${window.location.origin}${url}`;
}
