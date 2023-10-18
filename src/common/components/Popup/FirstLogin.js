import React from "react";
import { connect } from "react-redux";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import { bindActionCreators } from "redux";
import * as popup from "../../actions/popup";
import * as retentionInfo from "../../actions/retentionInfo";
import { SetSingleCookie2, CheckCampaignCode } from "../../lib/Tools";
import Sensor from "../../Utils/sensor/index";
import Image from "../ImagesLazyLoad/index";
import * as utilCookieUtil from "../../Utils/cookieUtil";

const NOTRETENTIONPAGES =
  require("../../Mapping/config_retention_url.json").noRetiontionUrl;
class FirstLogin extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.state = {};
  }
  componentDidMount() {
    const {
      _zIndex,
      _imgLink,
      _imgLinkOM,
    } = this.props;
    const linkhref = CheckCampaignCode(_imgLink, _imgLinkOM);


    Sensor.go("clickBanner_App_Mob", {
      platform_type: "mobile",
      system_type: "",
      environment_type: "",
      vip_card: "",
      vip_card_type: "",
      page_id: "MB_1000001",
      action_id: "1000001_025",
      $title: "首页",
      page_type_detail: "",
      page_type: "",
      $url_path: "",
      $url_query: "",
      $url: "",
      current_url: "",
 
      banner_current_url: "home",
      banner_current_page_type: "home",
      banner_to_url: linkhref,
      banner_to_page_type: "Funtion_page",
      banner_ranking: _zIndex
    });
  }

  /*
   * 留资弹框
   */
  retentionInfoPopup() {
    const { popup, retentionInfo } = this.props;
    const pathname = window.location.pathname;
    const TPID = GetSingleCookie2({ key: "tpId" });
    let ifRetentionInfoPage = true;
    let ajaxCount = 0;
    /*
     * 判断页面是否在不需要留资的路由中
     */
    NOTRETENTIONPAGES.forEach((url) => {
      if (pathname.match(new RegExp(url))) {
        ifRetentionInfoPage = false;
      }
    });
    if (ifRetentionInfoPage && TPID && ajaxCount === 0) {
      /*
       * 留资接口判断是否需要留资
       */
      ajaxCount = 1;
      retentionInfo.getAuthenticate((json) => {
        if (json && json.results) {
          if (json.results.isPopUp) {
            popup.popupComponent(1, "RetentionInfo", {
              _mobile: json.results.mobile,
            });
            return;
          } else {
            SetSingleCookie2({ key: "tpId", value: 0 });
            this.pinkCardPopup();
            return;
          }
        }
        this.pinkCardPopup();
      });
    } else {
      this.pinkCardPopup();
    }
  }

  /*
   * 粉卡弹框
   */
  pinkCardPopup() {
    const { popup } = this.props;
    /*
     * 判断是否需要弹出粉卡弹框
     */
    if (
      GetSingleCookie2({ key: "FirstTime" }) === 1 &&
      GetSingleCookie2({ key: "GroupId" }) === 5
    ) {
      popup.popupComponent(1, "PopupPinkCard");
    } else {
      popup.popupComponent(0, "FirstLogin");
    }
  }
  /*
   * 关闭弹框
   */
  closePopup(link, omniture, content, e) {
    const { popup } = this.props;
    const nowDate = new Date();

    // 设置coookie("SPECIALDAY");
    link &&
      Sensor.go("clickBanner_App_Mob", {
        $lib_detail: "M_POPUP##closePopup##FirstLogin.js##370",
        banner_type: "campaign",
        banner_content: content,
        banner_belong_area: "Popup",
        banner_to_url: link,
        banner_to_page_type: link,
        banner_ranking: "",
        belong_team: "Animation",
        campaign_code: link || omniture,
      });
    e.stopPropagation();
    // util_popupManager.campaignPopupClose({ callback: () => popup.popupComponent(0, null) })
    popup.popupComponent(0, null);
    if (!window || !window.document || !window.document.cookie) return false;
    utilCookieUtil.SetSingleCookie2({
      key: "SPECIALDAY",
      value: nowDate.toLocaleDateString(),
    });
  }

  render() {
    const {
      _zIndex,
      _imgSrc,
      _imgLink,
      _imgLinkOM,
      content,
      _placeholder,
      _pageShow,
    } = this.props;
    const linkhref = CheckCampaignCode(_imgLink, _imgLinkOM);
    return (
      <div
        className={"first-login-popup" + (_imgSrc ? " cur" : "")}
        style={{ height: "100%", zIndex: _zIndex }}
        onClick={this.closePopup.bind(this, null, null, null)}
      >
        <div className="first-login-popup-content">
          <a
            className="first-login-popup-link"
            href={linkhref}
            onClick={this.closePopup.bind(this, linkhref, linkhref, content)}
          />
          <Image
            title={content}
            src={_imgSrc}
            placeholder={_placeholder || null}
            offset={0}
            pageShow={_pageShow}
            type="placeholderImage"
          />
          {content && (
            <div className="first-login-popup-button">
              {content.length > 6 ? content.slice(0, 6) : content}
            </div>
          )}
          <span
            className="first-login-popup-close"
            onClick={this.closePopup.bind(this, null, null, null)}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    popup: bindActionCreators(popup, dispatch),
    retentionInfo: bindActionCreators(retentionInfo, dispatch),
    dispatch,
  })
)(FirstLogin);
