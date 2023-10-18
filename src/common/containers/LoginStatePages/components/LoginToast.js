/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-11 17:41:26
 * @function login page
 */

import React from "react";

const LoginToast = ({ _mainText }) => {
  if (!_mainText) return null;
  return (
    <div className="login-toast">
      <img
        className="popup-alert-tip"
        src={
          // "https://ssl1.sephorastatic.cn/soa/mobile/images/newReset.png"
          "https://ssl1.sephorastatic.cn/soa/mobile/images/newNoticeOpenIcon.png"
        }
      />

      <div className="popup-alert-bottom">
        <em className="popup-alert-bottom-main">{_mainText}</em>
      </div>
    </div>
  );
};
export default LoginToast;
