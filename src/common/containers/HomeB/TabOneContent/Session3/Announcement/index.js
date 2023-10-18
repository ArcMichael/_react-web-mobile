import React, { Component } from "react";
import Text from "@/components/Text";
import Sensor from "@/Utils/sensor/index";
import { TrumpetOutlined } from "@/components/Icons";
import loadable from "@loadable/component";

const SwiperWrap = loadable.lib(() => import("react-id-swiper"));

const params = {
  containerClass: "Announcement-Carouse",
  shouldSwiperUpdate: true,
  rebuildOnUpdate: true,
  direction: "vertical",
  autoplay: {
    delay: 3000,
  },
  loop: true,
};

/**
 * @typedef {import('@/lib/services/Mpcms').TextCommonDetail} TextCommonDetail
 */

/**
 * @typedef {{
 *  data:TextCommonDetail[];
 * }} AnnouncementProps
 */

/**
 * @extends {React.Component<AnnouncementProps>}
 */
export default class Announcement extends Component {
  static propTypes = {
    // prop: PropTypes,
  };
  constructor(props) {
    super(props);
    this.getSwiperItem = this.getSwiperItem.bind(this);
  }

  componentDidMount() { }

  getSwiperItem() {
    const { data } = this.props;
    return data
      .map((content, i) => {
        if (content) {
          return (
            <div key={`${i}`} style={{ height: "0.4rem" }}>
              <Text.Title
                ellipsis
                trackingCode={content.trackingCode}
                onClick={() => {
                  Sensor.go("clickBanner_App_Mob", {
                    platform_type: "mobile",
                    system_type: "",
                    environment_type: "",
                    vip_card: "",
                    vip_card_type: "",
                    action_id: "1000001_013",
                    page_id: "MB_1000001",
                    $title: "首页",
                    page_type_detail: "",
                    page_type: "",
                    $url_path: "",
                    $url_query: "",
                    $url: "",
                    current_url: "",

                    banner_content: content.text,
                    banner_belong_area: "Select_ Board",
                    banner_to_url: content.link,
                    //banner_to_page_type: content.link,
                    campaign_code: content.trackingCode,
                    banner_current_url: "home",
                    banner_current_page_type: "home",
                    banner_to_page_type: "Function-page",
                    banner_ranking: i + 1
                  });
                }}
              >
                <a href={content.link}>{content.text}</a>
              </Text.Title>
            </div>
          );
        }
        return null;
      })
      .filter((item) => Boolean(item));
  }

  render() {
    const swiperItems = this.getSwiperItem();
    if (swiperItems && swiperItems.length > 0) {
      return (
        <div className="Announcement">
          <TrumpetOutlined
            size="0.4rem"
            style={{ marginRight: "0.1rem" }}
          />
          <div
            className="right"
            style={{ overflow: "hidden", height: "0.4rem" }}
          >
            <SwiperWrap>
              {({ default: Swiper }) => {
                return <Swiper {...params}>{this.getSwiperItem()}</Swiper>;
              }}
            </SwiperWrap>
          </div>
        </div>
      );
    }
    return <div />;
  }
}
