import React, { Component } from "react";
import { connect } from "react-redux";
import OiaWrap from "@/components/OiaWrap";
import { emarsysGo } from "@/actions/commonVenders";
import BottomMenus from "@/components/BottomMenus";
import isBrowser from "@/Utils/utils/isBrowser";
import settings from "@/containers/HomeB/settings";
import Sensor from "@/Utils/sensor/index";
import ActionOnlineReference from "@/actions/onlineReference";
import Supports from "@/lib/Supports";
import { RouteComponentProps, withRouter } from "react-router";
import Utils from "@/lib/utils";
import MyAccount from "@/lib/services/MyAccount";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import loadable from "@loadable/component";
import { Provider, HomepageContextInitvalue } from "./context";
import Popup from "./Popup";
import Head from "./components/headV2";
import TabOneContent from "./TabOneContent";
import Tabs from "./components/Tabs";
import OpenApp from "./components/OpenApp";
// import BindPhone from "../LoginStatePages/components/BindPhone"

if (__DEV__ && isBrowser()) {
  require("../../../public/style/Homepage.scss");
}

const TabPanel = Tabs.TabPanel;

const TabCommonContent = loadable(() => import("./TabCommonContent"));

/**
 * @typedef {{
 * homepage:RootState['homepage'];
 * cart:RootState['cart'];
 * globalReference: RootState['globalReference'];
 * } & import('react-router').RouteComponentProps<{
 *  tab:string;
 * }> } HomeBProps
 */

export interface HomeBProps
  extends RouteComponentProps,
  Pick<RootState, "homepage" | "cart" | "globalReference"> {
  emarsysGo: any;
}

/**
 * @extends {React.Component<HomeBProps>}
 */

export interface HomeBState {
  active: any;
  minihead: boolean;
  animate: any;
  defaultFixedTopHeight: number;
  defaultTabUlHeight: number;
  afterGetIsLogin: boolean;
  cardInfo: any;
  scrollTop: number;
}

export class HomeB extends Component<HomeBProps, HomeBState> {
  /**
   * @param {HomeBProps} props
   */
  headRef: Head | null = null;
  TabsRef: Tabs | null = null;
  constructor(props: HomeBProps) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.getCommonTabs = this.getCommonTabs.bind(this);
    this.getTabByQueryString = this.getTabByQueryString.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getUserCard = this.getUserCard.bind(this);
    this.getContextValue = this.getContextValue.bind(this);
    const { match, homepage } = props;
    const { TabList } = homepage;
    const defaultTab =
      Array.isArray(TabList) && TabList[0] ? TabList[0].id : "";

    this.state = {
      active: (match.params && match.params.tab) || defaultTab,
      minihead: false,
      animate: null,
      defaultFixedTopHeight: 0,
      defaultTabUlHeight: 0,
      afterGetIsLogin: false,
      cardInfo: null,
      scrollTop: 0,
    };
    new Supports();
  }

  UNSAFE_componentWillMount() {
    ActionOnlineReference.AutoOpenOnlineReference();
  }

  componentDidMount() {
    sessionStorage.setItem("rout", window.location.pathname);
    Sensor.go("$pageview", {
      action_id:"1000001_000",
      page_id:"MB_1000001",
      $screen_name: "首页",
    });


    this.getUserCard();
    Utils.afterPageShow().then(() => {
      this.props.emarsysGo({ timeout: 2500 });
    });

    window.addEventListener("scroll", this.handleScroll);
    if (this.headRef && this.headRef.fixedTopRef) {
      this.setState({
        defaultFixedTopHeight: this.headRef.fixedTopRef.offsetHeight,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  getContextValue() {
    const contextValue = { ...HomepageContextInitvalue };
    contextValue.isLogin = Boolean(this.state.cardInfo);
    contextValue.usrCardInfo = this.state.cardInfo;
    contextValue.afterGetIsLogin = this.state.afterGetIsLogin;
    contextValue.shopcartNumber =
      typeof this.props.cart.QCPTQ === "number" ? this.props.cart.QCPTQ : 0;

    contextValue.scrollTop = this.state.scrollTop;
    return contextValue;
  }

  /**
   * @param {Event} e
   */
  handleScroll() {
    const scrollTop = bodyScrollTop.get();

    if (scrollTop >= settings.showMimiHeadTop) {
      this.setState({
        minihead: true,
        animate: true,
        scrollTop,
      });
    } else {
      this.setState({
        minihead: false,
        animate: false,
        scrollTop,
      });
    }
  }

  getUserCard() {
    MyAccount.user
      .userCardInfo()
      .then((res) => {
        this.setState({
          cardInfo: res.status === 0 && res.results ? res.results : null,
          afterGetIsLogin: true,
        });
        if (isBrowser()) {
          Sensor.go("clickBanner_App_Mob", {
            page_id: "MB_1000001",
            action_id: "1000001_000",
            $screen_name: "[不限]",
            $title: "主页",
            page_type_detail: "home",
            page_type: "home",
            platform_type: "mobile",
            $url_path: window.location.href,
            $url_query: window.location.search,
            $url: window.location.href,
            current_url: window.location.href,
            vip_card: res.results.cardNo,
            vip_card_type: res.results.cardType
          });
        }
      })
      .catch(() => {
        this.setState({
          afterGetIsLogin: true,
        });
      });
  }

  getTabByQueryString() {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const tab = hash ? hash.replace("#", "") : "";
      return tab && Number(tab).toString() !== "NaN" ? Number(tab) : 0;
    }
    return 0;
  }

  /**
   * @param {string} active
   * @param {string} title
   * @param {string} index
   */
  handleTabChange(active: string, title: string, index:string) {
    sessionStorage.setItem("rout", `/homepage/${active}`);

    this.setState(
      {
        active,
      },
      () => {
        this.props.history.push(`/homepage/${active}`);
        bodyScrollTop.set(0);
      }
    );
    
    Sensor.go("clickBanner_App_Mob", {
      banner_content: title,
      banner_belong_area: "Tab",
      banner_ranking: index + 1,
      page_id: "MB_1000001",
      action_id: "1000001_005",
      banner_current_url:"home",
      banner_current_page_type:"home",
      $element_position: title
    });
  }

  getCommonTabs() {
    const {
      homepage: { TabList },
    } = this.props;
    return (TabList || []).map((item, i) => {
      if (i === 0) {
        return (
          <TabPanel key={item.id} title={item.name}>
            <TabOneContent
              isLogin={Boolean(this.state.cardInfo)}
              guessyoutlikeParams={{
                recommendParam: (item as any).recommendParam,
                emarsysRecommendParams: {
                  limit: 50,
                },
                isLogin: Boolean(this.state.cardInfo),
                tabId: item.id,
              }}
            />
          </TabPanel>
        );
      }
      return (
        <TabPanel key={`${item.id}`} title={item.name}>
          <TabCommonContent key={item.id} tabInfo={item} />
        </TabPanel>
      );
    });
  }

  render() {
    const { active, minihead, animate } = this.state;

    /** @type {React.CSSProperties} - description */
    const miniHeadStyle = {
      transition: "all 0.1s",
      paddingTop: "0",
      paddingBottom: "0",
      top: `${0.6 + 0.24}rem`,
    };

    /** @type {React.CSSProperties} - description */
    const tabStyle = {
      position: "fixed",
      top: `${this.state.defaultFixedTopHeight}px`,
      left: 0,
      height: "0.96rem",
      boxSizing: "border-box",
      zIndex: settings.fixedZindex.tabBar,
      background: "#fff",
    };

    const contextValue = this.getContextValue();
    return (
      <Provider value={contextValue}>
        <div
          style={{
            padding: "0 .24rem",
            backgroundColor: "#fbfbfb",
            marginBottom: "3.5rem",
          }}
        >
          <Head
            ref={(ref) => {
              this.headRef = ref;
            }}
            minihead={minihead}
            animate={animate}
            style={{
              paddingBottom: `${this.state.defaultTabUlHeight}px`,
            }}
          />
          <Tabs
            ref={(ref) => {
              this.TabsRef = ref;
            }}
            active={active}
            tabStyle={
              minihead
                ? ({ ...tabStyle, ...miniHeadStyle } as React.CSSProperties)
                : (tabStyle as React.CSSProperties)
            }
            onTabChange={this.handleTabChange}
          >
            {this.getCommonTabs()}
          </Tabs>
          <BottomMenus style={{ zIndex: settings.fixedZindex.bottomBar }} />
          <Popup />
          <OpenApp />
        </div>
      </Provider>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  cart: state.cart,
  homepage: state.homepage,
  globalReference: state.globalReference,
});

const mapDispatchToProps = {
  emarsysGo,
};

export default OiaWrap(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeB))
);
