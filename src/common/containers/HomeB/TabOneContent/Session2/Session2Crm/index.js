import React from "react";
import Mpcms from "@/lib/services/Mpcms";
import Card from "@/containers/HomeB/components/Card";
import { RightArrowOutlined } from "@/components/Icons";
import UserCard from "./UserCard";
import Sensor from "../../../../../Utils/sensor/index";

/**
 * @typedef {import('@/lib/services/Mpcms').CommonBannerDTO} CommonBannerDTO
 */
/**
 * @typedef {import('@/lib/services/Mpcms').TextCommonDetail} TextCommonDetail
 */

/**
 * @extends {React.Component<{ isLogin:boolean; data:TextCommonDetail;  }>}
 */
class Session2Crm extends React.Component {
  constructor(props) {
    super(props);
    this.getHomeBeautyChannelCRM = this.getHomeBeautyChannelCRM.bind(this);
    this.state = {
      /** @type {TextCommonDetail} - description */
      info: props.data || {},
    };
  }

  componentDidMount() {
    this.getHomeBeautyChannelCRM();
  }

  getHomeBeautyChannelCRM() {
    Mpcms.getCommonBannerByKey(Mpcms.BannerEnums.hometab.beautyChanelCrm).then(res => {
      if (res.status === 0 && Array.isArray(res.results)) {
        /** @type {TextCommonDetail} - description */
        const info =
          res.results && res.results[0] && res.results[0].contentDetails && res.results[0].contentDetails[0]
            ? res.results[0].contentDetails[0]
            : null;

        this.setState({
          info: info,
        });
      }
    });
  }

  render() {
    const { info: item } = this.state;
    const { isLogin } = this.props;

    if (item) {
      return (
        <Card
          onClick={() => {
            Sensor.go("clickBanner_App_Mob", {
              platform_type: "mobile",
              system_type: "",
              environment_type: "",
              vip_card: "",
              vip_card_type: "",
              action_id: "1000001_007",
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
              banner_belong_area: "Select_CRM",
              banner_to_url: item.link,
              banner_to_page_type: item.link,
              campaign_code: item.trackingCode,
            });
          }}
          href={item.link}
          className="Session2-crm"
        >
          <div className="left">{isLogin ? <UserCard /> : <div className="text">Welcome</div>}</div>
          <div className="right">
            <span>{item.text}</span>
            <RightArrowOutlined size="0.24rem" color="#666" />
          </div>
        </Card>
      );
    }
    return <div />;
  }
}

export default Session2Crm;
