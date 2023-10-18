import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "@/actions/plpPage";
import { CheckCampaignCode } from "@/lib/Tools";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Brandadvertxt from "./Brandadvertxt";
import Image from "../../../components/ImagesLazyLoad/index";

class Brandadvertising extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BRANDPAGEIMG: null,
      BRANDPAGETXT: null,
    };
    this.addbanner = this.addbanner.bind(this);
    this.addtxt = this.addtxt.bind(this);
    this.bannerUrl = this.bannerUrl.bind(this);
  }

  componentDidMount() {
    let currenturl = window && window.location && window.location.pathname;
    currenturl = currenturl.split("/")[2].split("-")[1];
    const { actions } = this.props;
    const body = {
      head: {
        token: "string",
        userId: "string",
      },
      queryBody: {
        locationLabel: `MOBILE:BRANDPAGE:${currenturl}`,
        memberGroupId: 0,
      },
    };
    const bodytxt = {
      head: {
        token: "string",
        userId: "string",
      },
      queryBody: {
        locationLabel: `MOBILE:BRANDPAGE:TEXT:${currenturl}`,
        memberGroupId: 0,
      },
    };
    actions.advertImg(body, this.addbanner);
    actions.advertTxt(bodytxt, this.addtxt);
  }

  bannerUrl() {
    const { name } = this.props;
    const { BRANDPAGEIMG } = this.state;
    if (
      BRANDPAGEIMG &&
      BRANDPAGEIMG.results &&
      BRANDPAGEIMG.results.resourceList &&
      BRANDPAGEIMG.results.resourceList[0]
    ) {
      const data = BRANDPAGEIMG.results.resourceList[0];
      const href = CheckCampaignCode(data.link, data.omniture);

      Sensor.go("clickBanner_App_Mob", {
        $lib_detail: "M_Search##bannerUrl##Brandadvertising.js##67",
        banner_type: "Campaign",
        banner_current_page_type: "List-page",
        banner_content: data.content || name,
        banner_belong_area: "Brand_Banner",
        banner_to_url: href,
        banner_to_page_type: "Campaign-page",
        banner_ranking: "1",
        campaign_code: href,
        belong_team: "Site Operation",
      });
    }

    GoogleAnalytics.push({
      event: "promotionClick",
      ecommerce: {
        promoClick: {
          promotions: [
            {
              id: null,
              name,
              creative: "Banner",
              position: "Brand List",
            },
          ],
        },
      },
      eventCallback() {},
    });
  }

  addbanner(data) {
    const { name } = this.props;
    this.setState({
      BRANDPAGEIMG: data,
    });
    GoogleAnalytics.push({
      ecommerce: {
        promoView: {
          promotions: [
            {
              id: null,
              name,
              creative: "banner",
              position: "Brand List",
            },
          ],
        },
      },
    });
  }

  addtxt(data) {
    this.setState({
      BRANDPAGETXT: data,
    });
  }

  render() {
    const { BRANDPAGEIMG, BRANDPAGETXT } = this.state;
    let brandImglink = "";
    let brandImg = "";
    let brandShow = "none";
    let brandadvertxt = [];
    if (BRANDPAGEIMG && BRANDPAGEIMG.results && BRANDPAGEIMG.results.resourceList.length > 0) {
      const data = BRANDPAGEIMG.results.resourceList[0];
      brandImg = data.imagePath;
      brandImglink = data.link ? data.link : "javascript:;";
      brandImg ? (brandShow = "block") : (brandShow = "none");
    }
    if (BRANDPAGETXT && BRANDPAGETXT.results && BRANDPAGETXT.results.resourceList.length > 0) {
      brandadvertxt = BRANDPAGETXT.results.resourceList.map((el, index) => {
        if (index > 3) {
          return false;
        }
        return <Brandadvertxt key={index} obj={el} num={index} />;
      });
    }
    return (
      <div className="brand_advertising" style={{ display: brandShow }}>
        <a href={brandImglink} className="brand_img" onClick={this.bannerUrl}>
          {brandImg && <Image src={brandImg} alt="" />}
        </a>
        <div className="brand_text">{brandadvertxt}</div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Brandadvertising);
