/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-09-29 17:12:34
 * @LastEditTime: 2021-04-27 14:35:50
 */
import React from "react";
import { WeChatPath } from "../../util";
import * as device from "../../../../lib/device";
import Sensor from "../../../../Utils/sensor";
import { setupWeChat } from "../../../../Utils/wechat";
export default class StoreTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    const { count } = this.state; // TODO: 请移除无用state
    console.log(count);
    if (device.isWeChat()) {
      setupWeChat({});
    }
  }
  render() {
    const {
      expireIntegral,
      integral,
      changeRule,
      frozen,
      brandId,
      brandName,
      brandRuleUrl,
    } = this.props;
    return (
      <div className="scoreHeader">
        {!frozen && (
          <div
            className="scoreRule"
            onClick={() => {
              if (brandId === null) {
                changeRule(true);
              } else if (brandRuleUrl) {
                window.location.href = brandRuleUrl;
              }
            }}
          >
            <img
              onClick={() => {}}
              className="iconRule"
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/exchange_rule.png"
            />
            <span>规则</span>
          </div>
        )}
        {!frozen && (
          <div className="myScore">
            <span>{brandName ? `我的${brandName}积分：` : "我的积分:"}</span>
            {frozen && <span className="score">{integral}</span>}
          </div>
        )}

        {frozen && (
          <div className="frozenmyScore">
            <div>
              <span className="score-title">我的积分: </span>
              <span className="score">{integral}</span>
            </div>
            <div
              className="scoreRule"
              onClick={() => {
                if (brandId === null) {
                  changeRule(true);
                } else if (brandRuleUrl) {
                  window.location.href = brandRuleUrl;
                }
              }}
            >
              <img
                onClick={() => {}}
                className="iconRule"
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/exchange_rule.png"
              />
              <span>规则</span>
            </div>
          </div>
        )}

        {!frozen && (
          <div className="scoreContainer">
            {/* <div lassName="myScoreContainer"> */}
            <div className="scoreLeft">
              <span className="score">{integral}</span>{" "}
              {brandId === null ? (
                <a
                  className="earnscore"
                  onClick={() => {
                    Sensor.go("pointMall_hp_click", {
                      button_name: "赚积分",
                    });
                    window.location.href = WeChatPath("/v2/html/gainPoint");
                  }}
                >
                  赚积分
                </a>
              ) : null}
            </div>
            {/* </div> */}
            {!frozen && brandId === null && (
              <div className="scoreBtnContainer">
                <a
                  className="borderBtn"
                  onClick={() => {
                    Sensor.go("pointMall_hp_click", {
                      button_name: "积分明细",
                    });
                    if (device.isWeChat()) {
                      wx.miniProgram.navigateTo({
                        url: "/sp/mem/meP",
                      });
                    } else if (device.isApp()) {
                      window.location.href = "sephora://account/creditRecords";
                    } else {
                      window.location.href = WeChatPath(
                        "/myAccount/integralFlow"
                      );
                    }
                  }}
                >
                  积分明细
                </a>
                <a
                  className="borderBtn"
                  onClick={() => {
                    Sensor.go("pointMall_hp_click", {
                      button_name: "兑换记录",
                    });
                    window.location.href = WeChatPath("/v2/html/exchangeList");
                  }}
                >
                  兑换记录
                </a>
              </div>
            )}
          </div>
        )}
        {expireIntegral && (
          <div>
            {/* 您有xx积分将于 过期 */}
            <span className="expireMsg">{expireIntegral}</span>
          </div>
        )}
      </div>
    );
  }
}
