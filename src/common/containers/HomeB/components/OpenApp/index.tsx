import React from "react";
import {
  getOiaUrlByCurrentPathname,
  getHrefLink,
  getSchemaUrl,
} from "@/Utils/deeplink";
import { urlGetParams } from "@/lib/url";
import { isIOS } from "@/lib/device";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import DeepLinkPopup from "@/components/DeepLink/DeepLinkPopup";
import getAd from "@/lib/blls/getAd";

export interface OpenAppProps {
  /**
   * rem;
   */
  bottom?: string;
}
export interface OpenAppState {
  height: number;
  isShowPopup: boolean;
  text: string;
  link: string;
  trackingCode: string;
  barFlag:boolean
}

class OpenApp extends React.Component<OpenAppProps, OpenAppState> {
  static defaultProps: OpenAppProps = {
    bottom: "2rem",
  };
  DeepLinkRef: HTMLDivElement | null = null;
  constructor(props: OpenAppProps) {
    super(props);
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
      barFlag:true
    };
  }

  componentDidMount() {
    this.barHide()
    getAd("mobile:title:edit", (res: any) => {
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

  shouldComponentUpdate(_: OpenAppProps, nextState: OpenAppState) {
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
  barHide() {
    let bar = urlGetParams(window.location, "bar");
    if (bar) {
      this.setState({
        barFlag: bar !== "1",
      });
    }
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

  showPopup(state: boolean, cb?: () => void) {
    this.setState({ isShowPopup: state });
    cb && cb();
    Sensor.go("popup_downloadApp", {
      action_id: "1000001_960",
      page_id: "MB_1000001",
      $title: "首页",
      banner_current_url: "home",
      banner_current_page_type: "home",

      button_location: "打开App",
      current_url: window.location.href,
      $element_content: "打开App",
      button_name: "打开App",

    });
    //继续逛逛埋点
    if (!state) {
      Sensor.go("popup_downloadApp", {
        button_location: "继续逛逛",
        current_url: window.location.href,
        action_id: "1000001_961",
        page_id: "MB_1000001",
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
    const { bottom } = this.props;
    const { height, isShowPopup, text,barFlag } = this.state;
    if (!barFlag) {
      return null
    }else{

    
    return (
      <div style={{ width: "100%" }}>
        {
          <div
            ref={(ref) => {
              this.DeepLinkRef = ref;
            }}
            className="downloadApp"
            style={{ bottom, height: `${height}px`, lineHeight: `${height}px` }}
          >
            <div className="left" onClick={() => this.gotoLink()}>
              {text}
            </div>
            <div className="right" onClick={() => this.showPopup(true)}>
              打开App
            </div>
          </div>
        }

        {isShowPopup && (
          <DeepLinkPopup
            isShowPopup={isShowPopup}
            closeHandle={(cb: any) => this.showPopup(false, cb)}
            openApp={this.openApp}
          />
        )}
      </div>
    );
  }
  }
}

export default OpenApp;
