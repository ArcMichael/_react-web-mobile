import React from "react";
import { connect } from "react-redux";
import getAd from "@/lib/blls/getAd";
import {
  getOiaUrlByCurrentPathname,
  getHrefLink,
  getSchemaUrl,
} from "../../Utils/deeplink";
import { urlGetParams } from "../../lib/url";
import { isIOS } from "../../lib/device";
import Sensor from "../../Utils/sensor";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import DeepLinkPopup from "./DeepLinkPopup";

/**
 * @return {{ isAllow:boolean, bottom: string | number | undefined }} - description
 */
const getIsAllowShowDeeplinkAndBottom = () => {
  const allowShowUrls = [
    {
      test: "/",
      bottom: "2rem",
    },
    {
      test: new RegExp(/\/product\/[0-9]+\.html/),
      bottom: "2.2rem",
    },
    {
      test: new RegExp(/\/brand\/.*/),
      bottom: "0.25rem",
    },
    {
      test: new RegExp(/\/campaign\/.*/),
      bottom: "0.25rem",
    },
    {
      test: new RegExp(/\/homepage\/?.*/),
      bottom: "2rem",
    },
    {
      test: new RegExp(/\/rewardsBoutiqueGuide\/?.*/),
      bottom: ".2rem",
    },
    {
      test: new RegExp(/\/v2\/html\/hotsalesstandings\/?.*/),
      bottom: "2rem",
    },
  ];
  let isAllow = false;
  let bottom;
  if (typeof window !== "undefined") {
    const { pathname } = window.location;
    allowShowUrls.forEach((item) => {
      if (typeof item.test === "string" && item.test === pathname) {
        isAllow = true;
        bottom = item.bottom;
      }
      if (item.test instanceof RegExp && pathname.match(item.test)) {
        isAllow = true;
        bottom = item.bottom;
      }
    });
  }
  return {
    isAllow,
    bottom,
  };
};
class DeepLink extends React.Component {
  constructor(props) {
    super(props);
    this.closeDeepLink = this.closeDeepLink.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.openApp = this.openApp.bind(this);
    this.openAppBySchema = this.openAppBySchema.bind(this);
    this.autoGoDownloadPage = this.autoGoDownloadPage.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.barHide = this.barHide.bind(this);

    this.state = {
      height: 0,
      isShowPopup: false,
      text: "",
      link: "",
      trackingCode: "",
      barFlag: true,
    };
  }

  /** @type {HTMLDivElement} - description */
  DeepLinkRef = null;

  componentDidMount() {
    this.barHide();
    getAd("mobile:title:edit", (res) => {
      if (
        res &&
        res.results &&
        res.results[0] &&
        res.results[0].contentDetails
      ) {
        const text = res.results[0].contentDetails[0].text;
        const link = res.results[0].contentDetails[0].link;
        const trackingCode = res.results[0].contentDetails[0].trackingCode;
        this.setState({ text, link, trackingCode });
      }
    });
    this.setHeight();
    const that = this;
    window.addEventListener(
      "pageshow",
      function () {
        /**
         * 打开页面后自动跳转，只使用schema跳转。
         */
        if (urlGetParams(window.location, "campaignid")) that.openAppBySchema();
      },
      false
    );
  }

  UNSAFE_componentWillReceiveProps(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.showPopup(true);
    }
  }
  barHide() {
    let bar = urlGetParams(window.location, "bar");
    console.log(bar, "--------------------------------");
    if (bar) {
      this.setState({
        barFlag: bar !== "1",
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.height === this.state.height &&
      nextState.isShowPopup === this.state.isShowPopup &&
      nextState.text === this.state.text
    ) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    this.setHeight();
  }

  setHeight() {
    let height = 0;
    if (this.DeepLinkRef) {
      height = this.DeepLinkRef.offsetWidth / 7.5;
      this.setState({
        height,
      });
    }
  }
  // 关闭deeplink的popup
  closeDeepLink() {
    const { callback } = this.props;
    callback && callback();
  }

  autoGoDownloadPage() {
    setTimeout(() => {
      window.location.href = getOiaUrlByCurrentPathname();
    }, 500);
  }

  openAppBySchema() {
    Sensor.go("downloadAppClick", {
      $lib_detail: "M_newDeepLink##toDownLoad##DeepLink.js##38",
    });
    window.location.href = getSchemaUrl();
  }

  openApp() {
    Sensor.go("downloadAppClick", {
      $lib_detail: "M_newDeepLink##toDownLoad##DeepLink.js##38",
    });
    GoogleAnalytics.pushV2({
      event: "appDownload",
    });
    window.location.href = getHrefLink();
    if (!isIOS()) {
      this.autoGoDownloadPage();
    }
  }

  showPopup(state, cb) {
    this.setState({ isShowPopup: state });
    cb && cb();
    //继续逛逛埋点   
    if (!state) {
      Sensor.go("popup_downloadApp", {
        platform_type: "mobile",
        system_type: "",
        environment_type: "",
        vip_card: "",
        vip_card_type: "",
        action_id: "1000001_961",
        page_id: "MB_1000001",
        $title: "首页",
        page_type_detail: "",
        page_type: "",
        $url_path: "",
        $url_query: "",
        $url: "",
        banner_current_url: "home",
        banner_current_page_type: "home",

        button_location: "继续逛逛",
        current_url: window.location.href,
        $element_content: "继续逛逛",
        button_name: "继续逛逛",
      
      });
    }
  }
  gotoLink() {
    const { link, trackingCode } = this.state;
    if (link) {
      if (trackingCode) {
        window.location.href = `${link}?${trackingCode}`;
      } else {
        window.location.href = link;
      }
    }
  }
  render() {
    const { channel } = this.props;
    const { height, isShowPopup, text, barFlag } = this.state;
    const { isAllow, bottom } = getIsAllowShowDeeplinkAndBottom();
    if (!barFlag) {
      return null;
    } else {
      return (
        <div style={{ width: "100%" }}>
          {isAllow && (
            <div
              ref={(ref) => {
                this.DeepLinkRef = ref;
              }}
              className="downloadApp"
              style={{
                bottom,
                height: `${height}px`,
                lineHeight: `${height}px`,
              }}
            >
              {channel === "rewardsBoutique" ? (
                <div className="left">
                  {/* <i className="css-icon-close" onClick={this.closeDeepLink}></i> */}
                  打开丝芙兰APP，积分商城兑好礼！
                </div>
              ) : (
                <div className="left" onClick={() => this.gotoLink()}>
                  {/* <i className="css-icon-close" onClick={this.closeDeepLink}></i> */}
                  {text}
                </div>
              )}
              <div className="right" onClick={() => this.showPopup(true)}>
                打开App
              </div>
            </div>
          )}

          {isAllow && isShowPopup && (
            <DeepLinkPopup
              isShowPopup={isShowPopup}
              closeHandle={(cb) => this.showPopup(false, cb)}
              openApp={this.openApp}
            />
          )}
        </div>
      );
    }
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {})(DeepLink);
