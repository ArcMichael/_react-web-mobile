/*
 * @Author: Leo.Si
 * @Date: 2019-08-22 19:32:08
 * @Last Modified by: summer
 * @Last Modified time: 2021-05-Sa 02:34:21
 * @function 用户收货地址页面
 */
import React from "react";
import { connect } from "react-redux";
import * as device from "@/lib/device";
import { setupWeChat } from "@/actions/dependency";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import { initAddress, mapAddressFuncToRun } from "../../actions/myAccount";
import isBrowser from "@/Utils/utils/isBrowser";
import PopupAlert from "../../components/PopupAlert";
import { popupAlert } from "../../actions/popup";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountAddress.scss");
}
class MyAccountAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      AddressModule: null,
      ProvincialAndUrbanAreas: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    const { setupWeChat } = this.props;
    if (device.isWeChat()) {
      setupWeChat({
        callback: () => {
          this.props.initAddress();
        },
      });
    } else {
      this.props.initAddress();
    }
    const query = getLocationQuery();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        AddressModule: require("../../components/MyAccount/MyAddress/index").default,
        ProvincialAndUrbanAreas:
          require("../../components/MyAccount/MyAddress/ProvincialAndUrbanAreas").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
        type: query.type,
      });
    });
  }
  render() {
    const {
      CommonPageTitle,
      AddressModule,
      ProvincialAndUrbanAreas,
      CurrentComponentCommonTop,
      type,
    } = this.state;
    const { AllAddress, addressStatus, isShowProvince, popupAlert } = this.props;
    return (
      <div className="myAccount_address">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && addressStatus && addressStatus == "allAddress" && (
          <CommonPageTitle _isBack={true} _title="管理收货地址" />
        )}
        {AddressModule && (
          <AddressModule
            _data={AllAddress}
            _status={addressStatus}
            _clickCallback={this.props.mapAddressFuncToRun}
            _type={type}
            popupAlert={popupAlert}
          />
        )}
        {isShowProvince && <ProvincialAndUrbanAreas />}
        <PopupAlert />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { AllAddress, addressStatus, isShowProvince } = myAccount;
  return {
    AllAddress,
    addressStatus,
    isShowProvince,
  };
};
export default connect(mapStateToProps, {
  initAddress,
  popupAlert,
  mapAddressFuncToRun,
  setupWeChat,
})(MyAccountAddress);
