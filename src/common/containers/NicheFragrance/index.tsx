import React, { Component } from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import NicheFragranceDetail from "@/components/NicheFragrance/detail";
import * as device from "@/lib/device";
import { preLoadImg } from "@/actions/nichefragrance";
import NicheFragranceSwiper from "./components/NicheFragranceSwiper";
import preloadImgData from "./components/preloadImg";
import detailsDatas from "./components/details";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/NicheFragrance.scss");
}

class NicheFragrance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.preLoadImg(preloadImgData);
    if (device.isApp()) {
      let params = {
        screenName: `campaign_nichefragrance`,
        screenType: "Campaign",
        URL: window.location.pathname,
      };

      let JSINVOKE = new window.SEPHORA_JSINVOKE();
      if (JSINVOKE.logEvent) {
        JSINVOKE.logEvent("customScreenView", params);
        JSINVOKE.logEvent("screen_view", params);
      }
    }
  }
  render() {
    const { $nichefragrance } = this.props;
    const { INDEX = 0, STATE = false } = $nichefragrance;

    return (
      <div className="nf_swiper_container">
        <NicheFragranceSwiper />
        {STATE ? <NicheFragranceDetail _datas={detailsDatas[INDEX]} /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    $nichefragrance: state.nichefragrance,
  };
};

export default connect(mapStateToProps, {
  preLoadImg,
})(NicheFragrance);
