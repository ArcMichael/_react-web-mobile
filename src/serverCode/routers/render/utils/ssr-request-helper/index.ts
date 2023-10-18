import { RouterIndexParams } from "../getRouterIndex";
import { FetchlistItem } from "../getSyncList";

export default class SsrRequestHelper {
  static getHomepageList(params: RouterIndexParams, gateway: string) {
    let list: FetchlistItem[] = [];
    const url = gateway;
    const { index, routeParams } = params;
    if (index === "homepage" || index === "Index") {
      // tab页的ssr
      if (routeParams && routeParams.tab && routeParams.tab !== "select") {
        list = list.concat([
          {
            content: `homepage.tabDatas.${routeParams.tab.toUpperCase()}.session1`,
            url: `http://${url}/v1/mpcms/tabs/${routeParams.tab}/sections/first?channel=MOBILE`,
            params: {
              method: "GET",
              body: {},
              timeout: params.timeout,
            },
          },
          {
            content: `homepage.tabDatas.${routeParams.tab.toUpperCase()}.session2`,
            url: `http://${url}/v1/mpcms/tabs/${routeParams.tab}/sections/second?channel=MOBILE`,
            params: {
              method: "GET",
              body: {},
              timeout: params.timeout,
            },
          },
        ]);
      }
    }

    list = list.concat([
      {
        content: "homepage.session1",
        url: `http://${url}/v1/mpcms/tabs/select/sections/first?channel=MOBILE`,
        params: {
          method: "GET",
          body: {},
          timeout: params.timeout,
        },
      },
      {
        content: "homepage.topBrand",
        url: `http://${url}/v1/es/brandWall/getTopBrand`,
        params: {
          method: "GET",
          body: {},
          timeout: params.timeout,
        },
      },
    ]);

    list.push({
      content: "homepage.TabList",
      url: `http://${url}/v1/mpcms/common/mobile/top/tabcatalog?channel=MOBILE`,
      params: {
        method: "GET",
        body: {},
        timeout: params.timeout,
      },
    });

    return list;
  }
}
