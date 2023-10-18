import React from "react";
import LazyloadImage from "@/components/LazyloadImage";
import Product from "@/containers/HomeB/components/Product";
import DataLink from "@/components/Atoms/DataLink";
import Sensor from "@/Utils/sensor/index";
import AdButton from "../components/AdButton";
import { getCdnImageUrl } from "@/components/CdnImage";

/**
 * @typedef {import('../index').ForInOneAdItemInfo}  ForInOneAdItemInfo
 */

/**
 * @typedef {{
 *  info:ForInOneAdItemInfo;
 *  onClick?:eact.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>['onClick'];
 *  index: number;
 * }} FourInOneAdItemProps
 */

/**
 * @extends {React.Component<FourInOneAdItemProps>}
 */
export default class FourInOneAdItem extends React.Component {
  render() {
    const { info, pageType, index } = this.props;
    const { aggr, aggrButton } = info || {};

    return (
      <div className="fourinone-item">
        <LazyloadImage
          imgProps={{
            src: getCdnImageUrl("/soa/nmobile/SPM-6253/imgs/guess-you-like-4in1.png"),
            className: "four-in-bg",
          }}
          loadingType="smalltype"
         />
        <div className="fourinone-item-product">
          {aggr &&
            Array.isArray(aggr.ads) &&
            aggr.ads.slice(0, 4).map((item, i) => {
              if (item.type === "image") {
                return (
                  <DataLink
                    _Sensor={{
                      eventKey: "clickBanner_App_Mob",
                      value: {
                        banner_type: "campaign",
                        banner_content: item.text,
                        banner_belong_area: pageType ? pageType + "_Selection" : "Selection",
                        banner_to_url: item.link,
                        banner_to_page_type: item.link,
                        banner_ranking: index + 1,
                        campaign_code: item.trackingCode,
                      },
                    }}
                    key={`${i}`}
                    _ClassName="fourinone-product-item"
                    _Href={item.link}
                    _Omniture={item.trackingCode}
                  >
                    <span className="product-image-wrap">
                      <LazyloadImage
                        imgProps={{
                          src: item.image,
                        }}
                        shape="square"
                        loadingType="smalltype"
                       />
                    </span>
                    <span className="product-title">{item.text}</span>
                  </DataLink>
                );
              }
              return (
                <Product
                  className="fourinone-product-item"
                  key={`${i}`}
                  href={item.link}
                  trackingCode={item.trackingCode}
                  title={`${item.name}`}
                  image={`${item.imagePath}210x210.jpg`}
                  showShadow
                  hiddenPrice
                  onClick={() => {
                    Sensor.go("clickBanner_App_Mob", {
                      banner_type: "campaign",
                      banner_content: item.brandNameEN + "|" + item.name + "|" + item.spuId,
                      banner_belong_area: pageType ? pageType + "_Selection" : "Selection",
                      banner_to_url: item.link,
                      banner_to_page_type: "Product-detail-page",
                      banner_ranking: index + 1,
                      campaign_code: item.trackingCode,
                    });
                  }}
                 />
              );
            })}
        </div>
        <p
          className="fourinone-item-text"
          style={{
            marginTop: aggrButton && aggrButton.text ? "0.24rem" : "0.58rem",
          }}
        >
          {aggr && aggr.text}
        </p>
        {aggrButton && aggrButton.text && (
          <div className="fourinone-item-btn">
            <AdButton
              text={aggrButton.text}
              onClick={() => {
                window.location.href = aggrButton.link;
              }}
             />
          </div>
        )}
      </div>
    );
  }
}
