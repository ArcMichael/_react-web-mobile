import { PRODUCT } from "../constants/ActionTypes";
const initialGAState = {
  VBList:[],
  tabIndex: 0,
  tabMore: false,
  detailsTabIndex: 0,
  detailsData: {},
  commentList: {},
  productInfo: "",
  beautyPosts: "",
  productSwiper: "",
  consulation: "",
  recommend: "",
  specs: {
    showOrHide: false,
    source: "",
  },
  recordNowNumber: 1,
  name: "reduce",
  lipStickOnOff: "",
  lipStickOnOff2: "",
  lipStickOnOff3: "", //miumiu
  arrivalData: "",
  ifComment: false,
  specialSkuId: "",
  colsePickColors: false,
  milliseconds: null,
  QCPTQ: null,
  ifshow: false,
  tabIndexV2: 0,
  ranking: [],
  pdpFilterPage: null,
  PDP_IS_OPEN_FILTER_ORIGIN: null,
  PdpFilterTwo: null,
  PdpFilterThree: null,
  PdpFilterComb: null,
  promotionTags: [],
  promotionFast: [],
  showDeeplink:false
};
export default function(state = initialGAState, action = {}) {
  switch (action.type) {
    case PRODUCT.VBLIST:
      return Object.assign({}, state, {
        VBList: action.data,
      });
    case PRODUCT.TAB_INDEX:
      return Object.assign({}, state, {
        tabIndex: action.data,
      });
    case PRODUCT.TAB_INDEXV2:
      return Object.assign({}, state, {
        tabIndexV2: action.data,
        ifshow: action.ifshow,
      });
    case PRODUCT.TAB_MORE:
      return Object.assign({}, state, {
        tabMore: action.data,
      });
    case PRODUCT.DETAILS_TAP:
      return Object.assign({}, state, {
        detailsTabIndex: action.data,
      });
    case PRODUCT.DETAILS_DATA:
      return Object.assign({}, state, {
        detailsData: action.data,
      });
    case PRODUCT.COMMENTLIST:
      return Object.assign({}, state, {
        commentList: action.data,
      });
    case PRODUCT.INFO:
      return Object.assign({}, state, {
        productInfo: action.data,
        milliseconds: action.milliseconds,
      });
    case PRODUCT.BEAUTYPOSTS:
      return Object.assign({}, state, {
        beautyPosts: action.data,
      });
    case PRODUCT.SWIPER:
      return Object.assign({}, state, {
        productSwiper: action.data,
      });
    case PRODUCT.CONSULATION:
      return Object.assign({}, state, {
        consulation: action.data,
      });
    case PRODUCT.RECOMMEND:
      return Object.assign({}, state, {
        recommend: action.data,
      });
    case PRODUCT.SPECS:
      return Object.assign({}, state, {
        specs: action.data,
      });
    case PRODUCT.RECORD_NOW_NUM:
      return Object.assign({}, state, {
        recordNowNumber: action.data,
        name: action.name,
      });
    case PRODUCT.LIPSTICKONOFF:
      return Object.assign({}, state, {
        lipStickOnOff: action.data,
      });
    case PRODUCT.LIPSTICKONOFF2:
      return Object.assign({}, state, {
        lipStickOnOff2: action.data,
      });
    case PRODUCT.LIPSTICKONOFF3: //miumiu
      return Object.assign({}, state, {
        lipStickOnOff3: action.data,
      });
    case PRODUCT.ARRIVALNOTICE:
      return Object.assign({}, state, {
        arrivalData: action.data,
      });
    case PRODUCT.IFCOMMENT:
      return Object.assign({}, state, {
        ifComment: action.data,
      });
    case PRODUCT.SPECIAL_SKUID:
      return Object.assign({}, state, {
        specialSkuId: action.data,
      });
    case PRODUCT.CLOSE_PCIK_COLORS:
      return Object.assign({}, state, {
        colsePickColors: action.data,
      });
    case PRODUCT.QCPTQ:
      return Object.assign({}, state, {
        QCPTQ: action.QCPTQ,
      });
    case PRODUCT.RANKING:
      return Object.assign({}, state, {
        ranking: action.RANKING,
      });
    case PRODUCT.PDP_FILTER_OPEN_PAGE:
      return Object.assign({}, state, {
        pdpFilterPage: action.PDP_FILTER_OPEN_PAGE_RESULT,
      });
    case PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE:
      return Object.assign({}, state, {
        PDP_IS_OPEN_FILTER_ORIGIN: action.PDP_FILTER_ORIGIN_DATA_RESULT,
      });
    case PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_TWO:
      return Object.assign({}, state, {
        PdpFilterTwo: action.PDP_FILTER_ORIGIN_DATA_TWO,
      });
    case PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_THREE:
      return Object.assign({}, state, {
        PdpFilterThree: action.PDP_FILTER_ORIGIN_DATA_THREE,
      });
    case PRODUCT.PDP_PRODUCT_SKU_CUSTOM_MADE_COMB:
      return Object.assign({}, state, {
        PdpFilterComb: action.PDP_FILTER_ORIGIN_DATA_COMB,
      });
    case PRODUCT.PDP_PRODUCT_PROMOTION_TAGS:
      return Object.assign({}, state, {
        promotionTags: action.PDP_PRODUCT_PROMOTION_TAGS,
      });
      case PRODUCT.PDP_PRODUCT_PROMOTION_FAST:
        return Object.assign({}, state, {
          promotionFast: action.PDP_PRODUCT_PROMOTION_FAST,
        });
    case PRODUCT.PDP_PRODUCT_DEEPLINK_OPEN:
      return Object.assign({}, state, {
        showDeeplink: action.PDP_PRODUCT_DEEPLINK_OPEN,
      });
    default:
      return state;
  }
}
