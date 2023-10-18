/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/10
 * Function -- Common module for Popup Alert
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import PopupAlertDefault from './PopupAlertDefault';
import PopupErrorWarnning from './PopupErrorWarnning';
import PopupAlertWeiXin from './PopupAlertWeiXin';
import PopupAlertWeiXinAgreement from './PopupAlertWeiXinAgreement';
import PopupAlertDownLoadApp from './PopupAlertDownLoadApp';
import PopupToast from './PopupToast';
import PopupErrorToast from './PopupErrorToast';
import PopupConfirm from './PopupConfirm';
import PopupConfirmSearch from './PopupConfirmSearch';
import PopupAlertMyaccount from './PopupAlertMyaccount';
import PopupConfirmMyaccount from './PopupConfirmMyaccount';
import PopupMemberEquity from './PopupMemberEquity';
import PopupScrollSelect from './PopupScrollSelect';
import PopupUpLoadImageSample from './PopupUpLoadImageSample';
import PopupSignOut from './PopupSignOut';
import PopupMgm from './PopupMgm';
import PopupLottery from './PopupLottery';
import PopupCleaning from './PopupCleaning';
import PopupVaConfirm from './PopupVaConfirm';
import PopupReturnError from './PopupReturnError';

/** product detail page  */
import PromotionDetails from './ProductPage/PromotionDetails';
import RoleActivity from './ProductPage/RoleActivity';
import ArrivalNotice from './ProductPage/ArrivalNotice';
import VBDetailsDetails from './ProductPage/VBDetailsDetails';
import ProductPickColors from './ProductPage/ProductPickColors';
import VipActivityPopup from './ProductPage/VipActivityPopup';

const POPUPALERT = {
  PopupAlertDefault: PopupAlertDefault,
  PopupAlertWeiXin: PopupAlertWeiXin,
  PopupAlertWeiXinAgreement: PopupAlertWeiXinAgreement,
  PopupAlertDownLoadApp: PopupAlertDownLoadApp,
  PopupErrorWarnning: PopupErrorWarnning,
  PopupToast: PopupToast,
  PopupErrorToast,
  PopupConfirm: PopupConfirm,
  PopupConfirmSearch,
  PopupAlertMyaccount: PopupAlertMyaccount,
  PopupConfirmMyaccount: PopupConfirmMyaccount,
  PopupMemberEquity,
  PopupScrollSelect: PopupScrollSelect,
  PopupUpLoadImageSample: PopupUpLoadImageSample,
  PopupSignOut: PopupSignOut,
  PopupMgm: PopupMgm,
  PopupLottery,
  PromotionDetails,
  RoleActivity,
  ArrivalNotice,
  VBDetailsDetails,
  ProductPickColors,
  PopupCleaning,
  VipActivityPopup,
  PopupVaConfirm,
  PopupReturnError,
};
class PopupAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
    };
    this.setTimer = this.setTimer.bind(this);
  }
  setTimer(timer) {
    this.setState({
      timer,
    });
  }
  componentWillUpdate() {}
  render() {
    const { POPUP_ALERT_STATE, POPUP_ALERT_MODULE } = this.props;

    /*
     * 如果Redux 参数为 1 展示模块
     */
    if (POPUP_ALERT_STATE === 0 && POPUP_ALERT_MODULE === 'PopupAlertDefault') {
      POPUPALERT[POPUP_ALERT_MODULE];
      clearTimeout(this.state.timer);
      // return <Popup {...this.props} timer={this.state.timer} setTimer={this.setTimer} />
    }

    if (POPUP_ALERT_STATE === 1 && POPUP_ALERT_MODULE) {
      const Popup = POPUPALERT[POPUP_ALERT_MODULE];
      return <Popup {...this.props} timer={this.state.timer} setTimer={this.setTimer} />;
    }

    return null;
  }
}

const mapStateToPrps = state => {
  
  const { popup_component } = state;
  return Object.assign({}, popup_component);
};

export default connect(mapStateToPrps)(PopupAlert);
