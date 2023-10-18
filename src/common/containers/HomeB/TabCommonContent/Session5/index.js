import React, { Component } from "react";
import Card from "@/containers/HomeB/components/Card";
import Text from "@/components/Text";
import ChannelTitle from "@/containers/HomeB/components/ChannelTitle";
import LazyloadImage from "@/components/LazyloadImage";
import DataLink from "@/components/Atoms/DataLink";
import { connect } from "react-redux";
import Sensor from "@/Utils/sensor/index";
import { RightArrowRectFilled } from "@/components/Icons";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 *    type:import('@/containers/HomeB/TabCommonContent').TabKeyType
 *    homepage:RootState['homepage'];
 *    dispatch: import('redux').Dispatch;
 * }} Session5Props
 */

/**
 * @typedef {import('@/lib/services/Mpcms').ProductCommonDetail} ProductCommonDetail
 */

/**
 * @extends {React.Component<Session5Props>}
 */
class Session5 extends Component {
  constructor(props) {
    super(props);
    this.getLeft = this.getLeft.bind(this);
    this.getRight = this.getRight.bind(this);
    this.getTitleNode = this.getTitleNode.bind(this);
  }

  getLeft() {
    const { type, homepage } = this.props;

    const session2 = homepage[`tabDatas.${type.toUpperCase()}.session2`];

    const ranking = session2 && session2.ranking;

    let products = ranking ? ranking.products : null;

    if (products) {
      const { type } = this.props;
      const data = products[0];
    console.log('data======', products[0]);
      if (data) {
        return (
          <DataLink
            _ClassName="left"
            _Href={data.link}
            _Omniture={data.trackingCode}
            _Sensor={{
              eventKey: "clickBanner_App_Mob",
              value: {
                platform_type: "mobile",
                system_type: "",
                environment_type: "",
                vip_card: "",
                vip_card_type: "",
                action_id: "1000001_023",
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

                banner_content: `${data.brandNameEN}|${data.name}`,
                banner_belong_area: `${type}_Ranking`,
                banner_to_url: data.link,
                banner_to_page_type: "List-page",
                banner_ranking: 1,
                campaign_code: data.trackingCode || data.link|| "",
                commodity_sku: data.spuId,
                op_code: data.spuId,
              },
            }}
          >
            <LazyloadImage
              imgProps={{
                src: data.imagePath + "210x210.jpg",
              }}
              loadingType="smalltype"
            />
            <Text ellipsis={2} className="title">
              {data.brandNameEN}
              {data.name}
            </Text>
            <Text className="price" ellipsis>
              {data.priceTxt}
            </Text>
          </DataLink>
        );
      }
    }

    return "";
  }
  getRight() {
    const { type, homepage } = this.props;
    const session2 = homepage[`tabDatas.${type.toUpperCase()}.session2`];
    const ranking = session2 && session2.ranking;

    let products = ranking ? ranking.products : null;

    if (products) {
      const top = products[1];
      const bottom = products[2];
      const { type } = this.props;
      if (top || bottom) {
        return (
          <div className="right">
            {top && (
              <DataLink
                _Href={top.link}
                _Omniture={top.trackingCode}
                _Sensor={{
                  eventKey: "clickBanner_App_Mob",
                  value: {
                    banner_content: `${top.brandNameEN}|${top.name}|${top.spuId}`,
                    banner_belong_area: `${type}_Ranking`,
                    banner_to_url: top.link,
                    banner_to_page_type: "List-page",
                    banner_ranking: 2,
                    campaign_code: top.trackingCode || "",
                  },
                }}
              >
                <div className="img">
                  <LazyloadImage
                    imgProps={{
                      src: top.imagePath + "210x210.jpg",
                    }}
                    loadingType="smalltype"
                  />
                </div>
                <div className="product-title">
                  <Text ellipsis={2} className="title">
                    {top.brandNameEN}
                    {top.name}
                  </Text>
                  <Text className="price" ellipsis>
                    {top.priceTxt}
                  </Text>
                </div>
              </DataLink>
            )}
            {bottom && (
              <DataLink
                _Href={bottom.link}
                _Omniture={bottom.trackingCode}
                _Sensor={{
                  eventKey: "clickBanner_App_Mob",
                  value: {
                    banner_content: `${bottom.brandNameEN}|${bottom.name}`,
                    banner_belong_area: `${type}_Ranking`,
                    banner_to_url: bottom.link,
                    banner_to_page_type: "List-page",
                    banner_ranking: 3,
                    campaign_code: bottom.trackingCode || "",
                  },
                }}
              >
                <div className="img">
                  <LazyloadImage
                    imgProps={{
                      src: bottom.imagePath + "210x210.jpg",
                    }}
                    loadingType="smalltype"
                  />
                </div>
                <div className="product-title">
                  <Text ellipsis={2} className="title">
                    {bottom.brandNameEN}
                    {bottom.name}
                  </Text>
                  <Text className="price" ellipsis>
                    {bottom.priceTxt}
                  </Text>
                </div>
              </DataLink>
            )}
          </div>
        );
      }
    }
    return "";
  }

  getTitleNode() {
    let title;
    const { type, homepage } = this.props;
    const session2 = homepage[`tabDatas.${type.toUpperCase()}.session2`];
    const ranking = session2 && session2.ranking;

    if (ranking) {
      title = ranking.title;
    }

    if (title) {
      return (
        <ChannelTitle
          title={title.text}
          link={title.link}
          trackingCode={title.trackingCode}
          style={{
            marginTop: "0.48rem",
            marginBottom: "0.32rem",
          }}
          onClick={() => {
            Sensor.go("clickBanner_App_Mob", {
              banner_content: `${title}`,
              banner_belong_area: `${type}_Ranking`,
              banner_to_url: title.link,
              banner_to_page_type: title.link,
              campaign_code: "",
            });
          }}
          icon={<RightArrowRectFilled size="0.26rem" />}
        />
      );
    }
    return <div />;
  }

  render() {
    return (
      <div className="Session5">
        {this.getTitleNode()}
        <Card className="products" style={{ paddingTop: "0.32rem", paddingBottom: "0.32rem" }}>
          {this.getLeft()}
          {this.getRight()}
        </Card>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Session5);
