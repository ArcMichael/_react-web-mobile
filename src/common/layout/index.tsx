import React, { Component } from "react";
import "../../etc/TrackingCode";
import Supports from "@/lib/Supports";
import isBrowser from "@/Utils/utils/isBrowser";
import { RouteComponentProps, withRouter } from "react-router";
import allowSsrRender from "@/allowSsrRender";
import { getCookie } from "@/Utils/utils/cookie";
import { Provider, LayoutContextInitvalue } from "./LayoutContext";
import { JudgeWeChat } from "../lib/index";
import { urlGetParams } from "../lib/url";
import * as device from "../lib/device";
import configAuth from "../../etc/configAuth.json";
import configWhiteList from "../../etc/configWhiteList.json";

const supports = new Supports();

let isAfterAsyncInit = false;

export interface LayoutComponentProps extends RouteComponentProps {}
export interface LayoutComponentState {
  initContext: typeof LayoutContextInitvalue;
}

function requireAuth() {
  if (isBrowser()) {
    if (JudgeWeChat()) return;
    let match = false;
    let white = false;

    configAuth.url.forEach((data) => {
      if (window.location.pathname.match(new RegExp(data))) {
        match = true;
      }
    });
    configWhiteList.url.forEach((data) => {
      if (window.location.pathname.match(new RegExp(data))) {
        white = true;
      }
    });
    getCookie().then((cookie) => {
      let mpToken = null;
      // 判断小程序环境，token从url上面获取
      if(device.device_inMiniProgramsEnvironment()){
        mpToken = urlGetParams(window.location, "token")
      }
      
      if (match && !cookie("Token") && !cookie("tpId") && !cookie("bindId") && !mpToken) {
        console.log(11, white);
        
        if (!white) {
          console.log(2222);
          window.location.href = `/login?historyLocation=${encodeURIComponent(
            window.location.pathname.replace("/", "").replace("?", "&")
          )}${window.location.search.replace("?", "&")}`;
        }
      }
    });
  }
}

class Layout extends Component<LayoutComponentProps, LayoutComponentState> {
  constructor(props: LayoutComponentProps) {
    super(props);
    this.asyncInit = this.asyncInit.bind(this);
    this.state = {
      initContext: {
        ...LayoutContextInitvalue,
        isSupportWebp: supports.isSupportWebp,
        afterSupportsRegister: isAfterAsyncInit,
      },
    };
  }

  componentDidMount() {
    this.asyncInit();
    requireAuth();
  }

  asyncInit() {
    const { initContext } = this.state;
    supports.register().then(() => {
      isAfterAsyncInit = true;
      this.setState({
        initContext: {
          ...initContext,
          afterSupportsRegister: isAfterAsyncInit,
          isSupportWebp: supports.isSupportWebp,
        },
      });
    });
  }

  render() {
    const { initContext } = this.state;
    const isAllowSSrRender = allowSsrRender(this.props.location.pathname);
    if (isAllowSSrRender) {
      return <Provider value={initContext}>{this.props.children}</Provider>;
    }
    if (typeof window !== "undefined") {
      return <Provider value={initContext}>{this.props.children}</Provider>;
    }
    return null;
  }
}

export default withRouter(Layout);
