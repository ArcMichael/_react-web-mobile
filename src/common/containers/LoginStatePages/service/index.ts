import { AJAX } from "@/lib/ajax";
import { GetConfirmation, GetSingleCookie } from "@/lib/Tools";
import { urlGetParams } from "@/lib/url";
import * as device from "@/lib/device"; 
import $ from "jquery";

interface smsCode {
  scene: string; // 场景（忘记密码：FORGET；手机验证码登录：SMS；账号密码登录：PWD；联合登录绑定手机：SOCIALBIND）
  // rToken: string; // 数美返回的rid
  telephone: string; //手机号
  verifyType: number;
  verifyParam: {
    rToken?: string;
    requestId?: string;
  };
}

interface smsCodeData {
  timeStamp: string;
  status: string;
  results?: Object;
  errorCode?: number;
  errorMessage?: string;
}

interface newlogin {
  loginId: string;
  password: string;
  code?: string;
  codeToken?: string;
  NDFingerPrint: string;
  requestId: string;
}

interface smslogin {
  smsCode: string;
  storeCode: string;
  rtoken: string;
  telephone: string;
}

// 登录 发送手机验证码
export function getSmsCode(data: smsCode) {
  return new Promise<smsCodeData>((resolve) => {
    // ?scene=${data.scene}&rToken=${data.rToken}
    AJAX(
      {
        type: "POST",
        url: `/v2/usercenter/verification/smsCode`,
        data,
        headers: {
          channel: device.isApp() ? "APP" : device.isWeChat() ? "MINIPROGRAM" : "MOBILE",
          UID: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "uid")
            : GetSingleCookie(document.cookie, "UID"),
          Token: device.device_inMiniProgramsEnvironment()
            ? urlGetParams(window.location, "token")
            : GetSingleCookie(document.cookie, "Token"),
        },
      },
      (json) => {
        resolve(GetConfirmation(json));
      },
    );
  });
}

//密码登录
export function postPwLogin(params: newlogin) {
  return new Promise<smsCodeData>((resolve) => {
    params.loginId = window.btoa(params.loginId);
    params.password = window.btoa(params.password);
    $.ajax({
      type: "post",
      url: "/api/SOA/v1/myaccount/user/newlogin",
      data: params,
      success(json) {
        if (json && json.results && json.status == 0) {
          resolve(json.results);
        }
      },
    });
  });
}

// 验证码登录
export function postLoginsms(params: smslogin) {
  return new Promise<smsCodeData>((resolve) => {
    $.ajax({
      type: "post",
      url: "/api/SOA/v2/myaccount/user/logon/captcha/mobile",
      data: params,
      success(json) {
        resolve(json);
      },
    });
  });
}

// 获取数美的rid
export function initSMCaptcha() {
  return new Promise<string>((resolve) => {
    if (window.initSMCaptcha) {
      window.initSMCaptcha(
        {
          organization: "qfoShxSauZWl8mZDzd9Z",
          domains: ["fengkong.sephora.cn"],
          registerUrl: "/ca/v1/register",
          fVerifyUrlV2: "/ca/v2/fverify",
          confUrl: "ca/v1/conf",
          trackerDomain: "fengkong.sephora.cn",
          trackerPath: "/exception",
          product: "popup",
          mode: "slide",
          maskBindClose: true,
          width: "300px",
        },
        (instance: any) => {
          instance.onSuccess((data: any) => {
            if (data.pass) {
              // 验证通过
              var data2 = instance.getValidate();
              resolve(data2.rid);
            } else {
              // 验证失败
              instance.reset(); // 重置验证码
            }
          });
          instance.onError(() => {
            // 异常
            instance.reset(); // 重置验证码
          });
          instance.onReady(() => {
            instance.verify();
          });
          instance.onClose(() => {
            // 关闭回调
            resolve("");
          });
        },
      );
    }
  });
}
