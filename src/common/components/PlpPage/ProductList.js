import React, { Component } from "react";
import { connect } from "react-redux";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Sensor from "@/Utils/sensor";
import { bindActionCreators } from "redux";
import { judgeTypeOfPlp } from "@/lib/Tools";

import browserHistory from "@/store/browserHistory";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import ProductContent from "./ProductContent";
import { pushEmarsys } from "../../actions/commonVenders";
import SuspensionButton from "./SuspensionButton";
import {
  getPlpListData,
  startCustomerService,
  getMatchKey,
  getMatchAd,
} from "../../actions/plpPage";
import Image from "../ImagesLazyLoad/index";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 存放后来加载的数据
      page: 1, // 当前页
      isScroll: false, // 页面是否在滑动
      viewPortPage: 1, // 当前视口所在的页码
      rem: 50, // 当前页面1rem对应的px，滑动事件使用
      offsetTop: 0, // 商品模块距离顶端的距离，滑动事件使用
      newBannerFlag: false,
      num: 0,
    };

    this.scrollHandle = this.scrollHandle.bind(this);
    this.debounce = this.debounce.bind(this);
    this.addproduct = this.addproduct.bind(this);
    this.renderProductContent = this.renderProductContent.bind(this);
    this.sensorEvent = this.sensorEvent.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.clickBanner = this.clickBanner.bind(this);
    this.clickItems = this.clickItems.bind(this);
  }

  componentDidMount() {
    const { products, getMatchKey, getMatchAd } = this.props;
    let uid = GetSingleCookie2({ key: "UID" });
    if (uid) {
      if (products && products.rootNickName && products.secondNickName) {
        let rootNickName = products.rootNickName;
        let secondNickName = products.secondNickName;
        let thirdNickName = products.thirdNickName;
        if (thirdNickName == "") {
          this.props.pushEmarsys([
            "category",
            rootNickName + ">" + secondNickName,
          ]);
        } else {
          this.props.pushEmarsys([
            "category",
            rootNickName + ">" + secondNickName + ">" + thirdNickName,
          ]);
        }
      }
    } else {
      if (products && products.rootNickName && products.secondNickName) {
        let rootNickName = products.rootNickName;
        let secondNickName = products.secondNickName;
        let thirdNickName = products.thirdNickName;
        if (thirdNickName == "") {
          this.props.pushEmarsys([
            "category",
            rootNickName + ">" + secondNickName,
          ]);
        } else {
          this.props.pushEmarsys([
            "category",
            rootNickName + ">" + secondNickName + ">" + thirdNickName,
          ]);
        }
      }
    }
    window.document.addEventListener("scroll", this.scrollHandle);
    let rem = (document.body.clientWidth / 750) * 100;
    let plpProducts = document.getElementsByClassName("plpPage-products")[0];
    let offsetTop = plpProducts && plpProducts.offsetTop;
    let location = browserHistory.getCurrentLocation();
    let keyWords = location.query.k || "";
    this.setState({
      rem,
      offsetTop,
    });
    if (judgeTypeOfPlp() === "search") {
      getMatchKey({ k: keyWords }).then((res) => {
        //A/B 搜索跳转
        let abTest = "";
        var applyFlags = (flags) => {
          if (flags.get(res.results) == 1) {
            //res:试验变量名称； 0代表原始页面，1代表实验页面
            abTest = "B";
          } else if (flags.get(res.results) == 0) {
            abTest = "A";
          }
          getMatchAd({ text: keyWords, abTest }).then((res) => {
            if (res) {
              let adList = [];
              res.map((item) => {
                let obj = {},
                  arr = [];
                item.contentDetails.map((v) => {
                  if (v.type === "text") {
                    obj.subtitle =
                      v.subtitle && v.subtitle.length > 8
                        ? v.subtitle.slice(0, 8)
                        : v.subtitle;
                    obj.text =
                      v.text && v.text.length > 5 ? v.text.slice(0, 5) : v.text;
                  }
                  if (v.type === "image") {
                    obj.image = v.image;
                    obj.link = v.link;
                  }
                  if (v.type === "product") {
                    arr.push(v);
                  }
                });
                obj.sequence = item.sequence;
                obj.products = arr;
                obj.name = item.name;
                adList.push(obj);
              });
              let num = 0;
              adList.map((v) => {
                if (v.sequence < 20) {
                  num++;
                }
              });
              if (!adList || adList.length === 0) {
                this.setState({
                  newBannerFlag: true,
                });
              }
              this.setState({
                searchBanner: adList,
                num,
              });
            }
          });
        };

        if (typeof adhoc !== "undefined") {
          window.adhoc("getFlags", applyFlags);
        }
      });
    }
  }

  componentWillUnmount() {
    window.document.removeEventListener("scroll", this.scrollHandle);
  }

  debounce(fn) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      fn();
    }, 200);
  }

  scrollHandle() {
    // 页面滚动到底部时，使用pageChange函数获取下一页数据，存入state
    let { page, data, isScroll, viewPortPage, rem, offsetTop } = this.state;
    let dom = null;
    const that = this;
    let scrollTop = bodyScrollTop.get();
    let productScrollTop = scrollTop - offsetTop;
    // 商品列表的滚动距离除以一页的数据量*5.76(rem)/2,向上取整，则是当前页数
    let pageSize = this.props.products && this.props.products.pageSize;
    let viewPortPageNow = Math.ceil(
      (2 * productScrollTop) / (5.76 * rem * pageSize)
    );
    if (!isScroll) {
      this.setState({
        isScroll: true,
      });
    }
    if (viewPortPage !== viewPortPageNow && !Number.isNaN(viewPortPageNow)) {
      this.setState({
        viewPortPage: viewPortPageNow,
      });
    }

    if (scrollTop == 0) {
      // 顶部时快捷筛选不展示阴影
      let quickscreen = document.getElementsByClassName("quickscreen_head")[0],
        quickscreenTop = document.getElementsByClassName(
          "quickscreen_head top"
        )[0];
      if (quickscreenTop) return;
      if (quickscreen) quickscreen.className = "quickscreen_head top";
    } else if (
      (dom = document.getElementsByClassName("quickscreen_head top")[0])
    ) {
      // 快捷筛选展示阴影
      dom.className = "quickscreen_head";
      dom = null;
    }
    this.debounce(() => {
      // 获取dom元素属性，添加防抖
      // 加载下一页，给5的偏差
      if (
        Math.abs(
          document.documentElement.scrollHeight -
            scrollTop -
            document.documentElement.clientHeight
        ) < 100
      ) {
        that.pageChange(page + 1, (results) => {
          const { content } = results;
          let newData = [];
          newData = [...data, ...content];
          that.setState({
            page: page + 1,
            data: newData,
          });
          that.addproduct(results);
        });
      }
      if (this.state.isScroll === false) return;
      // 防抖执行时页面已停止滑动，右侧悬浮页码切换
      that.setState({
        isScroll: false,
      });
    });
  }

  addproduct(data) {
    // GA
    let { name } = this.props;
    let CategoryListconts = data;
    let impressions = [];
    if (CategoryListconts && CategoryListconts.content) {
      let href = window.location.pathname;
      let buttonPosition;
      if (
        /category/.test(href) ||
        /coupon_set/.test(href) ||
        /gift_set/.test(href) ||
        /exclusive_product/.test(href)
      ) {
        buttonPosition = "Navigation List";
      } else if (/search/.test(href) || /hot/.test(href)) {
        buttonPosition = "Search Results";
      } else if (/brand/.test(href)) {
        buttonPosition = "Brand  List";
      }
      impressions = CategoryListconts.content.map((el) => {
        return {
          name: el.productCN,
          id: el.productId,
          brand: el.brandEN,
          list: buttonPosition,
          position: name,
        };
      });
    }
    GoogleAnalytics.push({
      event: "productImpression",
      ecommerce: {
        impressions: impressions,
      },
    });
  }

  renderProductContent(data, applyAdver, minNumber) {
    let { name, products } = this.props;
    let { searchBanner, num } = this.state;
    let $this = this;
    let rootCategoryName = products && products.rootCategoryName;
    let pros = [];
    if (data && data.length) {
      pros = data.map((el, index) => {
        // console.log(el.productAdvertisementDtos);
        if (el.productAdvertisementDtos || el.productListDtos) {
          // 搜索数据处理
          let productArrs = [],
            productadverArrs = [];
          productArrs = el.productListDtos.map((pro, ind) => (
            <ProductContent
              data={pro}
              key={`${pro.productId}-${ind}`}
              name={name}
              index={index}
            />
          ));
          if (applyAdver) {
            if (searchBanner && searchBanner.length > 0) {
              return [...productArrs];
            } else {
              productadverArrs = el.productAdvertisementDtos.map(
                (adver, ind) => {
                  return (
                    <a
                      className="search_product_adver"
                      href={adver.link ? adver.link : "javascript:;"}
                      onClick={this.sensorEvent.bind(this, adver, index)}
                      key={`search_product_adver-${ind}`}
                    >
                      {adver.imagePath ? <Image src={adver.imagePath} /> : ""}
                    </a>
                  );
                }
              );
              return [...productArrs, ...productadverArrs];
            }
          }
        } else {
          return (
            <ProductContent
              rootCategoryName={rootCategoryName}
              data={el}
              key={`${el.productId}-${index}`}
              name={name}
              index={index}
            />
          );
        }
      });

      if (searchBanner && searchBanner.length > 0) {
        pros = [
          ...pros.reduce(function (a, b) {
            return a.concat(b);
          }),
        ];
        let adList;
        searchBanner.map((item, index) => {
          adList = (
            <span
              className="search-result-banner"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "100%",
                backgroundPosition: "center",
              }}
              key={`search-result-banner_${index}`}
              onClick={this.clickBanner.bind(this, item.link, item.name)}
            >
              <div className="search-left">
                <p className="main-title">{item && item.text}</p>
                <p className="sub-title">{item && item.subtitle}</p>
                <a
                  href={item && item.link ? item.link : "javascript:voild(0);"}
                >
                  {item && item.text && item.subtitle && (
                    <div className="detail-link" />
                  )}
                </a>
              </div>
              <div className="search-right">
                {item &&
                  item.products &&
                  item.products.length >= 3 &&
                  item.products.slice(0, 3).map((v, i) => {
                    return (
                      <div
                        key={`search-items_${i}`}
                        className="search-items"
                        onClick={() => {
                          $this.clickItems(v.link);
                        }}
                      >
                        <img
                          className="search-pic"
                          src={`${v.imagePath}120x120.jpg`}
                        />
                        <p
                          className="search-price"
                          dangerouslySetInnerHTML={{
                            __html: decodeURIComponent(
                              v.priceTxt.indexOf("~") > -1
                                ? v.priceTxt.replace("~", "~\n")
                                : v.priceTxt
                            ),
                          }}
                         />
                      </div>
                    );
                  })}
              </div>
            </span>
          );
          let overL = item.sequence - minNumber;
          if (overL !== 0 && item.sequence !== 0 && minNumber === 0) {
            if (overL > pros.length || item.sequence <= minNumber) return;
          }
          if (minNumber === 20) {
            if (overL > pros.length || item.sequence <= minNumber) return;
          }
          let sequence = item.sequence - minNumber;
          if (minNumber >= 20) {
            sequence = sequence - num;
          }

          if (sequence % 2 == 0) {
            pros.splice(sequence + index, 0, adList);
          } else {
            pros.splice(sequence + index + 1, 0, adList);
          }
        });
      }
      return pros;
    } else {
      return null;
    }
  }

  sensorEvent(content, index) {
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_productList##sensorEvent##Categoryproducts.js##317",
      banner_type: "campaign",
      banner_content: content.content || null,
      banner_belong_area: "Search_Banner",
      banner_to_url: content.link,
      banner_ranking: index + 1,
    });
  }
  pageChange(page, callback) {
    // 由ProductList调用以获取页面其他页码数据，再传入ProductList处理
    const { getPlpListData, products, url } = this.props;
    if (!products) return;
    if (page > products.totalPages) return;
    let params = {};
    params.type = "GET";
    params.onlyKey = "brandList";
    params.url = url.replace(/pageNum=.*?&/g, `pageNum=${page}&`);
    getPlpListData(params).then((results) => {
      callback && callback(results);
    });
  }
  clickItems(link) {
    window.location.href = link;
  }
  clickBanner(link, name) {
    Sensor.go("clickBanner_App_Mob", {
      banner_content: name,
      banner_current_page_type: "List-page",
      banner_belong_area: "Search_Banner",
      banner_type: "search",
      banner_to_url: null,
      banner_to_page_type: "Campaign-page",
      belong_team: "Search",
      banner_ranking: "",
    });
    if (link) {
      window.location.href = link;
    }
  }
  render() {
    const { products, startCustomerService } = this.props;
    const { data, isScroll, viewPortPage, searchBanner, newBannerFlag } =
      this.state;
    return products ? (
      <div className="plpPage-container">
        {judgeTypeOfPlp() === "search" ? (
          <div className="plpPage-products">
            {(searchBanner || newBannerFlag) &&
              this.renderProductContent(products.content, true, 0)}
            {(searchBanner || newBannerFlag) &&
              this.renderProductContent(data, true, 20)}
          </div>
        ) : (
          <div className="plpPage-products">
            {this.renderProductContent(products.content, true, 0)}
            {this.renderProductContent(data, true, 20)}
          </div>
        )}
        {products && (
          <SuspensionButton
            totalPage={products.totalPages}
            viewPortPage={viewPortPage}
            isScroll={isScroll}
            QCPTQ={this.props.cart.QCPTQ}
            startCustomerService={startCustomerService}
          />
        )}
      </div>
    ) : null;
  }
}

const mapStateToProps = (s) => ({
  products: s.plpPage.products,
  cart: s.cart,
});
const mapDispatchToProps = (dispatch) => ({
  pushEmarsys,
  getPlpListData: bindActionCreators(getPlpListData, dispatch),
  startCustomerService: bindActionCreators(startCustomerService, dispatch),
  getMatchKey: bindActionCreators(getMatchKey, dispatch),
  getMatchAd: bindActionCreators(getMatchAd, dispatch),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
