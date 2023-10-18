import React from "react";
import { connect } from "react-redux";
import { pushEmarsys, emarsysGo } from "@/actions/commonVenders";
import Sensor from "@/Utils/sensor/index";
import { discountPrice } from "@/lib/BLL";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Image from "../ImagesLazyLoad/index";

class GuseeYouLike extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _guessYouLikeList: [],
    };
  }

  getSensorData(searchContent, searchlink, omniture, index, item) {
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_NewMobile##getSensorData##HomeGuessYouLike.js##19",
      banner_type: "product",
      banner_content: searchContent,
      banner_belong_area: "Guess U Like",
      banner_to_url: searchlink,
      banner_to_page_type: "Product-detail-page",
      banner_ranking: index + 1,
      belong_team: "Site Operation",
      campaign_code: searchlink || omniture,
      op_code: item.id,
      commodity_sku: item.c_custom_1,
      action_id: "1000001_019",
      page_id: "MB_1000001",
      banner_current_url: "home",
      banner_current_page_type: "home"

    });
    let listName = "guess u like > plp";
    if (listName) {
      GoogleAnalytics.pushV2({
        event: "guessYouLike",
        listName: listName,
        productId: "",
        productName: item.title,
        productOpCode: item.item,
      });
    }
    GoogleAnalytics.pushV2({
      event: "eeListClick",
      list: "guess what you like plp",
      products: [
        {
          brand: item.brand,
          id: "",
          name: item.title,
          position: index + 1,
          productOpCode: item.item,
        },
      ],
    });
  }
  componentDidMount() {
    const that = this;
    const { logic, listType, listTitle, emarsysGo } = this.props;
    console.log("asdasdsadasdas");
    this.props.pushEmarsys([
      "recommend",
      {
        logic: logic || "CART_MOBILE",
        limit: 20,
        containerId: "GuessYouLike",
        success: function (sc) {
          const param = [
            ...sc.page.products.map(({ id }) => {
              return id;
            }),
          ];
          const json = {};
          discountPrice(param, (data) => {
            const { results } = data;
            results.forEach((item) => {
              json[item.spuId] = item;
            });
            let proArr = [];
            sc.page.products.forEach((item) => {
              item.newCostPrice = json[item.id].costPrice;
              item.newPrice = json[item.id].price;
              let category = listTitle + item.category.replace(/>/g, ":");
              proArr.push({
                name: item.title, // Name or ID is required.
                id: item.item,
                brand: item.c_custom_0,
                list: listType,
                position: category,
              });
            });
            GoogleAnalytics.push({
              ecommerce: {
                impressions: proArr,
              },
            });
            that.setState({
              _guessYouLikeList: sc.page.products,
            });
          });
        },
      },
    ]);
    emarsysGo({ timeout: 2500 });
  }

  render() {
    const { _title } = this.props;
    const { _guessYouLikeList } = this.state;
    if (_guessYouLikeList && _guessYouLikeList.length == 0) {
      return <div />;
    }
    return (
      <div className="guess-you-like">
        <div className="guess-you-like-title">
          <span>{_title}</span>
        </div>
        <ul className="plpPage-products">
          {_guessYouLikeList.map((item, index) => (
            <a
              key={`guess-you-like-${index}`}
              className={`category_productmess`}
              href={`https://m.sephora.cn/product/${item.item}.html?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`}
              onClick={() =>
                this.getSensorData(
                  item.c_custom_0 + "|" + item.title + "|" + item.item,
                  `https://m.sephora.cn/product/${item.item}.html/?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`,
                  item.item,
                  index,
                  item
                )
              }
            >
              <Image
                title=""
                src={item.zoom_image
                  .replace("http://", "https://")
                  .replace("350x350", "280x280")}
                size={280}
                offset={0}
                className="product_img"
              />
              <div className="product_mess">
                <div className="head">
                  {item.c_custom_0}
                  {item.title}
                </div>
                <div className="price">
                  ￥{item.newPrice || item.price.toFixed(2)}
                </div>
                {item.newCostPrice && item.newPrice && (
                  <div className="delete">￥{item.newCostPrice}</div>
                )}
              </div>
            </a>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  pushEmarsys,
  emarsysGo,
})(GuseeYouLike);
