export function urlPathGoThrough(url) {
  const getUrl = url || '';
  const position = url.indexOf('.cn') || url.indexOf('.com') || url.indexOf('.html');
  if (url.indexOf('tel') > -1) return true;
  if (position !== -1) {
    switch (getUrl.slice(0, position + 3)) {
      case 'http://wx.sephora.cn':
        return true;
      case 'https://wx.sephora.cn':
        return true;
      case 'http://careers.sephora.cn':
        return true;
      case 'https://careers.sephora.cn':
        return true;
      case 'https://m.sephora.cn':
        return true;
      case 'http://v2/html5/online-booking-app/index.html':
        return true;
      case 'https://v2/html5/online-booking-app/index.html':
        return true;
      case 'http://ebfm.sephora.cn':
        return true;
      case 'https://ebfm.sephora.cn':
        return true;
      default:
        break;
    }
  }
}
