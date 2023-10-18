import React from "react";
import OrderList from "@/lib/services/OrderList";
class AdvertisingModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noticeShow: false,
      adText: "",
    };
  }
  componentDidMount() {
    //物流配送广告位
    let that = this;
    OrderList.getSimpleTextGroup({
      locationLabel: "MOB:ORDERLIST:TOP_TEXT_CAROUSEL",
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
  render() {
    let { noticeShow, adText } = this.state;
    if (!noticeShow) return null;
    const { hidden } = this.props;
    return (
      <div className={`order_list_advertising ${hidden ? "hid" : ""}`}>
        {/* <span className="noticeOpen"></span> */}
        <div
          className="advertising_close"
          onClick={() => {
            this.setState({
              noticeShow: false,
            });
          }}
        >
          <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_white.png" />
        </div>
        <div className="advertising_content">
          <p>{adText}</p>
        </div>
      </div>
    );
  }
}
export default AdvertisingModule;
