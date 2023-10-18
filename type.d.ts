declare let PAGESHOWSTATUS: boolean;

declare interface NodeRequire {
  ensure?: (
    arg: any[],
    func: (requier: object) => object,
    name?: string
  ) => object;
}

declare module "*.scss";
declare module "*.css";
declare module "compression";
declare module "mime";
declare module "js-cookie";
declare module "jquery";
declare module "qr-image";
declare module "webpack-hot-middleware";
declare module "webpack-dev-middleware";
declare module "cookie-parser";

declare let __DEV__: any;
declare let __BUILD_TIME__: string;

declare let SEPHORA_JSINVOKE: () => any;

declare interface SephoraConfig {
  gatewayShortDomain: string;
  restfulEnv: string;
  localhost: string;
  static: string;
  staticUnSsl: string;
  abtest: string;
  newtest: string;
  /**
   * eg: stageapi.sephora.cn
   */
  api: string;
  nodeServer: string;
  seo: string;
}

declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        E2E_ENV: "stage" | "prod" | "localStage" | "localProd";
      }
    }
  }
}

declare interface Window {
  PAGESHOWSTATUS: boolean;
  __INITIAL_STATE__: any;
  __INITIAL_ENV__: {
    Env: SephoraConfig;
    Token: null | string;
    UID: null | string;
    channel: string;
    index: string;
    pathname: string;
    query: { [K: string]: string };
    routeParams: {};
  };
  SEPHORA_JSINVOKE: typeof SEPHORA_JSINVOKE;
}

declare interface RootState {
  homepage: import("./src/common/reducers/homepage").HomepageState;
  nichefragrance: any;
  firstSection: any;
  secondSection: any;
  thirdSection: any;
  BrandAllcon: any;
  BrandAll: any;
  HotBrandAllcon: any;
  search: import("./src/common/reducers/search").SearchState;
  device: any;
  cart: import("./src/common/reducers/cart").CartState;
  popup_component: any;
  seo: any;
  CommonVenders: any;
  view: any;
  homeB: any;
  Response: any;
  globalReference: any;
  dependency: any;
  googleAnalytics: any;
  myAccount: any;
  onlineReturn: any;
  register: any;
  login: any;
  product: any;
  routing: any;
  rewards: any;
  plpPage: any;
  giftIntelligent: any;
  MyAccountCouponConts: Array<any>;
  doorCouponConts:Array<any>;
  orderList: any;
}
