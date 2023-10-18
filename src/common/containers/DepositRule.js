import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { isDevice } from "../lib/device";

import CommonPageTitle from "../components/CommonPageTitle";
import CdnImage from "@/components/CdnImage";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/deposit_rule.scss");
}
class LegalBriefPopup extends React.Component {
  render() {
    return (
      <div className="popupLegalBrief">
        {isBrowser() && isDevice() === "mobile" && (
          <CommonPageTitle _isBack _title={"丝芙兰官网预售规则"} />
        )}
        <CdnImage src="/soa/nmobile/img/product/prev_sales_legal_brief.png" alt="" />
      </div>
    );
  }
}

const mapStateToPrps = () => ({});

export default connect(mapStateToPrps, {})(LegalBriefPopup);
