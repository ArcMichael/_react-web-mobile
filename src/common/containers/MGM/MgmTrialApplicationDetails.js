import React, { Component } from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import * as device from "../../lib/device";
import { urlGetParams } from "../../lib/url";
import CurrentComponentCommonTop from "../../components/CommonTop";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/MgmTrialIndex.scss");
}
export class MgmTrialApplicationDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (device.isApp()) {
      let eventId = urlGetParams(window.location, "eventId");
      let params = {
        screenName: `campaign_mgmTrialApplicationDetails_${eventId}`,
        screenType: "Campaign",
        URL: window.location.pathname,
      };

      let JSINVOKE = new window.SEPHORA_JSINVOKE();
      if (JSINVOKE.logEvent) {
        JSINVOKE.logEvent("customScreenView", params);
        JSINVOKE.logEvent("screen_view", params);
      }
    }
  }

  render() {
    return (
      <div style={{ lineHeight: "normal", padding: "20px" }} className="detail_p">
        <CurrentComponentCommonTop />
        <div id="apptitle">活动细则</div>
        <p style={{ fontWeight: "bold" }}>试用申领：</p>
        <br />
        <p>试用申领活动分为直接申领和邀请好友助力申领两种形式，具体申领流程如下：</p>
        <br />

        <p>直接申领：</p>
        <p>1. 活动期间，即刻申领，即有机会领取产品礼包或优惠券。</p>
        <p>2. 可选择至门店或官网领取，若活动结束后未领取成功，则视为放弃申领资格。</p>
        <p>
          3.
          收到产品礼包后，可以进入“我的申领”填写并提交试用报告。超过3次未提交报告，则无法再次申领（请至丝芙兰APP填写提交）。
        </p>
        <p>4. 申领成功的优惠券可以在“我的优惠券”查询，请在有效期内使用，使用条件以当期活动为准。</p>
        <br />

        <p>邀请好友助力申领：</p>
        <p>1. 活动期间，邀请好友进入小程序，即有机会领取产品礼包或优惠券。</p>
        <p>2. 完成邀请后，可选择至门店或官网领取，若活动结束后未领取成功，则视为放弃申领资格。</p>
        <p>
          3.
          收到产品礼包后，可以进入“我的申领”填写并提交试用报告。超过3次未提交报告，则无法再次申领（请至丝芙兰APP填写提交）。
        </p>
        <p>4. 申领成功的优惠券可以在“我的优惠券”查询，请在有效期内使用，使用条件以当期活动为准。</p>
        <br />
        <br />

        <p style={{ fontWeight: "bold" }}>专享申领：</p>
        <br />
        <p>
          符合申领条件，即有机会直接申领或邀请好友助力申领，申领流程与试用申领活动一致。具体条件详见当期活动要求。
        </p>
        <br />
        <p>若未符合申领条件，则无法领取产品礼包或优惠券。</p>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {})(MgmTrialApplicationDetails);
