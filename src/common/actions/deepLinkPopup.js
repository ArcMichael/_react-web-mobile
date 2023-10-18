import * as action from "../lib/BLL";

export const getAppVersion = (callback) => () => {
  new Promise((res) => {
    action.advertTxt({ queryBody: { locationLabel: "MOBILE:APPVERSION" } }, (json) => {
      if (json && json.results) res(json.results);
    });
  }).then((results) => {
    if (
      results.resourceList &&
      Array.isArray(results.resourceList) &&
      results.resourceList.length > 0 &&
      results.resourceList[0].content
    ) {
      callback && callback(results.resourceList[0].content);
    }
  });
};
