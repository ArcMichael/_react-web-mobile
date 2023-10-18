/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-22 18:14:56
 * @function login page
 */

import React from "react";

import { soaLoginOff } from "@/lib/Tools";
import getConfigs from "../../../../isomorphisms/getConfigs";

const configs = getConfigs();

const socialRedirectUrl = (url, type) => {
  return url + "&state=" + type;
};

const handleClick = () => {
  let hrefLink = "javascript:voild(0);";
  const abtest = configs.abtest;
  if (abtest.match(/stagem/)) {
    hrefLink = socialRedirectUrl(
      `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101398766&redirect_uri=https://stage.sephora.cn`,
      "QQ",
    );
  } else if (abtest.match(/testm/)) {
    hrefLink = socialRedirectUrl(
      `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101398766&redirect_uri=https://test.sephora.cn`,
      "QQ",
    );
  } else {
    hrefLink = socialRedirectUrl(
      `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101398766&redirect_uri=https://www.sephora.cn`,
      "QQ",
    );
  }
  return hrefLink;
};

const handleWeiBo = () => {
  let hrefLink = "javascript:voild(0);";
  const abtest = configs.abtest;
  if (abtest.match(/stagem/)) {
    hrefLink = socialRedirectUrl(
      `https://api.weibo.com/oauth2/authorize?client_id=618687765&response_type=code&redirect_uri=https://stage.sephora.cn`,
      "WEIBO",
    );
  } else if (abtest.match(/testm/)) {
    hrefLink = socialRedirectUrl(
      `https://api.weibo.com/oauth2/authorize?client_id=618687765&response_type=code&redirect_uri=https://test.sephora.cn`,
      "WEIBO",
    );
  } else {
    hrefLink = socialRedirectUrl(
      `https://api.weibo.com/oauth2/authorize?client_id=618687765&response_type=code&redirect_uri=https://www.sephora.cn`,
      "WEIBO",
    );
  }
  return hrefLink;
};

const goReset = () => {
  const historyPath =
    decodeURIComponent(window.location.search.replace("?historyLocation=", "")).replace("&", "?") ||
    "";
  window.location.href = `/register?historyLocation=${historyPath}`;
};

const LoginFooter = ({ _status }) => {
  if (!_status) return null;
  return (
    <>
      <div className="login-service">
        <a className="fontSize" href="tel:400-670-0055">
          联系客服
        </a>
        {_status === 2 && (
          <>
            <span className="line" />
            <span className="fontSize" onClick={goReset}>
              忘记密码
            </span>
          </>
        )}
      </div>
      <div className="login-joint">
        <a
          onClick={() => {
            soaLoginOff(true);
            window.location.href = handleWeiBo();
          }}
        >
          <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/logins_weibo.png" alt="" />
        </a>
        <a
          onClick={() => {
            soaLoginOff(true);
            window.location.href = handleClick();
          }}
        >
          <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/logins_qq.png" alt="" />
        </a>
      </div>
    </>
  );
};
export default LoginFooter;
