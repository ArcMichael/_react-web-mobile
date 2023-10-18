import React, { Component } from "react";
import Text from "@/components/Text";
import LazyloadImage from "@/components/LazyloadImage";
import DataLink from "@/components/Atoms/DataLink";
import { getLinkFromItems } from "@/containers/HomeB/utils";
import Card from "@/containers/HomeB/components/Card";
import ActionOnlineReference from "@/actions/onlineReference";
import ChannelTitle from "../../components/ChannelTitle";
import { Consumer } from "../../context";
import Sensor from "../../../../Utils/sensor";
import "./style.scss";

const { Title } = Text;

/**
 * @typedef {import('@/lib/services/Mpcms').CommonBannerDTO} CommonBannerDTO
 */
/**
 * @typedef {import('@/lib/services/Mpcms').TextCommonDetail} TextCommonDetail
 */
/**
 * @typedef {import('@/lib/services/Mpcms').ImageCommonDetail} ImageCommonDetail
 */

/**
 * @typedef {{
 *  dataSource:{
 *    top: import('@/lib/services/Mpcms').SessionThird['beautyChannel']['large'];
 *    mids:  import('@/lib/services/Mpcms').SessionThird['beautyChannel']['medium'];
 *    bottoms: CommonBannerDTO[];
 *  };
 * }} Session5Props
 */

/**
 * @extends {React.Component<Session5Props>}
 */
class Session5 extends Component {
  constructor(props) {
    super(props);
    this.getChannel1 = this.getChannel1.bind(this);
    this.getChannel2 = this.getChannel2.bind(this);
    this.getChannel3 = this.getChannel3.bind(this);
  }

  getChannel1() {
    const { dataSource } = this.props;

    const { top: channel } = dataSource;

    if (channel) {
      return (
        <div className="Session5-channel1">
          <Title
            level={4}
            ellipsis
            style={{ marginTop: 0, wordBreak: "break-all" }}
          >
            {channel.text}
          </Title>
          <DataLink
            _Href={channel.link}
            _Omniture={channel.trackingCode}
            _Sensor={{
              eventKey: "clickBanner_App_Mob",
              value: {
                platform_type: "mobile",
                system_type: "",
                environment_type: "",
                vip_card: "",
                vip_card_type: "",
                action_id: "1000001_018",
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

                banner_content: channel.text,
                banner_belong_area: "Select_ Beauty Channel",
                banner_to_url: channel.link,
                banner_to_page_type: channel.link,
                campaign_code: channel.link,
                banner_ranking: 1
              },
            }}
          >
            <LazyloadImage
              imgProps={{
                src: channel.image,
              }}
              shape="horizontal-rect"
              loadingType="smalltype"
            />
          </DataLink>
        </div>
      );
    }
    return "";
  }
  getChannel2() {
    const { dataSource } = this.props;

    const { mids: beauty2List } = dataSource;

    if (Array.isArray(beauty2List)) {
      return (
        <div className="Session5-channel2">
          {beauty2List.slice(0, 3).map((content, i) => {
            return (
              <DataLink
                key={`${i}`}
                _Href={
                  content.text === "在线咨询"
                    ? "javascript:void(0)"
                    : content.link
                }
                _Omniture={content.trackingCode}
                _Sensor={{
                  eventKey: "clickBanner_App_Mob",
                  value: {
                    banner_current_url: "home",
                    banner_current_page_type: "home",
                    banner_ranking: 1 + i,
                    action_id: "1000001_018",
                    page_id: "MB_1000001",

                    banner_content: content.text,
                    banner_belong_area: "Select_ Beauty Channel",
                    banner_to_url: content.link,
                    banner_to_page_type: "home",
                    campaign_code: content.link,
                  },
                }}
                _ClickCallback={() => {
                  if (content.text === "在线咨询") {
                    Sensor.go("CustomerServiceClick", {
                      button_location: "home_Beauty Channel",
                    });
                    ActionOnlineReference.OpenOnlineReferenceServices();
                  }
                }}
              >
                <Text.Title level={4} ellipsis>
                  {content.text}
                </Text.Title>
                <div>
                  <LazyloadImage
                    imgProps={{
                      src: content.image,
                    }}
                    shape="vertical-rect"
                    loadingType="smalltype"
                  />
                </div>
              </DataLink>
            );
          })}
        </div>
      );
    }
    return "";
  }
  getChannel3() {
    const { dataSource } = this.props;
    const { bottoms: beauty3List } = dataSource;
    if (Array.isArray(beauty3List)) {
      /** @type {TextCommonDetail} - description */
      let title = {};
      /** @type {CommonBannerDTO[]} - description */
      let icons = [];

      beauty3List.forEach((beauty3Item) => {
        if (beauty3Item.sequence === 1 && beauty3Item.contentDetails) {
          title = beauty3Item.contentDetails.find((i) => i.type === "text");
        } else {
          icons.push(beauty3Item);
        }
      });

      return (
        <div className="Session5-channel3">
          {title.text && <Title ellipsis>{title.text}</Title>}
          <div style={{ marginTop: title.text ? 0 : "0.32rem" }}>
            {icons.map((item, i) => {
              const text = item.contentDetails.find((i) => i.type === "text");
              const img = item.contentDetails.find((i) => i.type === "image");
              const { link, trackingCode } = getLinkFromItems(text, img);

              return (
                <DataLink
                  _Href={link}
                  _Omniture={trackingCode}
                  _Sensor={{
                    eventKey: "clickBanner_App_Mob",
                    value: {
                      platform_type: "mobile",
                      system_type: "",
                      environment_type: "",
                      vip_card: "",
                      vip_card_type: "",
                      action_id: "1000001_018",
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

                      banner_content: text ? text.text : "",
                      banner_belong_area: "Select_ Beauty Channel",
                      banner_to_url: link,
                      banner_to_page_type: link,
                      campaign_code: link,
                    },
                  }}
                  key={`${i}`}
                >
                  <div>
                    <LazyloadImage
                      imgProps={{
                        src: img ? img.image : "",
                      }}
                      loadingType="smalltype"
                    />
                  </div>
                  <Title level={5} ellipsis style={{ textAlign: "center" }}>
                    {text && typeof text.text === "string"
                      ? text.text.slice(0, 4)
                      : ""}
                  </Title>
                </DataLink>
              );
            })}
          </div>
        </div>
      );
    }
    return "";
  }

  render() {
    return (
      <div id="home-session-5" className="Session5">
        <ChannelTitle
          title="美力探索"
          style={{
            marginTop: "0.48rem",
            marginBottom: "0.32rem",
          }}
        />
        <Consumer>
          {({ scrollTop }) => {
            return (
              <Card style={{ paddingTop: "0.32rem", paddingBottom: 0 }}>
                {scrollTop > 0 && this.getChannel1()}
                {scrollTop > 0 && this.getChannel2()}
                {scrollTop > 0 && this.getChannel3()}
              </Card>
            );
          }}
        </Consumer>
      </div>
    );
  }
}

export default Session5;
