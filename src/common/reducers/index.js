import { combineReducers } from "redux";
import createCommonReducer from "./createCommonReducer";
import CommonVenders from "./CommonVenders"; // 三方数据 Emarsys
import view from "./view"; // 用于存放设备尺寸信息
import Response from "./Response"; // ajax请求监控
import homeB from "./HomeB"; // homeB 页面 redux数据
import globalReference from "./globalReference"; // 页面全局数据
import dependency from "./dependency"; // 三方代码监控
import googleAnalytics from "./googleAnalytics"; // GA检测用户登录状态
import search from "./search"; // homeB 页面 redux数据
import device from "./device";
import cart from "./cart";
import popup_component from "./popup_component";
import nichefragrance from "./nichefragrance";
import myAccount from "./myAccount";
import onlineReturn from "./onlineReturn";
import register from "./register";
import login from "./login";
import product from "./product";
import lipQuiz from "./lipQuiz";
import homepage from "./homepage";
import rewards from "./reward";
import categoryOne from "./category/categoryOne";
import plpPage from "./plpPage"; // plp数据
import giftIntelligent from "./giftIntelligent";
import giftIntelligentNew from "./giftintelligentNew";
import MyAccountCouponConts from "./MyAccountCoupon";
import orderList from './orderList';
import doorCouponConts from "./doorCoupon"
// ./Props 都是存储同步数据
const seo = createCommonReducer();
const productFirstSection = createCommonReducer(); // pdp页第一屏
const CategoryConts = createCommonReducer();
const CategoryConfigConts = createCommonReducer();
// 新版首页首屏数据1 2 3
const firstSection = createCommonReducer(); // 首页第一屏数据
const secondSection = createCommonReducer(); // 首页第一屏数据
const thirdSection = createCommonReducer(); // 首页第一屏数据
const BrandAllcon = createCommonReducer(); // 首页第一屏数据 //全部品牌页
const BrandAll = createCommonReducer(); // 全部品牌页
const HotBrandAllcon = createCommonReducer(); // 全部品牌页
const Hotsales = createCommonReducer(); // 畅销榜单

/**
 * @typedef {{
 *    homepage:import('./homepage').HomepageState;
 *    nichefragrance:any;
 *    firstSection:any;
 *    secondSection:any;
 *    thirdSection:any;
 *    BrandAllcon:any;
 *    BrandAll:any;
 *    HotBrandAllcon:any;
 *    search:import('./search').SearchState;
 *    device:any;
 *    cart:import('./cart').CartState;
 *    popup_component:any;
 *    seo:any;
 *    CommonVenders:any;
 *    view:any;
 *    homeB:any;
 *    Response:any;
 *    globalReference:any;
 *    dependency:any;
 *    googleAnalytics:any;
 *    myAccount:any;
 *    onlineReturn:any;
 *    register:any;
 *    login:any;
 *    product:any;
 *    routing: any;
 *    rewards:any;
 *    plpPage：any;
 * }} RootState
 */

const createRootReducer = () =>
  combineReducers({
    homepage,
    nichefragrance,
    firstSection,
    secondSection,
    thirdSection,
    BrandAllcon,
    BrandAll,
    HotBrandAllcon,
    Hotsales,
    search,
    device,
    cart,
    popup_component,
    seo,
    CommonVenders,
    view,
    homeB,
    Response,
    globalReference,
    dependency,
    googleAnalytics,
    myAccount,
    onlineReturn,
    register,
    login,
    product,
    lipQuiz,
    rewards,
    productFirstSection,
    CategoryConfigConts,
    CategoryConts,
    categoryOne,
    plpPage,
    giftIntelligent,
    giftIntelligentNew,
    MyAccountCouponConts,
    orderList,
    doorCouponConts
  });

export default createRootReducer;
