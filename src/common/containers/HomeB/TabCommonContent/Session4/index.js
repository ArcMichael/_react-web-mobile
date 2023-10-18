import React, { Component } from "react";
import LazyloadImage from "@/components/LazyloadImage";
import Text from "@/components/Text";
import Card from "@/containers/HomeB/components/Card";
import Sensor from "@/Utils/sensor/index";
import { connect } from "react-redux";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 *    type:import('@/containers/HomeB/TabCommonContent').TabKeyType
 *    homepage:RootState['homepage'];
 *    dispatch: import('redux').Dispatch;
 * }} Session4Props
 */

/**
 * @extends {React.Component<Session4Props>}
 */
class Session4 extends Component {
  constructor(props) {
    super(props);
    this.getTextAndImage = this.getTextAndImage.bind(this);
  }

  getTextAndImage() {
    const { type, homepage } = this.props;
    const session2 = homepage[`tabDatas.${type.toUpperCase()}.session2`];
    return session2 && session2.banner1;
  }

  render() {
    const images = this.getTextAndImage();
    const { type } = this.props;

    if (Array.isArray(images)) {
      return images.map((item, i) => {
        return (
          <Card
            key={`${i}`}
            className="Session4"
            href={item.link}
            trackingCode={item.trackingCode}
            style={{
              paddingTop: 0,
              paddingBottom: "0.32rem",
            }}
            onClick={() => {
              console.log('1===========')
              Sensor.go("clickBanner_App_Mob", {
                platform_type: "mobile",
                system_type: "",
                environment_type: "",
                vip_card: "",
                vip_card_type: "",
                action_id: "1000001_015",
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

                banner_content: item.text,
                banner_belong_area: `${type}_Ad Banner1`,
                banner_to_url: item.link,
                banner_to_page_type: item.link,
                //'banner_ranking': '',
                campaign_code: item.trackingCode,
                $element_content: item.text,
              });
              Sensor.go("clickBanner_App_Mob", {
                platform_type: "mobile",
                system_type: "",
                environment_type: "",
                vip_card: "",
                vip_card_type: "",
                action_id: "1000001_016",
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

                banner_content: item.text,
                banner_belong_area: `${type}_Ad Banner1`,
                banner_to_url: item.link,
                banner_to_page_type: item.link,
                //'banner_ranking': '',
                campaign_code: item.trackingCode,
                $element_content: item.text,
              });


              Sensor.go("clickBanner_App_Mob", {
                platform_type: "mobile",
                system_type: "",
                environment_type: "",
                vip_card: "",
                vip_card_type: "",
                action_id: "1000001_022",
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

                banner_content: item.text,
                banner_belong_area: `${type}_Ad Banner1`,
                banner_to_url: item.link,
                banner_to_page_type: item.link,
                //'banner_ranking': '',
                campaign_code: item.trackingCode,
                $element_content: item.text,
                banner_ranking :i+1
              });

            }}
          >
            <div className="Session4-img">
              <LazyloadImage
                imgProps={{
                  src: item.image,
                  style: {
                    width: "100%",
                    height: "100%",
                  },
                }}
                shape="horizontal-rect"
                loadingType="smalltype"
              />
            </div>
            <div className="Session4-text">
              <Text.Title level={2} ellipsis>
                {item.text}
              </Text.Title>
              <Text ellipsis>{item.subtitle}</Text>
            </div>
          </Card>
        );
      });
    }

    return <div />;
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

export default connect(mapStateToProps, mapDispatchToProps)(Session4);
