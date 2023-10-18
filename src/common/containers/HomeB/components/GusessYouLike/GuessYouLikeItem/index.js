import React from "react";
import ProductItem from "./ProductItem";
import ForInOneAdItem from "./FourInOneAdItem";
import ImageAdItem from "./ImageAdItem";
import PostItem from "./PostItem";
import Sensor from "../../../../../Utils/sensor";

/**
 * @typedef {import('./ProductItem').GuessYouLikeProductItem} ProductItemInfo
 * @typedef {import('@/lib/services/Community').PostInfo} PostItemInfo
 * @typedef {{
 *  aggr:import('@/lib/services/Mpcms').ImageCommonDetail;
 *  aggrButton:import('@/lib/services/Mpcms').TextCommonDetail;
 * }} ImageItemInfo
 * @typedef {{
 *  aggr: import('@/lib/services/Mpcms').getHomeGuessYouLikeResponse['results']['aggr'];
 *  aggrButton: import('@/lib/services/Mpcms').getHomeGuessYouLikeResponse['results']['aggrButton'];
 * }} ForInOneAdItemInfo;
 * @typedef {ProductItemInfo | PostItemInfo | ImageItemInfo | ForInOneAdItemInfo} DataSourceType;
 */

export const ItemTypeEnums = {
  image: "image",
  product: "product",
  post: "post",
  fourinone: "fourinone",
};

/**
 * @typedef {{
 *  type:'image' | 'product' | 'post' | 'fourinone';
 *  index:number;
 *  dataSource:DataSourceType;
 *  onClick:() => void;
 * }} GuessYouLikeItemProps
 */

/**
 * @extends {React.Component<GuessYouLikeItemProps>}
 */
export default class GuessYouLikeItem extends React.Component {
  constructor(props) {
    super(props);
    this.getNode = this.getNode.bind(this);
  }

  getNode() {
    const { dataSource, type, index, onClick, pageType } = this.props;
    switch (type) {
      case "product":
        return <ProductItem info={dataSource} index={index} onClick={onClick} />;
      case "image":
        return (
          <ImageAdItem
            info={dataSource}
            index={index}
            onClick={() => {
              const { text, subtitle, trackingCode, link } = dataSource;
              Sensor.go("clickBanner_App_Mob", {
                banner_type: "campaign",
                banner_content: text + subtitle,
                banner_belong_area: pageType ? pageType + "_Selection" : "Selection",
                banner_to_url: link,
                banner_to_page_type: link,
                banner_ranking: index + 1,
                campaign_code: trackingCode,
              });
            }}
           />
        );
      case "post":
        return <PostItem info={dataSource} pageType={pageType} index={index} />;
      case "fourinone":
        return <ForInOneAdItem info={dataSource} pageType={pageType} index={index} onClick={() => {}} />;
      default:
        return <div />;
    }
  }

  render() {
    return this.getNode();
  }
}
