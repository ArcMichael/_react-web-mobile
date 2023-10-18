/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-20 14:24:04
 * @function login page
 */

import React from "react";
import { getCdnImageUrl } from "@/components/CdnImage";
import ReadAgreementCon from "./ReadAgreementCon";

const LoginAgreenment = ({ _status, _setAgreeCheck, _agreeCheck }) => {
  const [useragree, setUseragree] = React.useState(false);
  if (!_status) return null;

  const privacyProtocolAction = () => {
    let url = getCdnImageUrl("/legal/app_privacy_policy.html");
    window.location.href = url;
  };

  const userAgreement = (state) => {
    setUseragree(state);
  };

  return (
    <>
      <h1 className="login-type">{_status === 1 ? "注册登录" : "账号密码登录"}</h1>

      <div className="login-agreenment">
        {_agreeCheck ? (
          <img
            onClick={() => {
              _setAgreeCheck(!_agreeCheck);
            }}
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/quest/images/check.png"
            alt=""
          />
        ) : (
          <img
            onClick={() => {
              _setAgreeCheck(!_agreeCheck);
            }}
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/quest/images/empty.png"
            alt=""
          />
        )}
        已阅读并同意
        <span onClick={() => userAgreement(true)}>《丝芙兰用户服务协议》</span>和
        <span onClick={privacyProtocolAction}>《丝芙兰隐私政策》</span>
      </div>
      {useragree && (
        <ReadAgreementCon _clickCallback={userAgreement} _className="login-allow-scroll" />
      )}
    </>
  );
};
export default LoginAgreenment;
