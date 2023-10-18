const isApp = () => {
  if (/(sephora\/app)/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true;
  }
  return false;
};

export default isApp;
