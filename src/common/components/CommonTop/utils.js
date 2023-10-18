export default class Utils {
  static isAllowScroll() {
    const AllowScrollPages = [
      "/",
      "/v2/html/nichefragrance",
      "/myAccount/returnList",
      "/myAccount/myMessage",
      "/myAccount/offlineOrder",
    ];
    let isAllow = false;
    if (AllowScrollPages.indexOf(window.location.pathname) > -1) isAllow = true;
    return isAllow;
  }
}
