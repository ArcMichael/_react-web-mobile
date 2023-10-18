import React, { useEffect } from "react";
import { discountPrice } from "@/lib/BLL";
import { useDispatch } from "react-redux";
import { pushEmarsys } from "@/actions/commonVenders";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Sensor from "@/Utils/sensor/index";

interface IOtherBuy {}
const OtherBuy: React.FunctionComponent<IOtherBuy> = () => {
  const [dataSource, setDataSource] = React.useState<[]>([]);
  const dispatch = useDispatch();
  const getSensorData = (searchContent, searchlink, omniture, index, item) => {
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
  };
  const getEmss = () => {
    dispatch(
      pushEmarsys([
        "recommend",
        {
          logic: "PERSONAL_MOBILE_HOME",
          limit: 3,
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
              sc.page.products.forEach((item) => {
                item.newCostPrice = json[item.id].costPrice;
                item.newPrice = json[item.id].price;
              });
              setDataSource(sc.page.products);
            });
          },
        },
      ])
    );
  };
  useEffect(() => {
    getEmss();
  }, []);

  if (dataSource && dataSource.length >= 3) {
    return (
      <div className="recommend-order-bg">
        <div className="recommend-order-top">
          <div className="recommend-title">其他人还买了这些</div>
        </div>
        <ul className="recommend-list">
          {dataSource.map((item,index) => {
            return (
              <li
                onClick={() => {
                  window.location.href = `https://m.sephora.cn/product/${item.item}.html`;
                  getSensorData(
                    item.c_custom_0 + "|" + item.title + "|" + item.item,
                    `https://m.sephora.cn/product/${item.item}.html/?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`,
                    item.item,
                    index,
                    item
                  );
                }}
              >
                <img src={item.image} alt="" />
                <div className="shop-title">
                  {item.c_custom_0}
                  {item.title}
                </div>

                <span className="shop-price">
                  ￥{item.newPrice || item.price.toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

export default OtherBuy;
