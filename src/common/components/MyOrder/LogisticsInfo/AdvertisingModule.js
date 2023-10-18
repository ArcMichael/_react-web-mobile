import React from "react";
import { advertTxt } from "../../../lib/BLL";
class AdvertisingModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noticeShow: false,
      adText: "",
    };
    this.closeNoticePopup = this.closeNoticePopup.bind(this);
  }
  componentDidMount() {
    const { _locationLabel } = this.props;
    let that = this;
    new Promise((res) => {
      advertTxt(_locationLabel, (results) => res(results));
    }).then((json) => {
      if (
        json.results &&
        json.results.resourceList &&
        json.results.resourceList[0] &&
        json.results.resourceList[0].content
      ) {
        that.setState({
          noticeShow: true,
          adText: json.results.resourceList[0].content,
        });
      }
    });
  }

  closeNoticePopup() {
    //广告位控制开关
    this.setState({
      noticeShow: false,
    });
  }
  render() {
    let { noticeShow, adText } = this.state;
    if (!noticeShow) return null;
    return (
      <div className="shopTip_common">
        <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupTipsIcon.png" />
        <p>{adText}</p>
        <img
          src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_red.png"
          onClick={this.closeNoticePopup}
        />
      </div>
    );
  }
}
export default AdvertisingModule;
