/*
 * @Author: Leo.Si
 * @Date: 2019-09-17 20:15:35
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-09-Tu 01:58:05
 * @function OnlineReturn  退货/售后 列表
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import CommonPageTitle from "@/components/CommonPageTitle";
import CurrentComponentCommonTop from "@/components/CommonTop";
import OnlineReturnListTap from "@/components/MyAccount/MyAccountOnlineReturn/OnlineReturnList/OnlineReturnListTap";
import OnlineReturnListData from "@/components/MyAccount/MyAccountOnlineReturn/OnlineReturnList/OnlineReturnListData";
import PopupAlert from "@/components/PopupAlert";

import {
  returnListInit,
  mapFuncToRun,
  getReturnList,
} from "../../actions/onlineReturn";
import ScrollContainer from "../../components/ScrollContainer/index";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountApplyReturn.scss");
}

class MyAccountApplyReturnList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.returnListInit();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isBottom !== this.props.isBottom && nextProps.isBottom) {
      this.props.getReturnList({
        pageNo:
          nextProps.returnListData &&
          nextProps.returnListData.currentPage &&
          nextProps.returnListData.currentPage + 1,
        showStatus: nextProps.returnListStatus,
        totalRecord:
          nextProps.returnListData && nextProps.returnListData.totalRecord,
      });
    }
  }
  render() {
    const { returnListTap, returnListData, mapFuncToRun, SCROLL_TOP } =
      this.props;
    return (
      <div className="online_return_page">
      <CurrentComponentCommonTop />
        <CommonPageTitle _isBackV2={true} _href="/myAccount" _title="退货/售后" _isCustomer={true} />
        <OnlineReturnListTap
          _data={returnListTap}
          _clickCallback={mapFuncToRun}
          _scrollTop={SCROLL_TOP}
        />
        <OnlineReturnListData
          _data={returnListData}
          _clickCallback={mapFuncToRun}
        />
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { onlineReturn, view } = state;
  const { returnListTap, returnListData, returnListStatus } = onlineReturn;
  const { SCROLL_TOP } = view;
  return {
    returnListTap,
    returnListData,
    SCROLL_TOP,
    returnListStatus,
  };
};
export default connect(mapStateToProps, {
  returnListInit,
  mapFuncToRun,
  getReturnList,
})(ScrollContainer(MyAccountApplyReturnList));
