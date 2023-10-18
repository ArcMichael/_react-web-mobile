import React from "react";
import DefaultImg from "./DefaultImg";
import Sensor from "../../Utils/sensor";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";

const HistoryBrowsing = ({ obj }) => (
  <div className="history_browsing_cont">
    <a
      onClick={() => {
        Sensor.go("clickBanner_App_Mob", {
          $lib_detail: "M_Search##getSensorData##HistoryBrowing.js##7",
          banner_type: "search",
          banner_content: `${obj.brandEN}|${obj.productCN}|${obj.productId}`,
          banner_belong_area: "searchview",
          banner_to_url: `/product/${obj.productId}.html`,
          banner_to_page_type: `/product/${obj.productId}.html`,
          banner_ranking: "",
          belong_team: "Search",
          key_word_tpye: "ClickTerm",
          key_word_tpye_details: "History View",
        });
        GoogleAnalytics.pushV2({
          event: "search",
          // recommendContent: "",
          searchCategory: "历史浏览",
          cat55:"历史浏览",
          searchTerm: obj.productCN,
          kw55:obj.productCN,
        });
      }}
      href={`/product/${obj.productId}.html`}
    >
      <DefaultImg
        imgUrl={obj.imagePath ? obj.imagePath + "350x350.jpg" : ""}
        defaultimg="http://s1.sephorastatic.cn/wcsfrontend/products/nopic_150x150.jpg"
      />
      <h2 className="history_browsing_cont_hd">{obj.brandEN || ""}</h2>
      <p className="history_browsing_cont_des">{obj.productCN || ""}</p>
      {obj.discountDto ? (
        <div className="history_browsing_cont_price">
          {" "}
          <p>{obj.discountDto.price ? `￥${obj.discountDto.price}` : ""}</p>{" "}
          <p>{obj.discountDto.costPrice && `￥${obj.discountDto.costPrice}`}</p>
        </div>
      ) : null}
    </a>
  </div>
);
export default HistoryBrowsing;
