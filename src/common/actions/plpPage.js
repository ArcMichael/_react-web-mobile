import Utils from "@/lib/utils";
import Sensor from "@/Utils/sensor";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import { PLPPAGE } from "../constants/ActionTypes";
import * as action from "../lib/BLL";

export const initial = (params) => (dispatch) => {
  dispatch(
    action.getPlpPageBrandData({
      onlyKey: "queryAllBrands",
      type: "POST",
      url: "/v1/es/brandWall/queryAllBrands",
    }),
  ).then((json) => {
    if (json.results) {
      dispatch({ type: PLPPAGE.BRANDCON, data: json.results });
    }
  });
  return new Promise((res) => {
    dispatch(getPlpListData(params)).then((results) => {
      dispatch({ type: PLPPAGE.PRODUCTS, data: results });
      res(results);
    });
  });
};

export const getPlpListData = (params, notUseScreen) => (dispatch) => {
  return dispatch(action.getPlpPageData(params)).then((json) => {
    let url = params.url;
    // 未登录且筛选时去登录
    if (!notUseScreen && /filterActivity=true/.test(url) && json.status === 401) {
      window.location.href = `/login?historyLocation=${encodeURI(
        window.location.pathname.replace("/", ""),
      )}${window.location.search.replace("?", "&")}`;
    }
    return json.results;
  });
};

export function couponInfo(params, callback) {
  action.couponInfo(params, (json) => {
    if (json && json.results) {
      callback && callback(json.results);
    }
  });
}

// 根据关联词获取abTest的Key
export const getMatchKey = (param) => (dispatch) => {
  let params = {};
  params.type = "GET";
  params.url = `/v1/mpcms/common/match/key?associatedText=${param.k}`;
  return dispatch(action.getMatchKey(params)).then((json) => {
    if (json) {
      return json;
    }
  });
};

// 根据关联词获取abTest的Key
export const getMatchText = (param) => (dispatch) => {
  let params = {};
  params.type = "GET";
  params.url = `/v1/mpcms/common/match/${param.text}?abTest=${param.abTest}&channel=mobile`;
  return dispatch(action.getMatchText(params)).then((json) => {
    if (json && json.results) {
      return json.results;
    }
  });
};
// Sprint9 - 根据关联词获取对应广告资源,根据搜索展示多个广告位资源
export const getMatchAd = (param) => (dispatch) => {
  let params = {};
  params.type = "GET";
  params.url = `/v1/mpcms/common/match/resources/${param.text}?abTest=${param.abTest}&channel=mobile`;
  return dispatch(action.getMatchText(params)).then((json) => {
    if (json && json.results) {
      return json.results;
    }
  });
};
// 图片广告位
export const advertImg = (val, callback) => {
  return () => {
    new Promise((res) => {
      action.advertImg(val, (json) => {
        if (json && json.results) res(json);
      });
    }).then((results) => {
      if (callback) {
        callback(results);
      }
    });
  };
};

//文字广告位
export const advertTxt = (val, callback) => {
  return () => {
    new Promise((res) => {
      action.advertTxt(val, (json) => {
        if (json && json.results) res(json);
      });
    }).then((results) => {
      if (callback) {
        callback(results);
      }
    });
  };
};

// 快捷筛选 tab/ 筛选
export const quickscreenNum = (val, callback) => (dispatch) => {
  let url = "/v1/search-service/product/list/count";
  let params = "?";
  if (val) {
    for (let key in val) {
      params += key + "=" + val[key] + "&";
    }
  }
  url += params + "channel=MOBILE";
  dispatch(action.screenNum({ url, type: "GET", onlyKey: "quickScreenCount" })).then((data) => {
    callback && callback(data);
  });
};

export const quickscreenResetFilter = (url, callback) => (dispatch) => {
  dispatch(action.screenNum({ url, type: "GET", onlyKey: "quickscreenResetFilter" })).then(
    (data) => {
      callback && callback(data);
    },
  );
};

export const obtainData = (val) => (dispatch) => {
  dispatch({ type: PLPPAGE.OBTAINDATA, data: val });
};

export const getFilterActStatus = (params) => (dispatch) => {
  return dispatch(action.getFilterActStatus(params)).then((json) => {
    return json.results;
  });
};

export const startCustomerService = () => (dispatch) => {
  Sensor.go("CustomerServiceClick", {
    action_id: "1000202_981",
    page_id: "MB_1000202",
    $element_content: "在线客服",
    button_location: window.location.href,
    current_url: window.location.href,
    page_type:"Navigation-page",
    page_type_detail:"category_list_2 "
  });
  dispatch(
    action.getPersonalInfo({
      onlyKey: "getPersonalInfo",
      url: `/v1/myaccount/user/userProfile`,
      type: "GET",
    }),
  ).then((json) => {

    if (json && json.jQueryStatus && (json.jQueryStatus.status === 401 || json.status === 401)) {
      window.location.href = window.location.href = `/login?historyLocation=${encodeURIComponent(
        window.location.pathname.replace("/", "").replace("?", "&"),
      )}${window.location.search.replace("?", "&")}`;
    } else {
      let token = GetSingleCookie2({ key: "Token" });
      let url = "https://uataicca.sephora.cn/webchatbot/h5chat_sephora.html";
      if (Utils.getEnv("restfulEnv") === "production") {
        url = "https://aicca.sephora.cn/webchatbot/h5chat_sephora.html";
      }
      window.location.href = `${url}?sysNum=1603354924318&sourceId=70181&lang=zh_CN&token=${token}`;
    }
  });
};
