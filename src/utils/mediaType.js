export function isVideoUrl(url = "") {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(String(url));
}
