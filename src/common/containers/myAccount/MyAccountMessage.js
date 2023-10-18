/*
 * @Author: Leo.Si
 * @Date: 2019-10-21 14:00:41
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 13:52:48
 * @function 消息中心页面
 */
import React from "react";
import { connect } from "react-redux";
import getLocationQuery from "@/Utils/utils/getLocationQuery";
import isBrowser from "@/Utils/utils/isBrowser";
import {
  myMessageInit,
  mapFunSetPassWordToRun,
  mymsgList,
  myBeautyList,
} from "../../actions/myAccount";
import ScrollContainer from "../../components/ScrollContainer/index";
import Sensor from "../../Utils/sensor";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountMessage.scss");
}
class MyAccountMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
      MyAccountMessageModule: null,
    };
  }
  componentDidMount() {
    this.props.myMessageInit();
    const query = getLocationQuery();
    require.ensure([], () => {
      this.setState(
        {
          CommonPageTitle: require("../../components/CommonPageTitle").default,
          CurrentComponentCommonTop: require("../../components/CommonTop/index")
            .default,
          MyAccountMessageModule:
            require("../../components/MyAccount/MyAccountMessage/index")
              .default,
        },
        () => {
          query &&
            Sensor.go("MsgCenterExposure", {
              msg_type: query.type == 0 ? "美丽资讯" : "我的消息",
            });
        }
      );
    });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isBottom !== this.props.isBottom && nextProps.isBottom) {
      if (
        nextProps &&
        nextProps.messageList &&
        nextProps.messageList.hasNextPage
      ) {
        if (
          nextProps.myMsgTap &&
          nextProps.myMsgTap[0] &&
          nextProps.myMsgTap[0].active_class &&
          nextProps.myMsgTap[0].active_class == "active"
        ) {
          this.props.myBeautyList(
            nextProps &&
              nextProps.messageList &&
              nextProps.messageList.pageNum &&
              nextProps.messageList.pageNum + 1
          );
        } else if (
          nextProps.myMsgTap &&
          nextProps.myMsgTap[1] &&
          nextProps.myMsgTap[1].active_class &&
          nextProps.myMsgTap[1].active_class == "active"
        ) {
          this.props.mymsgList(
            nextProps &&
              nextProps.messageList &&
              nextProps.messageList.pageNum &&
              nextProps.messageList.pageNum + 1
          );
        }
      }
    }
  }
  render() {
    const {
      CommonPageTitle,
      CurrentComponentCommonTop,
      MyAccountMessageModule,
    } = this.state;
    const { SCROLL_TOP, myMsgTap, messageList, mapFunSetPassWordToRun } =
      this.props;
    return (
      <div className="online_return_page">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && <CommonPageTitle _isBack _title="消息中心" />}
        {MyAccountMessageModule && (
          <MyAccountMessageModule
            _tapData={myMsgTap}
            _list={messageList}
            _clickCallback={mapFunSetPassWordToRun}
            _scrollTop={SCROLL_TOP}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { view, myAccount } = state;
  const { SCROLL_TOP } = view;
  const { myMsgTap, messageList } = myAccount;
  return {
    SCROLL_TOP,
    myMsgTap,
    messageList,
  };
};
export default connect(mapStateToProps, {
  myMessageInit,
  mapFunSetPassWordToRun,
  mymsgList,
  myBeautyList,
})(ScrollContainer(MyAccountMessage));
