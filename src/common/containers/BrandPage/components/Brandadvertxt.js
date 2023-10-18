import React, { Component } from "react";
import Sensor from "@/Utils/sensor";
import { CheckCampaignCode } from "@/lib/Tools";

class Brandadvertxt extends Component {
  constructor(props) {
    super(props);
  }
  sensorEvenet(linkHref) {
    let { obj } = this.props;
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_Search##sensorEvenet##Brandadvertxt.js##12",
      banner_type: "Icon",
      banner_current_page_type: "List-page",
      banner_content: obj.content || "",
      banner_belong_area: "Brand_Banner",
      banner_to_url: linkHref,
      banner_to_page_type: linkHref,
      banner_ranking: "2",
      campaign_code: linkHref,
      belong_team: "Site Operation",
    });
  }
  render() {
    let { obj } = this.props,
      linkHref = "";
    linkHref = obj.link ? CheckCampaignCode(obj.link, obj.omniture) : "javascript:;";
    return (
      <a href={linkHref} onClick={this.sensorEvenet.bind(this, linkHref)} className="brand_advertxt">
        {obj.content}
      </a>
    );
  }
}

export default Brandadvertxt;
