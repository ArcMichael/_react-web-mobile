const isIOS = () => {
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export default isIOS;
