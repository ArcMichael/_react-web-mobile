const isDevice = (string) => {
  if (string) {
    if (/(micromessenger|webbrowser)/.test(string.toLocaleLowerCase())) {
      return "wechat";
    }
    if (/(sephora\/app)/.test(string.toLocaleLowerCase())) {
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
