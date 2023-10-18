/*
 * @Author: Leo.Si
 * @Date: 2019-08-15 18:45:42
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Fr 01:33:30
 */
import React from "react";
import { connect } from "react-redux";
import BottomMenus from "@/components/BottomMenus";
import isBrowser from "@/Utils/utils/isBrowser";
import {
  mapFuncToRun,
  automaticLoginForWechat,
  pendingOrder,
  changePopStatus,
} from "../../actions/myAccount";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/MyAccount.scss");
}
class MyAccountCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      MyAccountCenterInfo: null,
      MyAccountCenterOrder: null,
      MyAccountCenterTool: null,
      PopupAlert: null,
      GuseeYouLike: null,
      CurrentComponentCommonTop: null,
      NewPeopleGuide: null,
      currentIndex: 0,
    };
  }
  componentDidMount() {
    this.props.automaticLoginForWechat();
    this.props.pendingOrder();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        MyAccountCenterInfo:
          require("../../components/MyAccount/MyAccountCenter/MyAccountCenterInfo")
            .default,
        MyAccountCenterOrder:
          require("../../components/MyAccount/MyAccountCenter/MyAccountCenterOrder")
            .default,
        MyAccountCenterTool:
          require("../../components/MyAccount/MyAccountCenter/MyAccountCenterTool")
            .default,
        GuseeYouLike:
          require("../../components/MyAccount/MyAccountCenter/GuessYouLike")
            .default,
        PopupAlert: require("../../components/PopupAlert").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        NewPeopleGuide:
          require("../../components/MyAccount/MyAccountCenter/NewPeopleGuide")
            .default,
      });
    });
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { UIProfile } = newProps;
    if (UIProfile.popStatus) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
  }
  clickCallback(index) {
    index++;
    this.setState({
      currentIndex: index,
    });
    if (index >= 3) {
      this.props.changePopStatus({}, () => {});
      this.setState({
        NewPeopleGuide: null,
      });
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }
  }
  render() {
    const {
      CommonPageTitle,
      MyAccountCenterInfo,
      MyAccountCenterOrder,
      MyAccountCenterTool,
      GuseeYouLike,
      PopupAlert,
      CurrentComponentCommonTop,
      NewPeopleGuide,
      currentIndex,
    } = this.state;
    const {
      UIProfile,
      UIOrderLists,
      UIToolLists,
      mapFuncToRun,
      orderSwiper,
      GuideImageLists,
    } = this.props;
    return (
      <div className="myAccount_center">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && <CommonPageTitle _isBack={false} _title="我的" />}
        {UIProfile && UIProfile.userProfileAdPosition ? (
          <div className="myAccount_center_userProfileAdPosition">
            <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/newProfileTip.png" />
            <span>{UIProfile.userProfileAdPosition}</span>
          </div>
        ) : null}
        {MyAccountCenterInfo && (
          <MyAccountCenterInfo
            _myAccountInfo={UIProfile}
            _clickCallback={mapFuncToRun}
          />
        )}
        {MyAccountCenterOrder && (
          <MyAccountCenterOrder
            _order={UIOrderLists}
            _myAccountInfo={UIProfile}
            _orderSwiper={orderSwiper}
          />
        )}
        {MyAccountCenterTool && (
          <MyAccountCenterTool
            _order={UIToolLists}
            _clickCallback={mapFuncToRun}
          />
        )}
        <BottomMenus />
        {GuseeYouLike && (
          <GuseeYouLike
            _title="猜你喜欢"
            _params="f:CART_MOBILE,l:20,o:0"
            logic="CART_MOBILE"
          />
        )}
        {UIProfile.popStatus && NewPeopleGuide ? (
          <NewPeopleGuide
            _list={GuideImageLists}
            _index={currentIndex}
            _orderSwiper={orderSwiper}
            _myAccountInfo={UIProfile}
            clickCallback={this.clickCallback.bind(this)}
          />
        ) : null}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { UIProfile, UIOrderLists, UIToolLists, orderSwiper, GuideImageLists } =
    myAccount;
  return {
    UIProfile,
    UIOrderLists,
    UIToolLists,
    orderSwiper,
    GuideImageLists,
  };
};
export default connect(mapStateToProps, {
  mapFuncToRun,
  automaticLoginForWechat,
  pendingOrder,
  changePopStatus,
})(MyAccountCenter);
