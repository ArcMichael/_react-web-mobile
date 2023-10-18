/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/4
 * Function -- Common module for Popup
 *
 */
import React from "react";
import { connect } from "react-redux";
import $ from "jquery";
// import RetentionInfo from "./RetentionInfo";
import PopupPinkCard from "./PopupPinkCard";
import FirstLogin from "./FirstLogin";
import BindModal from "./RetentionInfo/bindModal"
/*
 * 判断ios版本是否为ios11，如果为11需要处理弹层中input框为fixed的问题
 */


const POPUP = {
  RetentionInfo: BindModal,
  PopupPinkCard: PopupPinkCard,
  FirstLogin: FirstLogin,
};

const PopupComponent = ({ POPUP_STATE, POPUP_MODULE, POPUP_PARAMETERS,  }) => {
  /**
   * 如果Redux 参数为 1 展示模块
   */
  if (POPUP_STATE === 1 && POPUP_MODULE) {
    const Popup = POPUP[POPUP_MODULE];

    return <Popup {...POPUP_PARAMETERS} />;
  }
  // ios11兼容性
  // if (getAgentIOS11()) {
  if (typeof window !== "undefined" && typeof $ !== "undefined") {
    $(".popup-ui").parent().css({
      height: "auto",
      overflowY: "auto",
      position: "relative",
    });
  }

  return null;
};

const mapStateToPrps = (state) => {
  
  const { popup_component, global } = state;
  return Object.assign({}, popup_component, global);
};

export default connect(mapStateToPrps)(PopupComponent);
