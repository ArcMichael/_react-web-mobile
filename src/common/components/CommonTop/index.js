import React from "react";
import { connect } from "react-redux";
import Utils from "@/lib/utils";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import PopupAlert from "@/components/PopupAlert";
import { clientHeight, scrollTop } from "../../actions/view";
import { isWeChat } from "../../actions/device";
import {
  postMyaccountUserSocialLogin,
  getV2MyaccountUserUserCardInfo,
  firstPopupImg,
  getMyaccountUserAuthenticate,
  isFinishPageLoad,
  googleAnalyticsPushV2,
} from "../../actions/globalReference";
import { getQueryCartProdTotalQuantity } from "../../actions/cart";
import { popupComponent, popupAlert } from "../../actions/popup";
import { setupGoogleAnalytics, setupWeChat } from "../../actions/dependency";
import * as Tools from "../../lib/Tools";
import { emarsysGo, pushEmarsys } from "../../actions/commonVenders";
import * as libRegexp from "../../lib/regexp";
import * as device from "../../lib/device";
import * as utilCookieUtil from "../../Utils/cookieUtil";

import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import Sensor from "../../Utils/sensor";
import AnimationFrame from "../../Utils/animationFrame";
import pageTypes from "./pageTypes.json";
import CommonTopUtils from "./utils";
import Popup from "../Popup";
import { getCookie } from "../../Utils/utils/cookie";
import { multiLogin } from "../../lib/BLL";
const NOTRETENTIONPAGES =
  require("../../Mapping/config_retention_url.json").noRetiontionUrl; // 留资名单
import { getShuMeiDeviceId } from "../../lib/index";

// const Popup = loadable(() => import("../Popup"));

/**
 * 1. 公共弹出层
 * 2. 公共信息获取
 * 3. 第三方登陆
 */
class CommonTop extends React.Component {
  constructor(props) {
    super(props);
    this.getQueryCartProdTotalQuantity =
      this.getQueryCartProdTotalQuantity.bind(this);
    // 以下三个方法是用来获取当前浏览器尺寸的方法，统一保存到store，不要重复使用
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    // 登陆集合，处理所有登陆
    this.handleLoginManager = this.handleLoginManager.bind(this);
    this.handleDependency = this.handleDependency.bind(this);
    this.handleGetUserInfo = this.handleGetUserInfo.bind(this);
    // this.handleGetSocialUserInfo = this.handleGetSocialUserInfo.bind(this);
    // 第三方登录
    this.handleSocialLogin = this.handleSocialLogin.bind(this);
    this.handlePopupManager = this.handlePopupManager.bind(this);
    this.handlePopupInit = this.handlePopupInit.bind(this);
    this.handleCampaignPopup = this.handleCampaignPopup.bind(this);
    this.handleRetentionInfoPopup = this.handleRetentionInfoPopup.bind(this);
    this.handlePinkCardPopup = this.handlePinkCardPopup.bind(this);
    this.handlePageShow = this.handlePageShow.bind(this);
    this.handleSetPageType = this.handleSetPageType.bind(this);
    this.init = this.init.bind(this);
  }
  pageType = { type: "" };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      (nextProps._googleAnalytics.USER !== this.props._googleAnalytics.USER ||
        nextProps._dependency.GOOGLE_ANALYTICS !==
          this.props._dependency.GOOGLE_ANALYTICS) &&
      nextProps._googleAnalytics.USER &&
      nextProps._dependency.GOOGLE_ANALYTICS
    ) {
      // 判断数据源 以及 js 加载状态
      GoogleAnalytics.push(
        { event: "user", user: nextProps._googleAnalytics.USER },
        { onlyOnce: true }
      );
    }
    if (
      (nextProps._dependency.GOOGLE_ANALYTICS !==
        this.props._dependency.GOOGLE_ANALYTICS ||
        nextProps._googleAnalytics.PUSHV2 !==
          this.props._googleAnalytics.PUSHV2) &&
      nextProps._dependency.GOOGLE_ANALYTICS &&
      nextProps._googleAnalytics.PUSHV2 &&
      nextProps._googleAnalytics.PUSHV2.length
    ) {
      // pushV2
      nextProps._googleAnalytics.PUSHV2.forEach((item) => {
        GoogleAnalytics.pushV2(item);
      });
      this.props.googleAnalyticsPushV2({ type: "clear", data: [] });
    }
  }
  componentDidMount() {
    this.init();
  }

  init() {
    this.props.isWeChat();
    this.handleSetPageType();
    this.handleResize();
    this.handleScroll();
    this.handleDependency({ depend: "WeChat" }); // 全局依赖加载微信
    this.getQueryCartProdTotalQuantity();
    Utils.afterPageShow().then(() => {
      this.handlePageShow();
    });
    if (CommonTopUtils.isAllowScroll()) {
      window.addEventListener("scroll", this.handleScroll);
      window.addEventListener("resize", this.handleResize);
    }
  }

  /**
   * Ga使用的pageType
   */
  handleSetPageType() {
    let pageType = "";
    let pathname = window && window.location.pathname;
    if (pathname) {
      for (let key in pageTypes) {
        let reg = new RegExp(key);
        if (reg.test(pathname)) {
          pageType = pageTypes[key]; // 获取页面类型 ----GA
          break;
        }
      }
    }
    this.pageType.type = pageType;
  }

  handlePageShow() {
    this.props.isFinishPageLoad("done");

    if (!device.isWeChat()) {
      this.handleDependency({ depend: "GoogleAnalytics" }); // GoogleAnalytics全局依赖加载
    }
    this.handleLoginManager(); // 登陆管理 ( 通用模块统一接口调用，获取用户信息 );
    //Emarsys
    this.props.emarsysGo({ timeout: 2500 });
    const uid = GetSingleCookie2({ key: "UID" });
    uid && this.props.pushEmarsys(["setCustomerId", uid]);
    Tools.saveDeviceInfo();
    this.handlePopupManager({}); // 弹出层管理
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("pageshow", this.handlePageShow, false);
  }

  // 获取库存，Footer底部的小圆点
  getQueryCartProdTotalQuantity() {
    const { getQueryCartProdTotalQuantity } = this.props;
    if (utilCookieUtil.GetSingleCookie(window.document.cookie, "Token")) {
      getQueryCartProdTotalQuantity({});
    }
  }

  handleResize() {
    // 可视区域改变后触发
    const { clientHeight } = this.props;
    const animationFrame = new AnimationFrame();
    animationFrame.callRequestAnimationFrame(function () {
      clientHeight(window.document.documentElement.clientHeight);
    });
  }
  handleScroll() {
    // 滚动条改变后触发
    const { scrollTop } = this.props;
    const animationFrame = new AnimationFrame();
    animationFrame.callRequestAnimationFrame(() => {
      scrollTop(bodyScrollTop.get());
    });
  }

  handleLoginManager() {
    const _code = libRegexp.searchCode(window.location);

    const _state = libRegexp.searchState(window.location);

    if (_code && _state) {
      // 第三方登陆
      this.handleSocialLogin();
    } else {
      this.handleGetUserInfo({});
    }
  }
  // 联合登陆
  handleSocialLogin() {
    // TODO
    const {
      postMyaccountUserSocialLogin,
      popupComponent,
      googleAnalyticsPushV2,
    } = this.props;
    const _code = libRegexp.searchCode(window.location);
    const _state = decodeURIComponent(libRegexp.searchState(window.location));
    let _redirect = false;
    const options = {
      authorizationCode: "",
      mode: "",
      NDFingerPrint: getShuMeiDeviceId(),
    };
    //入参示例  https://stagem.sephora.cn/?code=984FA3E12F3DF4B9277FA7F526570164&state=%7B%22platform%22%3A%22QQ%22%2C%22redirect%22%3A%22https%25253A%25252F%25252Fstagem.sephora.cn%25252F%22%7D
    if (_code) options.authorizationCode = _code || false;
    if (_state) options.mode = JSON.parse(_state).platform || false;
    _redirect = JSON.parse(_state).redirect || false;

    postMyaccountUserSocialLogin({
      options,
      callback: (json) => {
        let results = json.results;
        if (!results) {
          Sensor.initial({});
        }

        if (json && !results && json.errorCode) {
          if (json.errorCode === 10311) {
            const { popupAlert } = this.props;

            popupAlert(1, "PopupCleaning", {
              _text:
                "系统检测到当前账号在其他设备保持登陆状态，请问是否授权多端登陆？如同意则多端将保持登陆，如拒绝则其他设备上账号会自动登出。",
              _customFalseText: "拒绝",
              _btnWord: "允许",
              _customTrueCallback: () => {
                multiLogin(
                  {
                    multiLoginToken: json.errorMessage,
                    permit: true,
                  },
                  () => {
                    window.location.reload();
                  }
                );
              },
              _customFalseCallback: () => {
                multiLogin(
                  {
                    multiLoginToken: json.errorMessage,
                    permit: false,
                  },
                  () => {
                    window.location.reload();
                  }
                );
              },
            });
            return;
          }
          Sensor.go("loginResult", {
            login_channel: "第三方联合登录",
            if_success: false,
            failure_reason: json.errorCode,
            $lib_detail: "M_CommonTop##ifSocialLogin##index.js##93",
          });
          googleAnalyticsPushV2({
            type: "push",
            data: [
              {
                event: "page_view",
                loginStatus: "not logged",
                pageType: this.pageType.type,
              },
            ],
          });
        } else {
          if (results && results.tpId) {
            popupComponent(1, "RetentionInfo", {
              results: {},
            });
          } else {
            if (results && results.sephoraToken) {
              utilCookieUtil.SetSingleCookie2({
                key: "Token",
                value: results.sephoraToken,
                domain: ".sephora.cn",
                path: "/",
              });
            }
            getCookie().then((cookie) => {
              cookie("tpId", "", { expires: -1 });
              cookie("bindId", "", { expires: -1 });
              cookie("email", "", { expires: -1 });
              this.handleGetUserInfo({});
              Sensor.go("loginResult", {
                login_channel: "",
                if_success: true,
                failure_reason: false,
                userID: (results && results.id) || "",
                $lib_detail: "M_CommonTop##ifSocialLogin##index.js##100",
              });
            });
          }
          if (_redirect) window.location.href = decodeURIComponent(_redirect);
        }
      },
    });
  }
  handleGetUserInfo() {
    // 获取用户基本信息，全局全页面唯一调用
    const { getV2MyaccountUserUserCardInfo, googleAnalyticsPushV2 } =
      this.props;
    getV2MyaccountUserUserCardInfo({
      callback: (json) => {
        Sensor.initial({
          vip_card: json.results ? json.results.cardNo || "" : "",
          vip_card_type: json.results ? json.results.cardType || "" : "",
        });

        Sensor.other("setProfile", {
          //放到用户表中
          vip_card: json.results ? json.results.cardNo || "" : "",
          vip_card_type: json.results ? json.results.cardType || "" : "",
        });
        if (!json.results) {
          googleAnalyticsPushV2({
            type: "push",
            data: [
              {
                event: "page_view",
                loginStatus: "not logged",
                pageType: this.pageType.type,
              },
            ],
          });
        } else {
          googleAnalyticsPushV2({
            type: "push",
            data: [
              {
                event: "page_view",
                loginStatus: "logged",
                userId: utilCookieUtil.GetSingleCookie(document.cookie, "UID"),
                memberCardId: json.results.cardNo || "",
                memberCardType: json.results.cardType || "",
                pageType: this.pageType.type,
              },
              {
                event: "accountLogin",
              },
            ],
          });
        }
      },
    });
  }

  /*
   * 公共依赖项
   * Wechat
   * GoogleAnalytics( 内部处理PV )
   */
  handleDependency({ depend = false }) {
    // 公共依赖项
    const { setupGoogleAnalytics, setupWeChat } = this.props;
    if (!depend) return false;
    if (depend === "WeChat" && device.isWeChat()) {
      setupWeChat({});
    }
    if (depend === "GoogleAnalytics") setupGoogleAnalytics({});
  }
  /**
   * 弹出流程流程
   * 要求所有回调方法使用 Promise ,reject, resolve
   */
  handlePopupManager() {
    // 弹出流程流程
    this.handlePopupInit()
      .then(this.handleCampaignPopup)
      .then(this.handleRetentionInfoPopup)
      .then(this.handlePinkCardPopup)
      .then(console.log("done"))
      .catch(() => {});
  }

  handlePopupInit() {
    return new Promise((resolve) => {
      resolve("handlePopupPrototype");
    });
  }

  handleCampaignPopup() {
    const { firstPopupImg, popupComponent } = this.props;
    return new Promise((resolve, reject) => {
      const _pathname = window.location.pathname;

      const newDate = new Date();

      const _specialday = Tools.GetSingleCookie(
        window.document.cookie,
        "SPECIALDAY"
      );
      if (newDate.toLocaleDateString() === _specialday) {
        // 已经弹出过
        // PASS
        resolve({ state: false });
        return;
      }
      if (_pathname !== "/" && _pathname !== "/homepage") {
        resolve({ state: false });
        return;
      }

      // 还未弹出过
      firstPopupImg("mobile:home:popup", (callback) => {
        if (
          callback &&
          callback[0] &&
          callback[0].contentDetails &&
          callback[0].contentDetails.length > 0
        ) {
          let data = callback[0].contentDetails.find((item) => {
            return item.type == "image";
          });
          popupComponent(1, "FirstLogin", {
            _zIndex: 1000,
            _imgSrc: data.image,
            content: data.text,
            _imgLink: data.link,
            _imgLinkOM: data.trackingCode,
            _placeholder: data.baseImage,
          });
          // POPUP
          reject({ state: "campaign" });
        } else {
          resolve({ state: false });
        }
      });
    });
  }

  handleRetentionInfoPopup() {
    const { popupComponent, getMyaccountUserAuthenticate } = this.props;
    return new Promise((resolve, reject) => {
      const _pathname = window.location.pathname;

      const _retentionCount = GetSingleCookie2({
        key: "retention_info_count",
      });
      const _tpId = GetSingleCookie2({ key: "tpId" });
      const _bindId = GetSingleCookie2({ key: "bindId" });
      let _keyRetentionController = true;

      // 留资白名单
      NOTRETENTIONPAGES.map((url) => {
        if (_pathname.match(new RegExp(url))) {
          _keyRetentionController = false;
        }
      });
      if (
        (_tpId || _bindId || _retentionCount !== "0") &&
        _keyRetentionController
      ) {
        // 设置回话内无法进行第二次请求
        utilCookieUtil.SetSingleCookie2({
          key: "retention_info_count",
          value: "0",
        });
        if (!_tpId && !_bindId) {
          getMyaccountUserAuthenticate({
            callback: ({ results = false }) => {
              if (!results) return resolve({ state: false });
              /**
               * response mobie = true||false
               * true = 留资 reject
               * false = 不留资料 resolve
               */
              if (!results.isPopUp) return resolve({ state: false });
              popupComponent(1, "RetentionInfo", {
                results,
              });
              reject({ state: "handleRetentionInfoPopup" });
            },
          });
        } else {
          // 留资新接口
          popupComponent(1, "RetentionInfo", {
            results: {},
          });
          reject({ state: "handleRetentionInfoPopup" });
        }
      } else {
        resolve({ state: false });
      }
    });
  }
  handlePinkCardPopup() {
    const { popupComponent } = this.props;
    return new Promise((resolve, reject) => {
      const _pinkFirstTime = GetSingleCookie2({
        key: "FirstTime",
      });
      const _pinkGroupId = GetSingleCookie2({ key: "GroupId" });

      if (_pinkFirstTime === "1" && _pinkGroupId === "5") {
        popupComponent(1, "PopupPinkCard");
        reject({ state: "handlePinkCardPopup" });
      } else {
        resolve({ state: "handlePinkCardPopup" });
      }
    });
  }
  render() {
    return (
      <div>
        {" "}
        <Popup key="popupComonent" /> <PopupAlert />
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  return {
    _dependency: s.dependency,
    _googleAnalytics: s.googleAnalytics,
  };
};

export default connect(mapStateToProps, {
  clientHeight,
  scrollTop,
  postMyaccountUserSocialLogin,
  getV2MyaccountUserUserCardInfo,
  setupGoogleAnalytics,
  isWeChat,
  setupWeChat,
  getQueryCartProdTotalQuantity,
  firstPopupImg,
  popupComponent,
  getMyaccountUserAuthenticate,
  isFinishPageLoad,
  emarsysGo,
  pushEmarsys,
  googleAnalyticsPushV2,
  popupAlert,
})(CommonTop);
