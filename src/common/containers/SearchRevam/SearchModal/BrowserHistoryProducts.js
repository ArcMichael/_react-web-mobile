import React from "react";
import { connect } from "react-redux";
import Product from "@/lib/services/Product";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import LazyloadImage from "@/components/LazyloadImage";
import { historybrows } from "@/actions/search";
import { GetSingleCookie } from "@/lib/Tools";
import PopupAlert from "@/components/PopupAlert";
import { popupAlert } from "@/actions/popup";
import { getCookie } from "@/Utils/utils/cookie";

/**
 * @typedef {import('@/lib/services/Product').HistoryBrowsingProduct} HistoryBrowsingProduct
 */

/**
 * @extends {React.Component}
 */
class BrowserHistoryProducts extends React.Component {
  state = {
    /** @type {HistoryBrowsingProduct[]} - description */
    products: [],
  };

  componentDidMount() {
    const productsString = GetSingleCookie(document.cookie, "allpPoductid");
    let productsArray = [];
    if (typeof productsString === "string" && productsString) {
      productsArray = productsString.split(",");
    }
    Product.Product.getHistoryBrowsingProducts(productsArray).then((res) => {
      if (res.status === 0 && Array.isArray(res.results)) {
        this.setState({
          products: res.results,
        });
      }
    });
  }

  /**
   * @param {HistoryBrowsingProduct} obj
   */
  HistoryBrowsing = (obj) => (
    <a
      key={obj.productId}
      className="history_browsing_cont"
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
          // recommendContent: obj.productCN,
          searchCategory: "历史浏览",
          cat55:"历史浏览",
          searchTerm: obj.productCN,
          kw55: obj.productCN,
        });
      }}
      href={`/product/${obj.productId}.html`}
    >
      <LazyloadImage
        imgProps={{
          src: obj.imagePath ? obj.imagePath + "350x350.jpg" : "",
        }}
        shape="square"
        loadingType="smalltype"
      />
      {/* <h2 className="history_browsing_cont_hd">{obj.brandEN || ""}</h2> */}
      {/* <p className="history_browsing_cont_des">{obj.productCN || ""}</p> */}
      {obj.discountDto ? (
        <div className="history_browsing_cont_price">
          <p>{obj.discountDto.price ? `￥${obj.discountDto.price}` : ""}</p>{" "}
          <p>{obj.discountDto.costPrice && `￥${obj.discountDto.costPrice}`}</p>
        </div>
      ) : null}
    </a>
  );
  clickDelete() {
    const { popupAlert } = this.props;
    popupAlert(1, "PopupCleaning", {
      _text: "是否清空浏览记录",
      _cancel: true,
      _btnWord: "确定",
      _callback: () => {
        // 清空历史浏览
        getCookie().then((cookie) => {
          const productidHistory = cookie("allpPoductid");
          if (productidHistory && productidHistory !== "false") {
            cookie("allpPoductid", "", { expires: 7, path: "/" });
            // this.props.historybrows();
            this.setState({ products: [] });
            popupAlert(0, "PopupCleaning");
          }
        });
      },
    });
  }
  render() {
    const { products } = this.state;
    return (
      <div
        className="history_browsing"
        style={products.length > 0 ? {} : { display: "none" }}
      >
        <div className="hot_top">
          <div className="ht_left">
            <span className="history_browsing_hd">历史浏览</span>
          </div>
          <div className="ht_right">
            <span className="ht_change" onClick={this.clickDelete.bind(this)} />
          </div>
        </div>
        <div className="history_browsing_flex">
          {products.map((item) => {
            return this.HistoryBrowsing(item);
          })}
        </div>
        <PopupAlert />
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  historybrows,
  popupAlert,
})(BrowserHistoryProducts);
