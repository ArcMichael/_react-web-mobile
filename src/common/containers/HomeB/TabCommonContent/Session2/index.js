import React, { Component } from "react";
import Text from "@/components/Text";
import DataLink from "@/components/Atoms/DataLink";
import LazyloadImage from "@/components/LazyloadImage";
import { connect } from "react-redux";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 *    type:import('@/containers/HomeB/TabCommonContent').TabKeyType
 *    homepage:RootState['homepage'];
 *    dispatch: import('redux').Dispatch;
 * }} Session2Props
 */

/**
 * @typedef {import('@/lib/services/Mpcms')} CommonBannerDTO
 */

/**
 * @extends {React.Component<Session2Props>}
 */
class Session2 extends Component {
  constructor(props) {
    super(props);
    this.getIcons = this.getIcons.bind(this);
  }

  getIcons() {
    const { type, homepage } = this.props;

    const session1 = homepage[`tabDatas.${type.toUpperCase()}.session1`];
    const icon = session1 && session1.icon;

    const nodes = (icon || [])
      .map((content, i) => {
        if (content) {
          return (
            <DataLink
              _Href={content.link}
              _Omniture={content.trackingCode}
              _Sensor={{
                eventKey: "clickBanner_App_Mob",
                value: {
                  platform_type: "mobile",
                  system_type: "",
                  environment_type: "",
                  vip_card: "",
                  vip_card_type: "",
                  action_id: "1000001_021",
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

                  banner_content: content.text,
                  banner_belong_area: type ? `${type}_Icon` : "Select_Hero",
                  banner_to_url: content.link,
                  banner_to_page_type: content.link,
                  banner_ranking: i + 1,
                  campaign_code: content.trackingCode,
                },
              }}
              _ClassName="icon-item"
              key={`${i}`}
            >
              <LazyloadImage
                imgProps={{
                  src: content.image,
                }}
               />
              <Text ellipsis>{content.text}</Text>
            </DataLink>
          );
        }
        return null;
      })
      .filter(item => {
        return Boolean(item);
      });

    return nodes;
  }

  render() {
    const nodes = this.getIcons() || [];

    return <div className="Session2">{nodes}</div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(Session2);
