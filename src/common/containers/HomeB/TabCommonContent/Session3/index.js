import React from "react";
import settings from "@/containers/HomeB/settings";
import Sensor from "@/Utils/sensor/index";
import { connect } from "react-redux";
import Brandwall from "@/containers/HomeB/components/Brandwall";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 *    type:import('@/containers/HomeB/TabCommonContent').TabKeyType
 *    homepage:RootState['homepage'];
 *    dispatch: import('redux').Dispatch;
 * }} Session3Props
 */

/**
 * @extends {React.Component<Session3Props>}
 */
class Session3 extends React.Component {
  constructor(props) {
    super(props);
    this.getNodesAndTitle = this.getNodesAndTitle.bind(this);
  }

  getNodesAndTitle() {
    /** @type {brandItem[]} - description */
    let dataSource = null;
    let titleProps = null;

    const { type, homepage } = this.props;
    const session1 = homepage[`tabDatas.${(type || "").toUpperCase()}.session1`];

    const brand = session1 && session1.brand;
    if (brand && Array.isArray(brand.brandWall)) {
      dataSource = brand.brandWall
        .map(item => {
          return {
            brandNameCN: item.text,
            brandNameEN: item.text,
            link: item.link,
            image: item.image,
            trackingCode: item.trackingCode,
          };
        })
        .filter(item => {
          return Boolean(item);
        });
    }
    if (brand && brand.allBrand) {
      titleProps = {
        href: brand.allBrand.link,
        trackingCode: brand.allBrand.trackingCode,
        onClick: () => {
          Sensor.go("clickBanner_App_Mob", {
            platform_type: "mobile",
            system_type: "",
            environment_type: "",
            vip_card: "",
            vip_card_type: "",
            action_id: "1000001_014",
            page_id: "MB_1000001",
            $title: "首页",
            page_type_detail: "",
            page_type: "",
            $url_path: "",
            $url_query: "",
            $url: "",
            current_url: "",
            banner_current_url: "home",
            banner_current_page_type: "home",

            banner_content: "全部品牌",
            banner_belong_area: `${type}_All Brand`,
            banner_to_url: brand.allBrand.link,
            banner_to_page_type: brand.allBrand.link,
            campaign_code: brand.allBrand.trackingCode || "",
          });
        },
        children: brand.allBrand.text,
      };
    }

    return {
      dataSource: (dataSource || []).slice(0, settings.limits.tabBrandwall),
      titleProps,
    };
  }

  render() {
    const { type } = this.props;
    const { dataSource, titleProps } = this.getNodesAndTitle();
    return <Brandwall dataSource={dataSource || []} titleProps={titleProps} type={type} />;
  }
}

/**
 * @param {import('@/store/configureStore').RootState} state
 */
const mapStateToProps = state => {
  return {
    homepage: state.homepage,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Session3);
