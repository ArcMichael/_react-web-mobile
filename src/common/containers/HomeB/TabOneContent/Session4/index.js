import React from "react";
import Card from "@/containers/HomeB/components/Card";
import Product from "@/containers/HomeB/components/Product";
import LazyloadImage from "@/components/LazyloadImage";
import Text from "@/components/Text";
import Sensor from "@/Utils/sensor/index";
import { Consumer } from "../../context";
import "./style.scss";
import { getTrackingHref } from '@/lib/Tools';
/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {import('@/lib/services/Mpcms').CommonBannerDTO} CommonBannerDTO
 */

/** @typedef {import('@/lib/services/Mpcms').ImageCommonDetail} ImageCommonDetail  description */
/** @typedef {import('@/lib/services/Mpcms').TextCommonDetail} TextCommonDetail - description */
/** @typedef {import('@/lib/services/Mpcms').ProductCommonDetail} ProductCommonDetail - description */
/**
 * @typedef {{
 *  picks:import('@/lib/services/Mpcms').SephoraPickItem[];
 * }} Session4Props
 */

/**
 * @extends {React.Component<Session4Props>}
 */
class Session4 extends React.Component {
  constructor(props) {
    super(props);
    this.getCardHeight = this.getCardHeight.bind(this);
    this.state = {
      /** @type {CommonBannerDTO[]} - description */
      // pickList: this.props.homepage.picks,
    };
  }

  CardLimit = 5;

  /** @type {HTMLDivElement | null} - description */
  Session4Wrap = null;

  getCardHeight() {
    if (this.Session4Wrap) return this.Session4Wrap.offsetWidth * 1.3;
    return 500;
  }

  /**
   * @param {ProductCommonDetail[]} products
   * @return {React.ReactNode} - description
   */
  static getProducts(products, pIndex) {
    if (Array.isArray(products)) {
      return products.map((item, i) => {
        return (
          <Product
            className="product-item"
            key={`${i}`}
            href={item.link}
            trackingCode={item.trackingCode}
            price={item.priceTxt}
            title={`${item.brandNameEN || ""}${item.name}`}
            onClick={(e) => {
              e.stopPropagation();
              Sensor.go("clickBanner_App_Mob", {
                banner_content:
                  item.brandNameEN + "|" + item.name + "|" + item.spuId,
                banner_belong_area: "Select_ Sephora Picks - Products",
                banner_to_url: item.link,
                banner_to_page_type: item.link,
                campaign_code: item.link,
                banner_ranking: pIndex + 1,
                action_id: "1000001_017",
                page_id: "MB_1000001",
                $element_content: item.name,
                op_code: item.spuId,
                banner_current_url: "home",
                commodity_sku: item.spuId,
                banner_current_page_type: "home",
                position: i + 1,
              });
            }}
            image={`${item.imagePath}210x210.jpg`}
            showShadow
            style={{
              width: "2.4rem",
              height: "3.64rem",
              marginRight: "0.16rem",
            }}
            imageWrapStyle={{
              width: "2rem",
              height: "2rem",
              marginTop: "0.18rem",
              marginBottom: "0.22rem",
            }}
          />
        );
      });
    }

    return "";
  }
  getCards() {
    const { picks } = this.props;
    return picks.slice(0, this.CardLimit).map((item, i) => {
      const { banner, title, products } = item;
      return (
        <Card
          className="Session4-card"
          key={`${i}`}
          style={{
            padding: 0,
          }}
          onClick={() => {
            Sensor.go("clickBanner_App_Mob", {
              banner_content: title.text,
              banner_belong_area: "Select_ Sephora Picks - Banner",
              banner_to_url: banner ? banner.link : "",
              banner_to_page_type: banner ? banner.link : "",
              campaign_code: banner ? banner.link : "",
              banner_ranking: i + 1,
              action_id: "1000001_015",
              page_id: "MB_1000001",
              $element_content: title.text
            });
          }}
          href={banner ? banner.link : ""}
          trackingCode={banner ? banner.trackingCode : ""}
        >
          <LazyloadImage
            imgProps={{
              src: banner.image,
            }}
            shape="vertical-rect"
            loadingType="smalltype"
          />
          <div className="content">
            <div className="text ellipsis title"
              id={banner.link}
              onClick={(e) => {
                console.log('1===========')
                let href = getTrackingHref({ _Href: banner.link, _Omniture: banner.trackingCode || '' });
                window.location.href = href;
                Sensor.go("clickBanner_App_Mob", {
                  banner_content: title ? title.text : "",
                  banner_belong_area: "Select_ Sephora Picks_ Title",
                  banner_ranking: i + 1,
                  action_id: "1000001_016",
                  page_id: "MB_1000001",
                  $element_content: title.text
                });
                e.stopPropagation();
              }}>
              {title ? title.text : ""}
            </div>
            <Text
              className="subtitle"
              ellipsis
              onClick={() => {
                Sensor.go("clickBanner_App_Mob", {
                  banner_content: title ? title.subtitle : "",
                  banner_belong_area: "Select_ Sephora Picks_ Title",
                  banner_ranking: i + 1,
                  action_id: "1000001_017",
                  page_id: "MB_1000001",
                  $element_content: title.text
                });
              }}
            >
              {title ? title.subtitle : ""}
            </Text>
            {products.length > 0 ? (
              <div className="products">
                <div>{Session4.getProducts(products, i)}</div>
              </div>
            ) : (
              ""
            )}
          </div>
        </Card>
      );
    });
  }

  render() {
    return (
      <div
        ref={(ref) => {
          this.Session4Wrap = ref;
        }}
        className="Session4"
      >
        <Consumer>
          {({ scrollTop }) => {
            return scrollTop > 0 ? this.getCards() : "";
          }}
        </Consumer>
      </div>
    );
  }
}

export default Session4;
