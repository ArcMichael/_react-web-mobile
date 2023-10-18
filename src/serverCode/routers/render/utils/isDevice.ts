const isDevice = (str?: string) => {
  if (str) {
    if (/(micromessenger|webbrowser)/.test(str.toLocaleLowerCase())) {
      return "wechat";
    }
    if (/(sephora\/app)/.test(str.toLocaleLowerCase())) {
      return "app";
    }
  } else {
    if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) {
      return "wechat";
    }
    if (/(sephora\/app)/.test(navigator.userAgent.toLocaleLowerCase())) {
      return "app";
    }
  }

  return "mobile";
};

export default isDevice;
