import {
  MY_ACCOUNT,
  MY_ADDRESS,
  MY_PROFILE,
  UPDATEPASSWORD,
} from "../constants/ActionTypes";

const initialGAState = {
  showhelp: false,
  body: {},
  UIProfile: "",
  UIOrderLists: "",
  UIToolLists: "",
  UIManagement: "",
  UIMember: "",
  AllAddress: "",
  addressStatus: "allAddress",
  province_city_areas: "",
  isShowProvince: false,
  currentIndex: "",
  pageShow: "",
  profile: "",
  cardlist: "",
  userMobile: "",
  integralFlowData: "",
  myMsgTap: "",
  messageList: "",
  offlineOrderList: "",
  orderSwiper: [],
  invoiceListData: [],
  myHistoryCoupon: [],
};

export default function(state = initialGAState, action = {}) {
  switch (action.type) {
    case UPDATEPASSWORD.SHOWHELP:
      return Object.assign({}, state, {
        showhelp: action.data,
      });
    case UPDATEPASSWORD.BODY:
      return Object.assign({}, state, {
        body: action.data,
      });
    case MY_ACCOUNT.MY_ACCOUNT_PROFILE:
      return Object.assign({}, state, {
        UIProfile: action.data,
      });
    case MY_ACCOUNT.MY_ACCOUNT_ORDERS:
      return Object.assign({}, state, {
        UIOrderLists: action.data,
      });
    case MY_ACCOUNT.MY_ACCOUNT_TOOLS:
      return Object.assign({}, state, {
        UIToolLists: action.data,
      });
    case MY_ACCOUNT.MY_ACCOUNT_GUIDEIMAGE:
      return Object.assign({}, state, {
        GuideImageLists: action.data,
      });
    case MY_ACCOUNT.MANAGEMENT_OPTIONS:
      return Object.assign({}, state, {
        UIManagement: action.data,
      });
    case MY_ACCOUNT.MEMBER_INFO:
      return Object.assign({}, state, {
        UIMember: action.data,
      });
    case MY_ACCOUNT.MY_COUPON_HISTORY:
      return Object.assign({}, state, {
        myHistoryCoupon: action.data,
      });
    case MY_ADDRESS.ALL_ADDRESSS:
      return Object.assign({}, state, {
        AllAddress: action.data,
      });
    case MY_ADDRESS.ADDRESSS_STATUS:
      return Object.assign({}, state, {
        addressStatus: action.data,
      });
    case MY_ADDRESS.SAVE_PROVINCE_DATA:
      return Object.assign({}, state, {
        province_city_areas: action.data,
      });
    case MY_ADDRESS.CONTROL_PROVINCE:
      return Object.assign({}, state, {
        isShowProvince: action.data,
      });
    case MY_ADDRESS.CURRENT_INDEX:
      return Object.assign({}, state, {
        currentIndex: action.data,
      });
    case MY_PROFILE.PAGE_SHOW:
      return Object.assign({}, state, {
        pageShow: action.data,
      });
    case MY_PROFILE.PROFILE_INFO:
      return Object.assign({}, state, {
        profile: action.data,
      });
    case MY_PROFILE.CARD_LIST:
      return Object.assign({}, state, {
        cardlist: action.data,
      });
    case MY_PROFILE.USER_MOBILE:
      return Object.assign({}, state, {
        userMobile: action.data,
      });
    case MY_ACCOUNT.INTEGRAL_FLOW:
      return Object.assign({}, state, {
        integralFlowData: action.data,
      });
    case MY_ACCOUNT.MYMSG_TAP:
      return Object.assign({}, state, {
        myMsgTap: action.data,
      });
    case MY_ACCOUNT.MESSAGHE_LIST:
      return Object.assign({}, state, {
        messageList: action.data,
      });
    case MY_ACCOUNT.OFFLINE_ORDER_LIST:
      return Object.assign({}, state, {
        offlineOrderList: action.data,
      });
    case MY_ACCOUNT.MY_ACCOUNT_ORDERSWIPER:
      return Object.assign({}, state, {
        orderSwiper: action.data,
      });
    case MY_ACCOUNT.MY_ACCOUNT_INVOICELISTDATA:
      return Object.assign({}, state, {
        invoiceListData: action.data,
      });
    default:
      return state;
  }
}
