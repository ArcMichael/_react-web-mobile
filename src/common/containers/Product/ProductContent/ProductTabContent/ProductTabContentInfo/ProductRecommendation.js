/*
 * @Author: Leo.Si
 * @Date: 2020-07-23 10:52:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-24 17:05:46
 * @function 展示product page 搭配推荐信息
 */
import React from "react";
import $ from "jquery";
import Image from "@/components/ImagesLazyLoad/index";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";

class ProductRecommendation extends React.Component {
  constructor(props) {
    super(props);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.state = {
      recommendCount: 0,
    };
  }
  componentDidMount() {
    const { _recommend } = this.props;
    this.setState({
      recommendCount: _recommend.recommendProductDtoList.length,
    });
  }
  touchEnd() {}
  touchStart(e) {
    // document.querySelector('.product-info-recommend-list').classList.add('product-info-recommend-list-hover');
    let state = this.state;
    state["sx"] = e.changedTouches[0].clientX;
    state["sy"] = e.changedTouches[0].clientY;
  }

  touchMove(e) {
    const { recommendCount } = this.state;
    if (recommendCount < 4) return;
    if (e.targetTouches.length > 1 || (e.scale && e.scale !== 1)) {
      return;
    }
    // $('.productsDetailsPage').css('overflow-y','hidden');
    let state = this.state;
    state["ex"] = e.changedTouches[0].clientX;
    state["ey"] = e.changedTouches[0].clientY;
    state["endPos"] = {
      x: state["ex"] - state["sx"],
      y: state["ey"] - state["sy"],
    };
    state["isScrolling"] =
      Math.abs(state["endPos"].x) < Math.abs(state["endPos"].y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
    if (state["isScrolling"] === 0) {
      e.stopPropagation();
      //e.preventDefault();//阻止触摸事件的默认行为，即阻止滚屏
    }
    let left = state["endPos"].x;
    const ulWidth = $(".product-info-recommend-list").outerWidth();
    const liWidth =
      $(".product-info-recommend-list-0").outerWidth() * recommendCount;
    const recommendPadding = parseFloat(
      $(".product-info-recommend").css("padding-left")
    );
    left < 0 && (left = ulWidth - liWidth - recommendPadding);
    left > 0 && (left = 0);
    $(".product-info-recommend-list").css(
      "transform",
      `translate3d(${left}px, 0px, 0px)`
    );
    // e.stopPropagation();
    // $('.productsDetailsPage').css('overflow-y','scroll');
  }
  goToPDP(recommend_id) {
    let href = `/product/${recommend_id}.html`;
    window.location.href = href;
    Sensor.go("clickBanner_App_Mob", {
      banner_type: "tag",
      banner_content: "推荐搭配",
      banner_belong_area: "",
      banner_to_url: href,
      banner_to_page_type: "product-detail-page",
      banner_ranking: "",
      belong_team: "",
    });
    GoogleAnalytics.pushV2({
      event: "productDetailInteraction",
      // pdpInteractionDetail: "搭配推荐",
      pdpInteractionType: "搭配推荐",
    });
  }
  render() {
    const { _recommend } = this.props;
    const { recommendCount } = this.state;
    let cantSlide = false;
    if (recommendCount > 3) {
      cantSlide = true;
    }
    return (
      <div
        className="product-info-recommend"
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
      >
        <p className="product-info-recommend-line" />
        <p className="product-info-recommend-title">搭配推荐</p>
        <ul
          className={`product-info-recommend-list ${
            cantSlide ? "cantslide" : ""
          }`}
        >
          {_recommend.recommendProductDtoList &&
            _recommend.recommendProductDtoList.length > 0 &&
            _recommend.recommendProductDtoList.map((item, index) => {
              const {
                brandNameEN,
                recommendImagePath,
                productNameCN,
                recommend_id,
                maxPrice,
                minPrice,
              } = item;
              return (
                <li
                  key={`product-info-recommend-list-${index}`}
                  className={`product-info-recommend-list-${index}`}
                >
                  <a onClick={() => this.goToPDP(recommend_id)}>
                    <div>
                      <Image
                        src={`${recommendImagePath}150x150.jpg`}
                        size="150"
                        offset={0}
                      />
                      <span>{brandNameEN}</span>
                      <span>{productNameCN}</span>
                      <span>
                        {maxPrice === minPrice
                          ? `￥${minPrice}`
                          : `￥${minPrice}~￥${maxPrice}`}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

// const ProductRecommendation = ({
//     _recommend
// }) => !!_recommend && <div className='product-info-recommend' onTouchEnd={(e) => { e.stopPropagation(); }}>
//     <p className='product-info-recommend-title'>搭配推荐</p>
//     <ul className='product-info-recommend-list'>
//         {
//             _recommend.recommendProductDtoList &&
//             _recommend.recommendProductDtoList.length > 0 &&
//             _recommend.recommendProductDtoList.map((item, index) => {
//                 const { brandNameEN, recommendImagePath, productNameCN, recommend_id, maxPrice, minPrice } = item
//                 return <li key={`product-info-recommend-list-${index}`}>
//                     <a href={`/product/${recommend_id}.html`} >
//                         <div>
//                             <Image src={`${recommendImagePath}150x150.jpg`} size='150' offset={0} />
//                             <span>{brandNameEN}</span>
//                             <span>{productNameCN}</span>
//                             <span>{maxPrice === minPrice ? `￥${minPrice}` : `￥${minPrice}~￥${maxPrice}`}</span>
//                         </div>
//                     </a>
//                 </li>
//             })
//         }
//     </ul>
// </div>

export default ProductRecommendation;
