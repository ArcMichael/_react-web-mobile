import React, { Component } from "react";
import { connect } from "react-redux";
import Card from "@/containers/HomeB/components/Card";
import Text from "@/components/Text";
import LazyloadImage from "@/components/LazyloadImage";
import DataLink from "@/components/Atoms/DataLink";
import Session2Crm from "./Session2Crm";
import { Consumer } from "../../context";

/**
 * @typedef {import("@/store/configureStore").RootState} RootState
 */

/**
 * @typedef {Pick<RootState,'homepage'> & {
 * }} Session2Props
 */

/**
 * @extends {React.Component<Session2Props>}
 */
export class Session2 extends Component {
  constructor(props) {
    super(props);
    this.getBottomItem = this.getBottomItem.bind(this);
    this.getTopItem = this.getTopItem.bind(this);
  }
  SplitNumber = 3;

  getTopItem() {
    const {
      homepage: { session1 },
    } = this.props;

    const { icon } = session1 || {};

    const items = (icon || []).slice(0, this.SplitNumber);

    return items.map((item, i) => {
      return (
        <DataLink
          className=""
          key={`${i}`}
          _Sensor={{
            eventKey: "clickBanner_App_Mob",
            value: {
              platform_type: "mobile",
              system_type: "",
              environment_type: "",
              vip_card: "",
              vip_card_type: "",
              action_id: "1000001_008",
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
              banner_belong_area: "Select_ Icon",
              banner_to_url: item.link,
              banner_to_page_type: item.link,
              banner_ranking: i + 1,
              campaign_code: item.trackingCode,
            },
          }}
          _Href={item.link}
          _Omniture={item.trackingCode}
          _Style={{ display: "flex" }}
        >
          <Text ellipsis className="title">
            {item.text}
          </Text>
          <Text ellipsis className="subtitle">
            {item.subtitle}
          </Text>
          <span className="bottom">
            <span className="imgWrap">
              <LazyloadImage
                imgProps={{
                  src: item.image,
                  style: {
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </span>
          </span>
        </DataLink>
      );
    });
  }

  getBottomItem() {
    const {
      homepage: { session1 },
    } = this.props;

    const { icon } = session1 || {};
    // let TabList;
    // const { homepage } = this.props;
    // if (homepage) {
    //   TabList = homepage.TabList;
    // }
    // let pathname = window.location.pathname;
    // const selectedTab = TabList && TabList.find(item => {
    //   return pathname.includes(item.id) || TabList[0]
    // })
    //console.log('2========', selectedTab);
    const items = (icon || []).slice(this.SplitNumber, this.SplitNumber + 2);
    return items.map((item, i) => {
      return (
        <DataLink
          key={`${i}`}
          _Sensor={{
            eventKey: "clickBanner_App_Mob",
            value: {
              platform_type: "mobile",
              system_type: "",
              environment_type: "",
              vip_card: "",
              vip_card_type: "",
              action_id: "1000001_987",
              page_id: "MB_1000001",
              $title: "首页",
              page_type_detail: "",
              page_type: "",
              $url_path: "",
              $url_query: "",
              $url: "",
              current_url: "",

              banner_content: item.text,
              banner_belong_area: "Select_ Icon",
              banner_to_url: item.link,
              banner_to_page_type: item.link,
              banner_ranking: i + 4,
              campaign_code: item.trackingCode,
             // $element_position:  "",
            },
          }}
          _Href={item.link}
          _Omniture={item.link}
        >
          <span className="bottom-title">
            <Text className="title">{item.text}</Text>
            <Text ellipsis className="subtitle" style={{ fontSize: "0.24rem" }}>
              {item.subtitle}
            </Text>
          </span>
          <span className="img-wrap">
            <LazyloadImage
              imgProps={{
                src: item.image,
                style: {
                  height: "2.21rem",
                  borderRadius: "0.16rem",
                },
              }}
              shape="horizontal-rect"
            />
          </span>
        </DataLink>
      );
    });
  }

  render() {
    const {
      homepage: { session1 },
    } = this.props;

    const { memberInformation } = session1 || {};

    return (
      <Consumer>
        {(contextValue) => (
          <div className="Session2-new-wrap">
            <Session2Crm
              isLogin={contextValue.isLogin}
              data={memberInformation || {}}
             />
             <ul className="home-100">
               <li>100%正品</li>
                <li className="li-point">
                    <div className="li-point-circle" />
                </li>
               <li>每周精选上新</li>
               <li className="li-point">
                    <div className="li-point-circle" />
                </li>
               <li>多重惊喜礼赠</li>
             </ul>
            <Card className="Session2">
              <p className="session2-top">{this.getTopItem()}</p>
              <p className="session2-bottom">{this.getBottomItem()}</p>
            </Card>
          </div>
        )}
      </Consumer>
    );
  }
}

/**
 *
 * @param {RootState} state
 */
const mapStateToProps = (state) => ({
  homepage: state.homepage,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Session2);
