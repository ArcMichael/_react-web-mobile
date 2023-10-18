import React from "react";
import { connect } from "react-redux";
import Image from "../../ImagesLazyLoad/index";
import { pushEmarsys } from "../../../actions/commonVenders";
import Sensor from "../../../Utils/sensor/index";
import { discountPrice } from "../../../lib/BLL";
import GoogleAnalytics from "../../../Utils/GoogleAnalytics";
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
    });
    let pathname = window.location.pathname;
    let listNameList = {
      "/myAccount": "guess u like > my_account",
    };
    let listName = listNameList[pathname];
    if (listName) {
      GoogleAnalytics.pushV2({
        event: "guessYouLike",
        listName: listName,
        productId: item.id,
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
          id: item.id,
          name: item.title,
          position: index + 1,
          productOpCode: item.item,
        },
      ],
    });
  }
  componentDidMount() {
    const that = this;
    const { logic } = this.props;

    this.props.pushEmarsys([
      "recommend",
      {
        logic: logic || "CART_MOBILE",
        limit: 18,
        containerId: "GuessYouLike",
        success: function (sc, ) {
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
            sc.page.products.forEach((item) => {
              item.newCostPrice = json[item.id].costPrice;
              item.newPrice = json[item.id].price;
            });
            that.setState({
              _guessYouLikeList: sc.page.products,
            });
          });
        },
      },
    ]);
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
          <em />
          <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/xinxing.png" />
          <span>{_title}</span>
          <em />
        </div>
        <ul className="guess-you-like-product">
          {_guessYouLikeList.map((item, index) => (
            <a
              key={`guess-you-like-${index}`}
              className={`guess-you-like-normal ${
                index % 2 === 0 && "guess-you-like-right-border"
              }`}
              href={`https://m.sephora.cn/product/${item.item}.html?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`}
              onClick={() =>
                this.getSensorData(
                  item.c_custom_0 + "|" + item.title + "|" + item.item,
                  `https://m.sephora.cn/product/${item.item}.html/?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`,
                  item.item,
                  index,
                  item,
                )
              }
            >
              <Image
                title=""
                src={item.zoom_image.replace("http://", "https://").replace("350x350", "280x280")}
                size={280}
                offset={0}
              />
              {/* <img src={item.zoom_image.replace('http://', 'https://').replace('350x350', ((index + 1) % 5 == 1)?'350x350':'320x320')} alt={item.title} /> */}
              <div className="guess-you-like-product-con">
                <p className="guess-you-like-product-en">{item.c_custom_0}</p>
                <p className="guess-you-like-product-name">{item.title}</p>
                {item.newPrice ? (
                  <div className="guess-you-like-product-prices">
                    {item.newPrice ? (
                      <p className="product">
                        <label>¥</label>
                        {item.newPrice}
                      </p>
                    ) : (
                      <p />
                    )}
                    {item.newCostPrice ? (
                      <p className="product2">
                        <label>¥</label>
                        {item.newCostPrice}
                      </p>
                    ) : (
                      <p />
                    )}
                  </div>
                ) : (
                  <p className="guess-you-like-product-price">
                    <label>¥</label>
                    {item.price && item.price.toFixed(2)}
                  </p>
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
})(GuseeYouLike);
