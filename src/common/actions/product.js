/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 11:45:45
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Mo 06:25:41
 * @function product action
 */
import Utils from "@/lib/utils";
import $ from "jquery";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import axios from 'axios';
import * as action from "../lib/BLL";
import * as Regexp from "../lib/regexp";
import { popupAlert } from "./popup";
import { googleAnalyticsPushV2 } from "./globalReference";
import * as types from "../constants/ActionTypes";

import Sensor from "../Utils/sensor";
import GoogleAnalytics from "../Utils/GoogleAnalytics";
import getConfigs from "../../isomorphisms/getConfigs";

const configs = getConfigs();

/**
 * product页面所需回调方法map.
 * 根据callbackKEY来拿取相应函数用于执行
 */

const funcMap = {
  tabClickfun,
  tabMoreClickfun,
  detailsTabClickfun,
  getCommentList,
  promotionDetailsPopup,
  productVBDetailsPopup,
  toBrandPage,
  recordSwiper,
  toConsultingPage,
  roleActivity,
  closeAttrChoice,
  changeAttr,
  countNum,
  presaleActivity,
  pickColors,
  closePickColorsFun,
  screenColor,
  vipActivityPopup,
  startCustomerService,
  tabClickfunV2,
};

/**
 * 作为回调函数传入组件，通过函数名map调用所有方法.
 * @param {string} callbackKEY 需要调取的函数名
 */
export const mapFuncToRun = (callbackKEY, params) => (dispatch, getState) => {
  const func = funcMap[callbackKEY];
  func && func(params, dispatch, getState);
};
export const mapFuncToRunV2 = (callbackKEY) => (dispatch, getState) => {
  const func = funcMap[callbackKEY];
  func && func()(dispatch, getState);
};

/**
 * vipActivityPopup.
 * @function vipActivityPopup product 专享活动popup
 */
function vipActivityPopup(params, dispatch) {
  Sensor.go("PDPClick", {
    button_name: "专享活动",
    OP_code: Regexp.pathnameProductId(window.location),
  });
  setPageScrollTop();
  dispatch(popupAlert(1, "VipActivityPopup", { _data: params }));
}
/**
 * closePickColorsFun.
 * @function closePickColorsFun product 页面关闭选择色号的功能popup
 */
function closePickColorsFun(params, dispatch, getState) {
  dispatch({
    type: types.PRODUCT.CLOSE_PCIK_COLORS,
    data: true,
  });

  changeAttr(params, dispatch, getState, "close");
  // openAttrChoice()(dispatch, getState)
}

/**
 * screenColor.
 * @function screenColor product 页面选择色号的功能popup中筛选功能
 */
function screenColor(callback, dispatch) {
  const productId = Regexp.pathnameProductId(window.location);
  dispatch(
    action.screenColor({
      onlyKey: "screenColor",
      url: `/v1/product/sku/allColorProperty/${productId}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      callback && callback(json.results);
    }
  });
}

/**
 * pickColors.
 * @function pickColors product 页面选择色号的功能
 */
function pickColors(params, dispatch, getState) {
  const productId = Regexp.pathnameProductId(window.location);
  dispatch(
    action.pickColors({
      onlyKey: "pickColors",
      url: `/v1/product/sku/concreteColor?productId=${productId}&colorMaterial=${params.colorMaterial || ""
        }&colorValue=${params.colorValue || ""}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      const { count, prodColorSpecDtoList } = json.results;
      const newArray = [];
      let hasInventory = false;
      let nowItem;
      prodColorSpecDtoList.forEach(function (item) {
        if (item.skuId === params.skuId) {
          newArray.unshift(item);
          nowItem = item;
          hasInventory = !(item.inventory <= 0);
        } else {
          newArray.push(item);
        }
      });
      setPageScrollTop();
      dispatch(
        popupAlert(1, "ProductPickColors", {
          _data: {
            count,
            prodColorSpecDtoList: newArray,
          },
          _skuId: params.skuId,
          _hasInventory: hasInventory,
          _nowItem: nowItem,
          _screenColorFun: (callback) =>
            screenColor(callback, dispatch, getState),
          _closeCallback: (skuId) =>
            closePickColorsFun(skuId, dispatch, getState),
          _pickColorsFun: (params) => pickColors(params, dispatch, getState),
        })
      );
    }
  });
}
/**
 * recordSwiper.
 * @function recordSwiper 记录全局的swiper
 */
function recordSwiper(params, dispatch) {
  dispatch({
    type: types.PRODUCT.SWIPER,
    data: params,
  });
}
/**
 * tabClickfun.
 * @function tab 切换时记录当前的索引
 */
function tabClickfun(params, dispatch) {
  const { nowIndex, sensorData } = params;
  if (sensorData) {
    Sensor.go("PDPClick", {
      button_name: sensorData,
      OP_code: Regexp.pathnameProductId(window.location),
    });
  }
  // if (_mySwiper) _mySwiper.slideTo(nowIndex);
  // bodyScrollTop.set(0);
  dispatch({
    type: types.PRODUCT.TAB_INDEX,
    data: nowIndex,
  });
}
/**
 * tabClickfun.
 * @function tab 切换时记录当前的索引
 */
function tabClickfunV2(params, dispatch) {
  const { nowIndex } = params;
  // _mySwiper && _mySwiper.slideTo(nowIndex);
  window.scrollTo(0, 0);
  dispatch({
    type: types.PRODUCT.TAB_INDEXV2,
    data: nowIndex,
    ifshow: params.ifshow,
  });
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: type,
    pdpInteractionType: "slide image",
  });
}
/**
 * tabMoreClickfun.
 * @function tab 点击顶部...时展示公共的tab选项
 */
function tabMoreClickfun(params, dispatch) {
  dispatch({
    type: types.PRODUCT.TAB_MORE,
    data: params,
  });
}

/**
 * detailsTabClickfun.
 * @function detailsTabClickfun 在详情模块点击切换时，记录当前的索引
 */
function detailsTabClickfun(params, dispatch) {
  let type = "";
  if (params == 0) {
    type = "商品详情";
  } else {
    type = "规格参数";
  }
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: type,
    pdpInteractionType: type,
  });
  dispatch({
    type: types.PRODUCT.DETAILS_TAP,
    data: params,
  });
}

/**
 * toBrandPage.
 * @function toBrandPage 品牌模块点击时跳转到品牌页面
 */
function toBrandPage(params) {
  Sensor.go("PDPClick", {
    button_name: "品牌",
    OP_code: Regexp.pathnameProductId(window.location),
  });
  if (!params) return;
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: "logo",
    pdpInteractionType: "logo",
  });
  window.location.href = `/brand/${params.brandEN && params.brandEN.toLocaleLowerCase()
    }-${params.brandId}/`;
}
/**
 * toConsultingPage.
 * @function toConsultingPage 咨询模块点击时跳转到咨询页面
 */
function toConsultingPage(params, dispatch, getState) {
  Sensor.go("PDPClick", {
    button_name: "产品咨询",
    OP_code: Regexp.pathnameProductId(window.location),
  });
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: "产品咨询",
    pdpInteractionType: "产品咨询",
  });
  const { productId, skuId } = getState().product.productInfo.sku;
  window.location.href = `/myComment?productId=${productId}&sku=${skuId}`;
}

/**
 * promotionDetailsPopup.
 * @function 当存在促销详情时,点击时展示具体的促销信息
 */
function promotionDetailsPopup(params, dispatch, render) {
  Sensor.go("PDPClick", {
    button_name: "促销详情",
    OP_code: Regexp.pathnameProductId(window.location),
  });
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: "促销详情",
    pdpInteractionType: "促销详情",
  });
  let url = `/v3/product/sku/${params.skuId}/MOBILE/promotion-info`;
  // if (params.preSaleActivity) {
  //   // 定金预售使用v3接口
  //   url = `/v3/product/sku/${params.skuId}/MOBILE/promotion-info`;
  // }
  dispatch(
    action.getPromotionDetails({
      onlyKey: "getPromotionDetails",
      url,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      let tags = [];
      let tagGroup = json.results;
       let fastList=json.results
      if (fastList.farePromotionInfos&&fastList.farePromotionInfos.length) {
        dispatch({
          type: types.PRODUCT.PDP_PRODUCT_PROMOTION_FAST,
          PDP_PRODUCT_PROMOTION_FAST: fastList.farePromotionInfos
        });
      }
      if (!Array.isArray(json.results) && json.results.promotionInfoDtos) {
        tagGroup = json.results.promotionInfoDtos;
      }
      tagGroup.forEach((promotion) => {
        if (
          promotion.tag &&
          (promotion.id.match("^103") || promotion.id.match("^104"))
        ) {
          if (promotion.id.match("^103") && tags.indexOf("满减") === -1) {
            tags.push("满减");
          } else if (
            promotion.id.match("^104") &&
            tags.indexOf("满赠") === -1
          ) {
            tags.push("满赠");
          }
        }
      });
      if (tags.length === 2 && tags[0] !== "满减") {
        tags = ["满减", "满赠"];
      }
      dispatch({
        type: types.PRODUCT.PDP_PRODUCT_PROMOTION_TAGS,
        // PDP_PRODUCT_PROMOTION_TAGS: tags,
        PDP_PRODUCT_PROMOTION_TAGS: tagGroup,
      });
      if (render !== true) {
        setPageScrollTop();
        let _data = {};
        if (!params.preSaleActivity) {
          _data.presaleNote = "";
  
        }
        _data = json.results;
        dispatch(popupAlert(1, "PromotionDetails", { _data }));
      }
    }
  });
}
/**
 * productVBDetailsPopup.
 * @function 当存在套装详情时,点击时展示具体的信息
 */
function productVBDetailsPopup(params, dispatch) {
  Sensor.go("PDPClick", {
    OP_code: Regexp.pathnameProductId(window.location),
    button_name: "查看套装详情",
  });
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: "套装详情",
    pdpInteractionType: "查看套装详情",
  });
  dispatch(
    action.getVBDetailsDetails({
      onlyKey: "getVBDetailsDetails",
      url: `/v2/product/sku/vb/${params.skuCode}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      setPageScrollTop();
      dispatch(popupAlert(1, "VBDetailsDetails", { _data: json.results }));
    }
  });
}

/**
 * arrivalNotice.
 * @function 到货通知的提示popup
 */
export const arrivalNotice = () => (dispatch, getState) => {
  const { productId, skuId } = getState().product.productInfo.sku;
  Sensor.go("clickCommodityInform", {
    OP_code: productId,
    commodity_sku: skuId,
  });
  dispatch(popupAlert(0, "PopupAlertDefault", { _autoClose: false }));
  setTimeout(() => {
    dispatch(
      popupAlert(1, "ArrivalNotice", {
        _data: { data: getState().product.arrivalData },
        _closeCallback: (params) => dispatch(arrivalNoticeAjax(params)),
        _zIndex: 203,
      })
    );
  }, 100);
};

export const arrivalNoticeAjax = (params) => (dispatch, getState) => {
  const regMobile = /^1\d{10}$/;
  const regEmail =
    /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
  const skuId = getState().product.productInfo.sku.skuId;
  const { phone, email } = params;
  dispatch({
    type: types.PRODUCT.ARRIVALNOTICE,
    data: {
      phone,
      email,
    },
  });
  const errorMSG = {};
  if (phone && !regMobile.test(phone)) {
    errorMSG.phoneMSG = "手机号格式有误！";
  }
  if (email && !regEmail.test(email)) {
    errorMSG.emailMSG = "邮箱格式有误！";
  }
  if (!(phone || email)) {
    errorMSG.phoneMSG = "手机号和邮箱不能同时为空！";
    errorMSG.emailMSG = "手机号和邮箱不能同时为空！";
  }
  if (Object.keys(errorMSG).length) {
    return dispatch(
      popupAlert(1, "ArrivalNotice", {
        _data: { data: getState().product.arrivalData, msg: errorMSG },
        _closeCallback: (params) => dispatch(arrivalNoticeAjax(params)),
        _zIndex: 203,
      })
    );
  }
  dispatch(
    action.arrivalNoticeAjax({
      onlyKey: "arrivalNoticeAjax",
      url: `/v1/shopcart/reminder/saveArrivalReminderUserData`,
      type: "POST",
      data: {
        queryBody: {
          phone,
          email,
          skuId,
        },
      },
      isConfirm: true,
    })
  ).then((json) => {
    if (json && json.results && json.results.status) {
      if (json.results.status === "SUCCESS") {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: "通知预约成功！",
            _autoClose: true,
            _totalCount: 3000,
            _ox: true,
          })
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: "通知预约失败！",
            _autoClose: true,
            _totalCount: 3000,
            _ox: false,
          })
        );
      }
    }
  });
};
/**
 * roleActivity
 * @function 当存在黑金卡活动存在时，展示对应的活动规则
 */
function roleActivity(params, dispatch) {
  Sensor.go("PDPClick", {
    button_name: "会员价规则",
    OP_code: Regexp.pathnameProductId(window.location),
  });
  setPageScrollTop();
  dispatch(
    popupAlert(1, "RoleActivity", { _data: params, _title: "会员价规则" })
  );
}

/**
 * presaleActivity
 * @function 当存在定金预售活动存在时，展示对应的活动规则
 */
function presaleActivity(params, dispatch) {
  Sensor.go("PDPClick", {
    button_name: "预售规则",
    OP_code: Regexp.pathnameProductId(window.location),
  });
  setPageScrollTop();
  dispatch(
    popupAlert(1, "RoleActivity", { _data: params, _title: "预售规则" })
  );
}

/**
 * openAttrChoice.
 * @function 打开PDP页面规格选项
 */
export const openAttrChoice = (param, type, cb) => (dispatch, getState) => {
  const productId = Regexp.pathnameProductId(window.location);
  const skuId =
    Regexp.searchSkuId(window.location) ||
    getState().product.productInfo.sku.skuId;
  const colsePickColors = getState().product.colsePickColors;
  const specialSkuId = getState().product.specialSkuId;
  if (type == "buyNow") {
    Sensor.go("startBuyNow", {
      OP_code: productId,
      commodity_sku: skuId,
    });
  } else if (type == "addCart") {
    Sensor.go("startAddToShoppingcart", {
      OP_code: productId,
      commodity_sku: skuId,
    });
  }
  const product=getState().product.productInfo
  const {seckillActivityDto}=product
  if(seckillActivityDto&&seckillActivityDto.status=="preheat"&&param=="normal"){
    dispatch(
      popupAlert(1, "PopupToast", {
        _text: "秒杀活动即将开始",
        _autoClose: true,
        _zIndex:203
      })
    );
  }
  
  setPageScrollTop();
  dispatch(
    action.openAttrChoice({
      onlyKey: "openAttrChoice",
      url: `/v2/product/sku/specs?productId=${productId}&channel=MOBILE&skuId=${skuId}`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      const newObj = JSON.parse(JSON.stringify(json.results));
      if (param) {
        let ifSwtich = true;

        for (let index = 0; index < newObj.saleAttrs.length; index++) {
          const element = newObj.saleAttrs[index];
          if (specialSkuId && element.skuId === specialSkuId.skuId) {
            ifSwtich = false;
          }

          if (skuId == element.skuId && param === "normal") {
            dispatch({
              type: types.PRODUCT.SPECIAL_SKUID,
              data: element,
            });
          }
          if (param !== "change" && element.skuId === param) {
            dispatch({
              type: types.PRODUCT.SPECIAL_SKUID,
              data: element,
            });
          }
        }
        if (ifSwtich == true && param === "change" && specialSkuId) {
          newObj.saleAttrs.unshift(specialSkuId);
        }
      }
      dispatch({
        type: types.PRODUCT.SPECS,
        data: {
          showOrHide: true,
          source: newObj,
        },
      });

      // 关闭色卡popup时，去判断是否需要本地化保存当前的skuid信息
      if (colsePickColors) {
        dispatch({
          type: types.PRODUCT.CLOSE_PCIK_COLORS,
          data: false,
        });
      }
      // if (json.results.embedId) findColorNumber(json.results.embedI);
      getProductInfo && getProductInfo(cb)(dispatch, getState);
    }
  });
};

/**
 * findColorNumber.
 * @function 找色号功能,查找色号
 */
export function findColorNumber() {
  const headDom = document.getElementsByTagName("head")[0];
  const scriptDom = document.createElement("script");
  scriptDom.type = "text/javascript";
  scriptDom.src = `${configs.static}/soa/public/js/w-adv-7.min.js`;
  headDom.appendChild(scriptDom);
  scriptDom.onload = scriptDom.onreadystatechange = function () {
    window.Findation = window.Findation || {};
    window.Findation.widgetEmbedded = function (frame) {
      frame.style.width = "4rem";
      frame.style.height = "0.8rem";
    };
    const initWidget = function () {
      window.Findation.init &&
        window.Findation.init(
          document.getElementById("findation-widget-button"),
          "b0b5640be711277fd0191bbdaf30fe6478e921754ede1aa0f74fe8a6c738",
          {}
        );
    };
    if (initWidget) initWidget();
    IframeOnClick.track(
      document.getElementById("findation-button-iframe"),
      function () {
        // bodyScrollTop.set(0);
        Sensor.go("PDPClick", {
          $lib_detail: "Mobile_PDP##IframeOnClick##ProductsDetailsPage.js##402",
          button_name: "帮你选色号",
          OP_code: Regexp.pathnameProductId(window.location),
        });
      }
    );
  };

  var IframeOnClick = {
    // 用于解决iframe的跨域问题
    resolution: 200,
    iframes: [],
    interval: null,
    Iframe() {
      this.element = arguments[0];
      this.cb = arguments[1];
      this.hasTracked = false;
    },
    track(element, cb) {
      this.iframes.push(new this.Iframe(element, cb));
      if (!this.interval) {
        const _this = this;
        this.interval = setInterval(function () {
          _this.checkClick();
        }, this.resolution);
      }
    },
    checkClick() {
      if (document.activeElement) {
        const activeElement = document.activeElement;
        for (const i in this.iframes) {
          if (activeElement === this.iframes[i].element) {
            // user is in this Iframe
            if (this.iframes[i].hasTracked == false) {
              this.iframes[i].cb.apply(window, []);
              this.iframes[i].hasTracked = true;
            }
          } else {
            this.iframes[i].hasTracked = false;
          }
        }
      }
    },
  };
}
/**
 * changeAttr.
 * @function 切换规格功能
 */
function changeAttr(params, dispatch, getState, type) {
  const currentsearch = window.location.search;
  const cursku = /sku=/;
  const condition = /sku=[0-9]*/;
  if (currentsearch) {
    if (cursku.test(currentsearch)) {
      history.replaceState(
        `?sku=${params}`,
        "",
        currentsearch.replace(condition, `sku=${params}`)
      );
    } else {
      history.replaceState(
        `?sku=${params}`,
        "",
        `${currentsearch}&sku=${params}`
      );
    }
  } else {
    history.replaceState(`?sku=${params}`, "", `?sku=${params}`);
  }
  dispatch({
    type: types.PRODUCT.RECORD_NOW_NUM,
    data: 1,
    name: "reduce",
  });
  openAttrChoice &&
    openAttrChoice(type ? params : "change", "", (json) => {
      if (
        json &&
        json.results &&
        json.results.sku &&
        json.results.noInvToastReq
      ) {
        dispatch(noinvPopup(json.results.sku.skuId, false));
      }
      dispatch(getVBListTwo(json.results.sku.skuCode));
    })(dispatch, getState);
  getProductDetailsInfo && getProductDetailsInfo()(dispatch, getState);
  getRankingList && getRankingList()(dispatch, getState);
  promotionDetailsPopup &&
    promotionDetailsPopup({ skuId: params }, dispatch, true);
}
/**
 * closeAttrChoice.
 * @function 关闭PDP页面规格选项
 */
function closeAttrChoice(params, dispatch, getState, cb) {
  dispatch({
    type: types.PRODUCT.SPECIAL_SKUID,
    data: null,
  });
  dispatch({
    type: types.PRODUCT.SPECS,
    data: {
      showOrHide: false,
      source: "",
    },
  });
  dispatch({
    type: types.PRODUCT.RECORD_NOW_NUM,
    data: 1,
    name: "reduce",
  });
  if (getProductInfo) getProductInfo(cb)(dispatch, getState);
  setTimeout(() => {
    setWindowScrollTop();
  }, 0);
}
export const addToCartCommon= ({params,callback}) => (dispatch) =>{
//  多个加入购物车
let spuList=[]
let skuList=[]
let numberList=[]
if (params&&params.length) {
  params.map(item=>{
    spuList.push(item.productId)
    skuList.push(item.skuId)
    numberList.push(item.quantity)
  })
}

Sensor.go("orderRelatedPage_click", {
  OP_code: spuList.join(",") || null,
  commodity_sku: skuList.join(","),
  commodity_number: numberList.join(","),
  button_name:"加入购物车",
  current_url:window.location.href
});
Sensor.go("addToShoppingcart", {
  OP_code: spuList.join(",") || null,
  commodity_sku: skuList.join(","),
  commodity_number: numberList.join(","),
  button_name:"加入购物车",
  current_url:window.location.href
});
  dispatch(
    action.combAddToCart({
      onlyKey: "combAddToCart",
      url: `/v3/shopcart/shopcart/addToCart`,
      type: "POST",
      data: { queryBody: params },
    }),
  ).then((json) => {
       if (json.results.message) {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.results.message,
            _autoClose: true,
            _totalCount: 3000,
            _ox: true,
          })
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: "加入购物车成功！",
            _autoClose: true,
            _totalCount: 3000,
            _ox: true,
          })
        );
      }
    json && callback&&callback(json);
  });
}
/**
 * addToCart.
 * @function PDP页面加入购物车
 */
export const addToCart = (params, type, all) => (dispatch, getState) => {
  const { productId, skuId, brandEN, name, price } =
    getState().product.productInfo.sku;
  
  const nowNumber = getState().product.recordNowNumber;
  const ajaxUrl = `/v3/shopcart/shopcart/addToCartForSingleProduct`;
  if (!GetSingleCookie2({ key: "Token" }))
    return (window.location.href = `/login?historyLocation=product/${productId}.html?sku=${skuId}`);
  // if(params !== 'addtocart'&& all){
  //     ajaxUrl = `/v1/shopcart/shopcart/addToCartForSingleProduct`
  // }
  // 全额预售立即购买使用普通商品结账路径，不需要加购物车，直接跳转
  if (all) {
    let orderType=2
    switch (type){
      case 3:
        orderType=1
        break
      case 5:
        orderType=5 // 秒杀
        break
    }
    dispatch(
      action.canBuyNow({
        onlyKey: "addToCart",
        url: "/v2/shopcart/shopcart/stepTwoForImmediatelyBuy",
        type: "POST",
        data: {
          queryBody: {
            inputSkusDto: [
              {
                skuId,
                quantity: nowNumber,
              },
            ],
            orderType,
            channel: "MOBILE",
            autoApplyCoupon: true,
          },
        },
      })
    ).then((json) => {
      if (json && json.results && json.results.code) {
        if (json.results.code==40051449) {
          // 没有符合购买的秒杀商品
        dispatch(getProductInfo())
          
        }
        
        closeAttrChoice("", dispatch, getState);
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.results.message,
            _zIndex: 203,
            _autoClose: true,
            _totalCount: 3000,
            _ox: false,
          })
        );
      } else {
        Sensor.go("buyNow", {
          OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
          commodity_sku: skuId,
          commodity_number: nowNumber,
        });
        GoogleAnalytics.pushV2({
          event: "addToCart",
          addToCartType: "Buy Now",
          currencyCode: "CNY",
          products: [
            {
              brand: brandEN,
              id: skuId,
              name,
              price,
              productOpCode: productId,
              quantity: nowNumber,
            },
          ],
        });
        closeAttrChoice("", dispatch, getState, () => {
          window.location.href = `/checkout?kind=${type}&skuId=${skuId}&quantity=${nowNumber}`;
        });
      }
    });
    return;
  }
  dispatch(
    action.addToCart({
      onlyKey: "addToCart",
      url: ajaxUrl,
      type: "POST",
      data: {
        head: {
          token: "string",
          userId: "string",
        },
        queryBody: {
          channel:
            window &&
              window.navigator &&
              window.navigator.userAgent &&
              window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
              "micromessenger"
              ? "WECHAT"
              : "MOBILE",
          checked: "1",
          quantity: nowNumber,
          skuId,
          type: type || 1,
          userId: 0,
        },
      },
    })
  ).then((json) => {
    if (json && json.results && !json.results.code) {
      let addToCartType = "";
      if (params == "addtocart") {
        addToCartType = "Add to Cart";
        Sensor.go("addToShoppingcart", {
          OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
          commodity_sku: skuId,
          commodity_number: nowNumber,
        });
        // GoogleAnalytics.pushV2({
        //   event: "addToCart",
        //   addToCartType,
        //   currencyCode: "CNY",
        //   products: [
        //     {
        //       brand: brandEN,
        //       id: skuId,
        //       name: name,
        //       price: price,
        //       productOpCode: productId,
        //       quantity: nowNumber,
        //     },
        //   ],
        // });
      } else {
        addToCartType = "Buy Now";
        Sensor.go("buyNow", {
          OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
          commodity_sku: skuId,
          commodity_number: nowNumber,
        });
      }
      GoogleAnalytics.pushV2({
        event: "addToCart",
        addToCartType,
        currencyCode: "CNY",
        products: [
          {
            brand: brandEN,
            id: skuId,
            name,
            price,
            productOpCode: productId,
            quantity: nowNumber,
          },
        ],
      });
      // dispatch({ type: types.PRODUCT.QCPTQ, QCPTQ: json.results > 99 ? '99+' : json.results })
      getQueryCartProdTotalQuantity()(dispatch, getState);
      closeAttrChoice("", dispatch, getState);
      if (json.results.message) {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.results.message,
            _autoClose: true,
            _totalCount: 3000,
            _ox: true,
          })
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: "加入购物车成功！",
            _autoClose: true,
            _totalCount: 3000,
            _ox: true,
          })
        );
      }
      getProductInfo && getProductInfo()(dispatch, getState);
      if (type === 3) return (window.location.href = "/checkout?kind=3");
      if (type === 5) return (window.location.href = "/checkout?kind=5");

      if (params === "payonce") window.location.href = "/cart?source=PDP";
    } else {
      closeAttrChoice("", dispatch, getState);
      if (
        json &&
        json.jQueryStatus &&
        (json.jQueryStatus.status === 401 || json.status === 401)
      ) {
        window.location.href = `/login?historyLocation=${window.location.pathname}${window.location.search}`;
      }
      if (
        json.results &&
        json.results.code &&
        (json.results.code == 40051299 ||
          json.results.code == 40051399 ||
          json.results.code == 40052199)
      ) {
        dispatch(
          popupAlert(1, "PopupCleaning", {
            _title: json.results.code,
            _text: json.results.message,
            _autoClose: true,
            _zIndex: 202,
          })
        );
      } else {
        dispatch(
          popupAlert(1, "PopupAlertDefault", {
            _text: json.results.message || "加入购物车失败",
            _autoClose: true,
            _totalCount: 3000,
            _ox: false,
          })
        );
      }
    }
  });
};

/**
 * countNum.
 * @function countNum 记录attrpopup的数量
 */
function countNum(params, dispatch, getState) {
  const { status, inventory, limitCount } = getState().product.productInfo.sku;
  const preSaleActivity = getState().product.productInfo.preSaleActivity;
  const nowNumber = getState().product.recordNowNumber;
  // 如果当前商品为到货通知，则无法进行数量的加减
  if (preSaleActivity) {
    if (preSaleActivity.normalBuy != false) {
      // 定金预售中，有购物按钮时，虚拟库存和实际库存都没有时，不可修改数量
      if (status === "NO_INV" && preSaleActivity.virtualInv <= 0) return;
    } else {
      // 无购物按钮时，无虚拟库存时不可修改数量
      if (preSaleActivity.presaleInv !== "HAS_INV") return;
    }
  } else if (status === "NO_INV") return;
  let name = "reduce";
  if (params && params === "reduce") {
    dispatch({
      type: types.PRODUCT.RECORD_NOW_NUM,
      data: nowNumber - 1 <= 0 ? 1 : nowNumber - 1,
      name: nowNumber <= 2 ? "reduce" : "normal",
    });
  } else {
    let number;
    const inven = Number(inventory);
    let maxNum = Number(inven);
    const limitCountNum = Number(limitCount);
    if (limitCountNum) {
      maxNum = limitCountNum <= inven ? limitCountNum : inven;
    }
    if (preSaleActivity && preSaleActivity.virtualInv !== -1) {
      const virtualInv = Number(preSaleActivity.virtualInv);
      if (preSaleActivity.normalBuy != false) {
        if (preSaleActivity.virtualInv > 0) {
          // 定金预售存在购物按钮且有虚拟库存时，上限根据实际库存，虚拟库存，限购数和10间取最小值
          if (inven > 0) {
            maxNum = Math.min(virtualInv, maxNum);
          } else {
            maxNum = limitCountNum
              ? Math.min(virtualInv, limitCountNum)
              : virtualInv;
          }
        }
      } else {
        // 不存在购物按钮时，上限根据虚拟库存，限购数和10间取最小
        if (preSaleActivity.virtualInv > 0) {
          // 定金预售存在购物按钮且有虚拟库存时，上限根据实际库存，虚拟库存，限购数和10间取最小值
          maxNum = limitCountNum
            ? Math.min(virtualInv, limitCountNum)
            : virtualInv;
        }
      }
    }
    if (maxNum > 10) {
      maxNum = 10;
    }
    number = nowNumber >= maxNum ? maxNum : Number(nowNumber + 1);
    name = nowNumber + 1 >= maxNum ? "plus" : "normal";
    dispatch({
      type: types.PRODUCT.RECORD_NOW_NUM,
      data: number,
      name,
    });
  }
}
/**
 * initial.
 * @function initial 当页面初始化(即pageshow为done)之后请求接口
 */
export const initial = () => (dispatch, getState) => {
  const productFirstSection = getState().productFirstSection;
  console.log(JSON.stringify(productFirstSection));
  const productDetailsCommunity = productFirstSection.productDetailsCommunity;
  const productDetailsConsulation =
    productFirstSection.productDetailsConsulation;
  const productDetailsInfo = productFirstSection.productDetailsInfo;
  const productDetailsRanking = productFirstSection.productDetailsRanking;
  const productDetailsRecommend = productFirstSection.productDetailsRecommend;
  const productDetailsMktSimpleOne =
    productFirstSection.productDetailsMktSimpleOne; // 娇兰
  const productDetailsMktSimpleTwo =
    productFirstSection.productDetailsMktSimpleTwo; // 倩碧
  const productDetailsMktSimpleThree =
    productFirstSection.productDetailsMktSimpleThree; // miumiu

  const productDetailsProductInfo =
    productFirstSection.productDetailsProductInfo;
  setProductDetailsInfo &&
    setProductDetailsInfo(productDetailsInfo)(dispatch, getState);
  setProductInfo &&
    setProductInfo(productDetailsProductInfo, (json) => {
      if (json && json.results && !json.results.code) {
        const { brandEN, skuId, productNameCN, price, productId } =
          json.results.sku;
        dispatch(getVBListTwo(json.results.sku.skuCode))
        dispatch(
          googleAnalyticsPushV2({
            type: "push",
            data: [
              {
                event: "view_item",
                eeAction: "eeProductDetail",
                products: [
                  {
                    brand: brandEN,
                    id: skuId,
                    name: productNameCN,
                    price,
                    productOpCode: productId,
                  },
                ],
              },
            ],
          })
        );
        if (json.results.noInvToastReq) {
          // 无库存，请求无库存弹窗信息接口
          dispatch(noinvPopup(skuId));
        }
      }
    })(dispatch, getState);
  setProductPost && setProductPost(productDetailsCommunity)(dispatch, getState);
  setProductConsulationt &&
    setProductConsulationt(productDetailsConsulation)(dispatch, getState);
  setProductRecommend &&
    setProductRecommend(productDetailsRecommend)(dispatch, getState);
  setLipStickOnOff &&
    setLipStickOnOff(productDetailsMktSimpleOne)(dispatch, getState);
  setLipStickOnOff2 &&
    setLipStickOnOff2(productDetailsMktSimpleTwo)(dispatch, getState);
  setLipStickOnOff3 &&
    setLipStickOnOff3(productDetailsMktSimpleThree)(dispatch, getState);
  // setIfComment && setIfComment(productDetailsGetIfComment)(dispatch, getState);
  setRankingList && setRankingList(productDetailsRanking)(dispatch, getState);

  getQueryCartProdTotalQuantity &&
    getQueryCartProdTotalQuantity()(dispatch, getState);
  getIfComment && getIfComment()(dispatch, getState);
  // 促销详情
  if (
    productDetailsProductInfo.results &&
    !productDetailsProductInfo.code &&
    productDetailsProductInfo.results.sku &&
    productDetailsProductInfo.results.sku.hasPromotion
  ) {
    promotionDetailsPopup &&
      promotionDetailsPopup(
        { skuId: productDetailsProductInfo.results.sku.skuId },
        dispatch,
        true
      );
  }
};

export const getQueryCartProdTotalQuantity = () => (dispatch) => {
  if (!GetSingleCookie2({ key: "Token" })) return;
  action.getQueryCartProdTotalQuantity(null, (json) => {
    if (json && json.results) {
      dispatch({
        type: types.PRODUCT.QCPTQ,
        QCPTQ: json.results > 99 ? "99+" : json.results,
      });
    }
  });
};

/**
 * 调用图片广告位接口判断是否展示娇兰定制开关
 */
export const getLipStickOnOff = () => (dispatch) => {
  dispatch(
    action.firstPopupImg({
      onlyKey: "firstPopupImg",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      type: "POST",
      data: {
        queryBody: {
          locationLabel: "CUSTOM:PRODUCT",
          memberGroupId: 0,
        },
      },
    })
  ).then((json) => {
    setLipStickOnOff(json)(dispatch);
  });
};

const setLipStickOnOff = (json) => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  if (json && json.results && !json.results.code) {
    const obj = {
      isShow: false,
      link: "",
      imagePath: "",
    };
    let params1 = "";
    let params2 = "";
    if (
      json &&
      json.results &&
      json.results.resourceList &&
      json.results.resourceList.length > 0 &&
      json.results.resourceList[0] &&
      json.results.resourceList[0].content
    ) {
      json.results.resourceList[0].content.split(",").map((item) => {
        const itemNew = item.split("-");
        if (productId === itemNew[0]) obj.isShow = true;
        if (itemNew[1] == "1") params1 = itemNew[0];
        if (itemNew[1] == "2") params2 = itemNew[0];
      });
    }
    if (params1 && params2)
      obj.link = `/filterLipStick/?lipsticksku=${params1}&lipsticklidsku=${params2}&step=one&skulip=&skulid=`;
    obj.imagePath = `${json.results.resourceList[0].link}M.jpg`;
    dispatch({
      type: types.PRODUCT.LIPSTICKONOFF,
      data: obj,
    });
  }
};
/**
 * 调用/v2/product/sku/info 获取商品的具体信息
 */
export const getProductInfo = (callback) => (dispatch, getState) => {
  const productId = Regexp.pathnameProductId(window.location);
  const skuId = Regexp.searchSkuId(window.location) || "";
  dispatch(
    action.getProductInfo({
      onlyKey: "getProductInfo",
      url: `/v2/product/sku/info?productId=${productId}&channel=MOBILE&skuId=${skuId}`,
      type: "GET",
    })
  ).then((json) => {
    setProductInfo(json, callback)(dispatch, getState);
  });
};

/**
 * 调用/v2/product/sku/info 获取商品的具体信息
 */
 export const getVBListTwo = (skuCode) => (dispatch) => {
  dispatch(
    action.getVBListTwo({
      onlyKey: "getVBListTwo",
      type: "GET",
      url: `/v2/product/sku/vb/${skuCode}`
    }),
  ).then((json) => {
    if (json.results) {
      dispatch({ type: types.PRODUCT.VBLIST, data: json.results });
    }
  });
  // const productId = Regexp.pathnameProductId(window.location);
  // const skuId = Regexp.searchSkuId(window.location) || "";
  // dispatch(
  //   action.getVBListTwo({
  //     onlyKey: "getProductInfo",
  //     url: `/v2/product/sku/info?productId=${productId}&channel=MOBILE&skuId=${skuId}`,
  //     type: "GET",
  //   })
  // ).then((json) => {
  //   dispatch({
  //     type: types.PRODUCT.LIPSTICKONOFF,
  //     data: json,
  //   });
  //   // setProductInfo(json, callback)(dispatch, getState);
  // });
};

export const setProductInfo = (json, callback) => (dispatch, getState) => {
  const isAttrChioce = getState().product.specs.showOrHide;
  // json.results.seckillActivityDto=null
    // 秒杀数据模拟
    // json.results.seckillActivityDto={
    //   countDown:{
    //     name:"距离活动结束",
    //     milliseconds:70000,
    //     precision:2
    //   },
    //   price:"1999.00",
    //   priceName:"秒杀价",
    //   startTime:"11月20日开始",
    //   status:"inProgress",
    //   // refreshSec:5
    // }
    
    // 秒杀数据模拟结束
  if (json && json.results && !json.results.code) {
    const newData = JSON.parse(JSON.stringify(json.results));
    let { vipActivity, sku, preSaleActivity, wholePreSaleActivity ,seckillActivityDto} =
      json.results;
    const {
      tags,
      price,
      costPrice,
      worthPrice,
      worthPriceName,
      status,
      discountRatePercent,
    } = sku;
    // 秒杀刷新
    if (seckillActivityDto&&seckillActivityDto.refreshSec) {
      setTimeout(() => {
        window.history.go(0)
      }, seckillActivityDto.refreshSec*1000);
    }
    
    // 当有专享活动时,需要将活动专享前缀拼接在品牌中文名之前，格式为: 活动专享前缀 | 品牌中文名
    if (vipActivity && vipActivity.prefix)
      newData.vipActivity.prefix = `${vipActivity.prefix}`;
    // 判断是否展示该商品的标签，且标签的数量由前端控制最多为4个
    newData.sku.isShowTags = !!(tags && tags.length > 0);
    // 通过tags里面item项的key来判断当前产品的显示渠道，展示对应的提示
    tags.forEach(function (item) {
      if (item.key == "miniProgram" || item.key == "app") {
        newData.saleChannel = item.value;
      }
    });
    newData.sku.tags = tags.slice(0, 4);
    // 通过preSaleActivity字段来判断是否为定金预售商品
    /**
     * 设置 newData.recombination = {} 来存储需要展示的价格区域
     * newData.recombination.price  现价(price)、预售价(preSaleActivity.preSalePrice)、会员价(roleActivity.price)、vb价(price)
     * newData.recombination.oldPrice 原价(costPrice) 促销价(costPrice) 定金价(preSaleActivity.earnestMoney)
     * newData.recombination.noActivityPrice 非活动价(price)
     * newData.recombination.customPrice 自定义名称价格(worthPriceName) 价值(worthPrice)
     */
    newData.recombination = {
      price: "",
      oldPrice: "",
      customPrice: "",
    };
    if (preSaleActivity) {
      // 定金预售商品
      if (preSaleActivity && preSaleActivity.preSalePrice)
        newData.recombination.price = preSaleActivity.preSalePrice;
      // 如果商品有预售,会在商品的售卖价格之后展示商品的原价
      if (price) newData.recombination.oldPrice = preSaleActivity.originPrice;
      if (preSaleActivity.deliveryTime)
        newData.deliveryTime = preSaleActivity.deliveryTime;
    } else {
      // 普通商品或者全额预售商品
      // 商品的售卖价格
      newData.recombination.price = price;
      // 如果商品有折扣,会在商品的售卖价格之后展示商品的原价
      if (costPrice) newData.recombination.oldPrice = costPrice;
    }
    // 当worthPrice字段存在时,展示商品的自定义价格以及名称 eg：worthPriceName worthPrice
    if (worthPrice)
      newData.recombination.customPrice = `${worthPriceName}￥${worthPrice}`;
    // 当商品为全额预售时，展示商品的预计发货时间
    if (wholePreSaleActivity && wholePreSaleActivity.deliveryTime)
      newData.deliveryTime = `预售商品，预计${wholePreSaleActivity.deliveryTime}日起发货`;
    if (discountRatePercent)
      newData.recombination.discountRatePercent = discountRatePercent;

    // 当黑金卡活动开启时展示对应的信息（roleActivity）
    // 传入点击已选按钮的事件
    newData.attrChoiceFun = () => {
      Sensor.go("PDPClick", {
        button_name: "选择",
        OP_code: Regexp.pathnameProductId(window.location),
      });
      openAttrChoice("normal")(dispatch, getState);
    };
    // 判断商品详情页底部按钮的展示逻辑
    newData.buttonType = [];
    /**
     * 1.平台专享优惠
     * 2.判断上下架状态 --- 展示已下架
     * 3.判断库存有无   --- 展示到货通知
     * 4.有库存状态下 区分商品的类型
     */

    if (vipActivity && vipActivity.buttonText) {
      newData.buttonType.push({
        classname: isAttrChioce
          ? "attr-chioce-presale-activity attr-chioce-presale-activitycurWidth"
          : "product-bottom-button-presale-activity product-bottom-button-presale-activitycurWidth middle-button",
        text: vipActivity.buttonText,
        fun: () => openDeepLink(true)(dispatch, getState),
      });
    }else if(seckillActivityDto&&seckillActivityDto.status!="ended"&&seckillActivityDto.status!="preheat"){
      const {status}=seckillActivityDto
      // 判断左边按钮无库存状态
      if (sku.status=="NO_INV") {
        if(status=="inProgress"){
          newData.buttonType.push({
            classname: isAttrChioce
              ? "attr-chioce-noInv preSale"
              : "product-bottom-button-noInvTwo preSale",
            text: "到货通知",
            fun: () => arrivalNotice()(dispatch, getState),
          });
          newData.buttonType.push({
            classname: "product-bottom-button-presale-activity",
            text: `秒杀价￥${seckillActivityDto.price}`,
            fun: isAttrChioce
            ? () => addToCart("payonce", 5, "all")(dispatch, getState)
            : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
            type: "presale-addtocart",
            tip: `立即购买`,
          });
        }else if(status=="sellOut"||status=="suspend"){
          newData.buttonType.push({
            classname: isAttrChioce
              ? "attr-chioce-noInv preSale"
              : "product-bottom-button-noInvTwo preSale",
            text: "到货通知",
            fun: () => arrivalNotice()(dispatch, getState),
          });
          newData.buttonType.push({
            classname: "product-bottom-button-presale-activity seckill-btn-sellOut",
            text: `秒杀价￥${seckillActivityDto.price}`,
            fun: null,
            type: "presale-addtocart",
            tip: `秒杀商品已抢完`,
          });
        }
        
      }else{
        if(status=="inProgress"){
          newData.buttonType.push({
            classname:"product-bottom-button-presale-addtocart product-btn-seckill",
            text: "原价购买",
            fun: isAttrChioce
            ? () => addToCart("payonce", 1)(dispatch, getState)
            : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
            type: "presale-addtocart",
            tip: `非活动价￥${price}`,
          });
          newData.buttonType.push({
            classname: "product-bottom-button-presale-activity",
            text: `秒杀价￥${seckillActivityDto.price}`,
            fun: isAttrChioce
            ? () => addToCart("payonce", 5, "all")(dispatch, getState)
            : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
            type: "presale-addtocart",
            tip: `立即购买`,
          });
        }else if(status=="sellOut"||status=="suspend"){
          newData.buttonType.push({
            classname:"product-bottom-button-presale-addtocart product-btn-seckill",
            text: "原价购买",
            fun: isAttrChioce
              ? () => addToCart("payonce", 1)(dispatch, getState)
              : () => openAttrChoice("normal", "addCart")(dispatch, getState),
            type: "presale-addtocart",
            tip: `非活动价￥${price}`,
          });
          newData.buttonType.push({
            classname: "product-bottom-button-presale-activity seckill-btn-sellOut",
            text: `秒杀价￥${seckillActivityDto.price}`,
            fun: null,
            type: "presale-addtocart",
            tip: `秒杀商品已抢完`,
          });
        }
      }
       
    } else if (status && status === "OFF") {
      newData.buttonType.push({
        classname: isAttrChioce
          ? "product-bottom-button-off open"
          : "product-bottom-button-off",
        text: "已下架",
        fun: null,
      });
    } else if (preSaleActivity) {
      // 定金预售按钮
      let hasNoInvButton = false;
      if (preSaleActivity.normalBuy != false) {
        if (status === "HAS_INV") {
          newData.buttonType.push({
            classname: isAttrChioce
              ? "attr-chioce-presale-addtocart"
              : "product-bottom-button-presale-addtocart",
            text: "现价购买",
            fun: isAttrChioce
              ? () => addToCart("addtocart", 1)(dispatch, getState)
              : () => openAttrChoice("normal", "addCart")(dispatch, getState),
            type: "presale-addtocart",
            tip: `非活动价￥${price}`,
          });
        } else {
          newData.buttonType.push({
            classname: isAttrChioce
              ? "attr-chioce-noInv preSale"
              : "product-bottom-button-noInvTwo preSale",
            text: "到货通知",
            fun: () => arrivalNotice()(dispatch, getState),
          });
        }
      }
      if (status !== "HAS_INV") {
        hasNoInvButton = true;
      }
      if (preSaleActivity.presaleInv === "HAS_INV") {
        const { buttonText, normalBuy, status } = preSaleActivity;
        let classname = isAttrChioce
          ? "attr-chioce-presale-activity "
          : "product-bottom-button-presale-activity ";
        if (normalBuy == false) {
          // 只有一个按钮时，按钮长度改变
          classname += "preSale ";
        }
        newData.buttonType.push({
          classname,
          text: buttonText,
          fun: isAttrChioce
            ? () => {
              status !== 1 &&
                addToCart("payonce", 2, "deposit")(dispatch, getState);
            }
            : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
          type: "presale-activity",
        });
      } else{
        if(!hasNoInvButton){
          let classname ="product-bottom-button-presale-addtocart product-bottom-button-presale-addtocart-fail "
          newData.buttonType.push({
            classname: classname + (!preSaleActivity.normalBuy ? "product-bottom-button-presale-two" : ""),
            text: "立即付定金",
            fun: null,
            type: "presale-addtocart",
            tip: "预售商品已抢完",
          });
        }else if(hasNoInvButton && !preSaleActivity.normalBuy){
          newData.buttonType.push({
            classname: isAttrChioce
              ? "attr-chioce-noInv preSale"
              : "product-bottom-button-noInvTwo preSale",
            text: "到货通知",
            fun: () => arrivalNotice()(dispatch, getState),
          });
        }
      }
      if (
        newData.buttonType.length === 1 &&
        newData.buttonType[0].text === "到货通知"
      ) {
        // 按钮只有一个到货通知时
        newData.buttonType[0].classname = isAttrChioce
          ? "attr-chioce-noInv"
          : "product-bottom-button-noInv";
      }
    } else if (status && status === "NO_INV") {
      newData.buttonType.push({
        classname: isAttrChioce
          ? "attr-chioce-noInv"
          : "product-bottom-button-noInv",
        text: "到货通知",
        fun: () => arrivalNotice()(dispatch, getState),
      });
    }else if(newData.saleChannel){
      newData.buttonType.push({
        classname: isAttrChioce
          ? "attr-chioce-addtocart"
          : "product-bottom-button-addtocart",
        text: "加入购物车",
        fun: isAttrChioce
          ? () => addToCart("addtocart", 1)(dispatch, getState)
          : () => openAttrChoice("normal", "addCart")(dispatch, getState),
      });
      newData.buttonType.push({
        classname: "product-bottom-button-payonce product-bottom-button-payonce-fail",
        text: "立即购买",
        fun: null
      });
     
    } else if (status && status === "HAS_INV") {
      // 定金预售
      // if (preSaleActivity) {
      //   const { buttonText, normalBuy, status } = preSaleActivity;
      //   if (normalBuy != false) {
      //     newData.buttonType.push({
      //       classname: isAttrChioce ? "attr-chioce-presale-addtocart" : "product-bottom-button-presale-addtocart",
      //       text: "现价购买",
      //       fun: isAttrChioce
      //         ? () => addToCart("addtocart", 1)(dispatch, getState)
      //         : () => openAttrChoice("normal", "addCart")(dispatch, getState),
      //       type: "presale-addtocart",
      //       tip: `非活动价￥${price}`,
      //     });
      //     newData.buttonType.push({
      //       classname: isAttrChioce ? "attr-chioce-presale-activity" : "product-bottom-button-presale-activity",
      //       text: buttonText,
      //       fun: isAttrChioce
      //         ? () => {
      //             status !== 1 && addToCart("payonce", 2, "deposit")(dispatch, getState);
      //           }
      //         : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
      //       type: "presale-activity",
      //     });
      //   } else {
      //     newData.buttonType.push({
      //       classname: isAttrChioce
      //         ? "attr-chioce-presale-activity attr-chioce-presale-activitycurWidth"
      //         : "product-bottom-button-presale-activity product-bottom-button-presale-activitycurWidth",
      //       text: buttonText,
      //       fun: isAttrChioce
      //         ? () => {
      //             status !== 1 && addToCart("payonce", 2, "deposit")(dispatch, getState);
      //           }
      //         : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
      //       type: "presale-activity",
      //     });
      //   }
      // } else
      if (wholePreSaleActivity) {
        // 全额预售
        newData.buttonType.push({
          classname: isAttrChioce
            ? "attr-chioce-addtocart"
            : "product-bottom-button-addtocart",
          text: "加入购物车",
          fun: isAttrChioce
            ? () => addToCart("addtocart", 1)(dispatch, getState)
            : () => openAttrChoice("normal", "addCart")(dispatch, getState),
        });
        newData.buttonType.push({
          classname: isAttrChioce
            ? "attr-chioce-payonce"
            : "product-bottom-button-payonce",
          text: "立即购买",
          fun: isAttrChioce
            ? () => addToCart("payonce", 3, "all")(dispatch, getState)
            : () => openAttrChoice("normal", "buyNow",()=>{},seckillActivityDto&&seckillActivityDto.status)(dispatch, getState),
        });
      } else {
        // 普通商品
        newData.buttonType.push({
          classname: isAttrChioce
            ? "attr-chioce-addtocart"
            : "product-bottom-button-addtocart",
          text: "加入购物车",
          fun: isAttrChioce
            ? () => addToCart("addtocart", 1)(dispatch, getState)
            : () => openAttrChoice("normal", "addCart")(dispatch, getState),
        });
        newData.buttonType.push({
          classname: isAttrChioce
            ? "attr-chioce-payonce"
            : "product-bottom-button-payonce",
          text: "立即购买",
          fun: isAttrChioce
            ? () => addToCart("payonce", 1)(dispatch, getState)
            : () => openAttrChoice("normal", "buyNow")(dispatch, getState),
        });
      }
    }
    newData.isAttrChioce = isAttrChioce;
    dispatch({
      type: types.PRODUCT.INFO,
      data: newData,
      milliseconds:
        (newData.preSaleActivity && newData.preSaleActivity.countDown) || null,
    });
  } else if (json && json.results && json.results.code == "40014099")
    window.location.href = "/error";
  callback && callback(json);
};

/**
 * 调用广告位接口判断是否展示倩碧定制开关
 */
export const getLipStickOnOff2 = () => (dispatch) => {
  dispatch(
    action.firstPopupImg({
      onlyKey: "firstPopupImg2",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      type: "POST",
      data: {
        queryBody: {
          locationLabel: "CUSTOM:PRODUCT:NEW",
          memberGroupId: 0,
        },
      },
    })
  ).then((json) => {
    setLipStickOnOff2(json)(dispatch);
  });
};

const setLipStickOnOff2 = (json) => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  if (json && json.results && !json.results.code) {
    const obj = {
      isShow: false,
      link: "",
      imagePath: "",
    };

    if (
      json &&
      json.results &&
      json.results.resourceList &&
      json.results.resourceList.length > 0 &&
      json.results.resourceList[0] &&
      json.results.resourceList[0].content
    ) {
      json.results.resourceList[0].content.split(",").map((item) => {
        const itemNew = item.split("-");
        if (productId === itemNew[0]) obj.isShow = true;
      });
    }
    obj.link = json.results.resourceList[0].link;
    obj.imagePath = json.results.resourceList[0].imagePath;
    dispatch({
      type: types.PRODUCT.LIPSTICKONOFF2,
      data: obj,
    });
  }
};
/**
 * 调用产品详情信息接口 获取对应的产品功效、主要成分、产地、规格参数、以及图文详情
 */
export const getProductDetailsInfo = () => (dispatch) => {
  dispatch(
    action.getProductDetailsInfo({
      onlyKey: "getProductDetailsInfo",
      url: `/v1/product/product/skuDetailInfo`,
      type: "POST",
      data: {
        queryBody: {
          channel: "mobile",
          productId: Regexp.pathnameProductId(window.location),
          skuId: Regexp.searchSkuId(window.location) || "",
        },
      },
    })
  ).then((json) => {
    setProductDetailsInfo(json)(dispatch);
  });
};

/**
 * 根据详情信息接口数据处理页面逻辑
 */
export const setProductDetailsInfo = (json) => (dispatch) => {
  if (json && json.results && !json.results.code) {
    const {
      skuAttrDtos,
      mobileHtml,
      hasHtml,
      effect,
      element,
      description,
      originNameCN,
      specDesc,
        // 根据这个字段true/false来判断图文详情使用php图文还是使用接口图文
      aemUrl
    } = json.results;
    // 首先判断 hasHtml 值为0时,展示商品的文字信息,值为1时，通过截取mobileHtml中opId请求cms接口获取图文详情
    // description存在时, effect、element不展示， 否则展示
    // originNameCN一直展示，但是当originNameCN值为空时，不展示
    const detailsInfo = [];
    detailsInfo.push({
      key: "产品功效",
      value: effect,
    });
    detailsInfo.push({
      key: "产品描述",
      value: description,
    });
    detailsInfo.push({
      key: "主要成分",
      value: element,
    });
    detailsInfo.push({
      key: "规格描述",
      value: specDesc,
    });
    if (originNameCN) {
      detailsInfo.push({
        key: "产地",
        value: originNameCN,
      });
    }

    if (hasHtml && hasHtml === 1 && mobileHtml) {
      const sendOPCode =
        Regexp.searchOPCode(mobileHtml) ||
        Regexp.pathnameProductId(window.location);
      action.getProductDetails(sendOPCode, (json) => {
        if (json && json.status === 0 && json.message) {
          const graphicDetails = json.message;
          dispatch({
            type: types.PRODUCT.DETAILS_DATA,
            data: {
              skuAttrDtos,
              mobileHtml,
              detailsInfo,
              graphicDetails,
            },
          });
        }
      });
    }
    if (aemUrl) {
      axios.get(mobileHtml)
          .then(function (response) {
            if (response && response.data) {
              let aemDom = response.data;
              dispatch({
                type: types.PRODUCT.DETAILS_DATA,
                data: {
                  skuAttrDtos,
                  mobileHtml,
                  detailsInfo,
                  aemUrl,
                  aemDom
                },
              });
            }
          })
          .catch(function (error) {
            console.log(error,'error');
          });
    }
    dispatch({
      type: types.PRODUCT.DETAILS_DATA,
      data: {
        skuAttrDtos,
        mobileHtml,
        detailsInfo,
        aemUrl
      },
    });
  } else {
    window.location.href = "/error";
  }
};

/**
 * 调用商品详情页 - 评论列表接口 获取对应的产品的评论列表
 */
function getCommentList(params, dispatch, getState) {
  const productId = Regexp.pathnameProductId(window.location);
  const { pageNo, pageSize } = params;
  const commentList = getState().product.commentList;
  if (
    commentList &&
    commentList.hasOwnProperty("hasNext") &&
    !commentList.hasNext
  )
    return;
  dispatch(
    action.getCommentList({
      onlyKey: "getCommentList",
      url: `/v1/product/comment/commentList?productId=${productId}&pageNo=${pageNo || 1
        }&pageSize=${pageSize || 10}`,
      type: "GET",
    })
  ).then((json) => {
    setCommentList(json, dispatch, getState);
  });
}

/**
 * 设置评论数据
 */

function setCommentList(json, dispatch, getState) {
  if (json && json.results && !json.results.code) {
    const { hasNext, commentDtos, currentPage, productScore, totalRecord } =
      json.results;
    const commentList = getState().product.commentList;
    const commenListData =
      commentList && commentList.commenListData
        ? commentList.commenListData.concat(commentDtos)
        : commentDtos;
    dispatch({
      type: types.PRODUCT.COMMENTLIST,
      data: {
        commenListData,
        hasNext,
        currentPage,
        productScore,
        totalRecord,
      },
    });
  }
}

const setProductPost = (json) => (dispatch) => {
  if (
    json &&
    json.results &&
    !json.results.code &&
    json.results.records &&
    json.results.records.length > 0
  ) {
    const productId = Regexp.pathnameProductId(window.location);
    const { records } = json.results;
    const newArray = [];
    let isMore;
    records.some((item, index) => {
      if (index >= 4) return;
      const { template, openId, postId } = item;
      const newObj = { ...item };
      const type = {
        NINE_BLOCK: "gridView",
        GRAPHIC_TEXT: "graphicText",
      };
      newObj.link = `/beautyCommunity/${type[template]}/${postId}/?openId=${openId}`;
      newArray.push(newObj);
    });
    if (json.results.records.length > 4)
      isMore = `/product/relatedPost/${productId}/`;
    dispatch({
      type: types.PRODUCT.BEAUTYPOSTS,
      data: {
        isMore,
        newArray,
        total: json.results.total,
      },
    });
  }
};
/**
 * 调用/v1/product/consulation/consulationList 获取商品的相关的咨询信息
 */
export const getProductConsulationt = () => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  dispatch(
    action.getProductConsulationt({
      onlyKey: "getProductConsulationt",
      url: `/v1/product/consulation/consulationList?productId=${productId}&pageNo=1&pageSize=3`,
      type: "GET",
    })
  ).then((json) => {
    setProductConsulationt(json)(dispatch);
    // if (json && json.results && !json.results.code) {
    //   dispatch({
    //     type: types.PRODUCT.CONSULATION,
    //     data: json.results,
    //   });
    // }
  });
};

const setProductConsulationt = (json) => (dispatch) => {
  if (json && json.results && !json.results.code) {
    dispatch({
      type: types.PRODUCT.CONSULATION,
      data: json.results,
    });
  }
};
/**
 * 调用/v1/product/product/recommend/ 获取商品的搭配推荐信息
 */
export const getProductRecommend = () => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  dispatch(
    action.getProductRecommend({
      onlyKey: "getProductRecommend",
      url: `/v1/product/product/recommend/${productId}/1/4`,
      type: "GET",
    })
  ).then((json) => {
    setProductRecommend(json)(dispatch);
  });
};

const setProductRecommend = (json) => (dispatch) => {
  if (
    json &&
    json.results &&
    !json.results.code &&
    json.results.recommendProductDtoList &&
    json.results.recommendProductDtoList.length > 0
  ) {
    dispatch({
      type: types.PRODUCT.RECOMMEND,
      data: json.results,
    });
  }
};
// 判断当前用户是否可以评论

export const getIfComment = () => (dispatch) => {
  if (!GetSingleCookie2({ key: "Token" })) return;
  const productId = Regexp.pathnameProductId(window.location);
  dispatch(
    action.getIfComment({
      onlyKey: "getIfComment",
      url: `/v3/product/comment/commodity-details/validate-send-comment/${productId}`,
      type: "GET",
    })
  ).then((json) => {
    setIfComment(json)(dispatch);
  });
};
const setIfComment = (json) => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  const skuId = Regexp.searchSkuId(window.location) || "";
  if (json && json.results && !json.results.code && json.results.status === 1) {
    dispatch({
      type: types.PRODUCT.IFCOMMENT,
      data: {
        productId,
        commentType: 1,
        skuId: json.results.skuId || skuId,
        orderId: json.results.orderId,
      },
    });
  }
};

function startCustomerService(params, dispatch) {
  const productId = Regexp.pathnameProductId(window.location);
  Sensor.go("PDPClick", {
    OP_code: productId,
    button_name: "在线客服",
  });
  GoogleAnalytics.pushV2({
    event: "productDetailInteraction",
    // pdpInteractionDetail: "在线客服",
    pdpInteractionType: "在线客服",
  });
  Sensor.go("CustomerServiceClick", {
    button_location: "Product-detail-page",
  });
  dispatch(
    action.getPersonalInfo({
      onlyKey: "getPersonalInfo",
      url: `/v1/myaccount/user/userProfile`,
      type: "GET",
    })
  ).then((json) => {
    if (
      json &&
      json.jQueryStatus &&
      (json.jQueryStatus.status === 401 || json.status === 401)
    ) {
      window.location.href = `/login?historyLocation=${window.location.pathname}${window.location.search}`;
    } else {
      const token = GetSingleCookie2({ key: "Token" });
      const href = window.location.href;
      let url = "https://uataicca.sephora.cn/webchatbot/h5chat_sephora.html";
      if (Utils.getEnv("restfulEnv") === "production") {
        url = "https://aicca.sephora.cn/webchatbot/h5chat_sephora.html";
      }
      window.location.href = `${url}?sysNum=1603354924318&sourceId=70181&lang=zh_CN&token=${token}&proLink=${href}`;
    }
  });
  // dispatch(userStartCustomerService({ currentURL: `${window.location.pathname}${window.location.search}` }));
}

function setPageScrollTop() {
  const scrollTop = bodyScrollTop.get();
  $(".product-page").css({ bottom: scrollTop });
}

function setWindowScrollTop() {
  const scrollTop = parseFloat($(".product-page").css("bottom"));
  bodyScrollTop.set(scrollTop);
  $(".product-page").css({ bottom: 0 });
}

export const getRankingList = () => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  const skuId = Regexp.searchSkuId(window.location) || "";
  const channel =
    window &&
      window.navigator &&
      window.navigator.userAgent &&
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
      ? "WECHAT"
      : "MOBILE";
  if (!productId) return;
  dispatch(
    action.getRanking({
      onlyKey: "getRanking",
      url: `/v1/product-extend/ranking/${productId}?skuId=${skuId}&channel=${channel}`,
      type: "GET",
    })
  ).then((json) => {
    setRankingList(json)(dispatch);
  });
};

const setRankingList = (json) => (dispatch) => {
  if (json && json.results && !json.errorMessage && json.status === 0) {
    dispatch({
      type: types.PRODUCT.RANKING,
      RANKING: json.results,
    });
  }
};
/**
 * 调用图片广告位接口判断是否展示miumiu定制开关
 */
export const getLipStickOnOff3 = () => (dispatch) => {
  dispatch(
    action.firstPopupImg({
      onlyKey: "firstPopupImg3",
      url: "/v1/marketing/MktSimpleGroupController/simpleImageGroup",
      type: "POST",
      data: {
        queryBody: {
          locationLabel: "MIUMIU:AD",
          memberGroupId: 0,
        },
      },
    })
  ).then((json) => {
    setLipStickOnOff3(json)(dispatch);
  });
};

const setLipStickOnOff3 = (json) => (dispatch) => {
  const productId = Regexp.pathnameProductId(window.location);
  if (json && json.results && !json.results.code) {
    const obj = {
      isShow: false,
      link: "",
      imagePath: "",
    };
    if (
      json &&
      json.results &&
      json.results.resourceList &&
      json.results.resourceList.length > 0 &&
      json.results.resourceList[0]
    ) {
      json.results.resourceList[0].content.split(",").map((item) => {
        const itemNew = item.split("-");
        if (productId === itemNew[0]) obj.isShow = true;
      });
      obj.link = `${json.results.resourceList[0].link}?productId=${productId}&step=one&odorsku=&lidsku=&bodysku=`;
      obj.imagePath = `${json.results.resourceList[0].imagePath}`;
      dispatch({
        type: types.PRODUCT.LIPSTICKONOFF3,
        data: obj,
      });
    }
  }
};

const openDeepLink = () => (dispatch, getState) => {
  dispatch({
    type: types.PRODUCT.PDP_PRODUCT_DEEPLINK_OPEN,
    PDP_PRODUCT_DEEPLINK_OPEN: !getState().product.showDeeplink,
  });
};

export const noinvPopup = (skuId, ifShow) => (dispatch, getState) => {
  console.log(ifShow, 'ifShow');
  dispatch(
    action.noinvPopup({
      onlyKey: "noinvPopup",
      url: `/v1/product/sku/no-inv/toast?skuId=${skuId}&channel=MOBILE`,
      type: "GET",
    })
  ).then((json) => {
    if (json && json.results && json.results.toast) {
      if (ifShow === false) {
        dispatch(
          popupAlert(1, "PopupToast", {
            _text: json.results.text,
            _autoClose: true,
            _zIndex: 202,
          })
        );
      } else {
        dispatch(
          popupAlert(1, "PopupCleaning", {
            _text: json.results.text,
            _zIndex: 202,
            _customTrueCallback: () => {
              changeAttr(json.results.jumpSkuId, dispatch, getState);
              // window.location.href = `/product/${json.results.jumpSpuId}.html?sku=${json.results.jumpSkuId}`;
            },
            _cancel: true,
            _btnWord: "确定",
          })
        );
      }

    }
  });
};

