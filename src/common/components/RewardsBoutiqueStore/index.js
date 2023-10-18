/*
 * @Author: Martin.song
 * @LastEditors: fancy.chen
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-09-29 16:50:05
 * @LastEditTime: 2021-08-31 16:02:05
 */
import React from "react";
import { connect } from "react-redux";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import SliderBanner from "./home/Banner/SliderBanner";
import { popupAlert } from "../../actions/popup";
import DonateBanner from "./home/Banner/DonateBanner";
import StoreTitle from "./home/StoreTitle/index";
import CouponsList from "./home/CouponsList/index";
import GiftCardList from "./home/GiftCardList/index";
import * as device from "../../lib/device";
import { changeRule } from "../../actions/rewardsBoutique";
import { server, getParms, setParms, getTokenByCookie } from "./util";
import { DelSingleCookie2 } from "../../lib/Tools";
import PopupAlert from "../PopupAlert/index";
import RuleModal from "./home/RuleModal";
import Donation from "./home/Donation/donation";
import { MpToH5 } from "../../lib/MPTools";
import { setupWeChat } from "../../Utils/wechat";

// 获得banner条
const getBannnerurl = "/v1/rewards-boutique/platfrom/banner";

// 获取会员可用积分
const getViperIntegralAllurl = "/v1/rewards-boutique/viper/integralAll";

// 获取会员可用积分
const getCouponsListurl = "/v1/rewards-boutique/coupons/list";
// 获取捐助记录列表查询
const exchangeListurl =
  "/v1/rewards-boutique/exchange-record/list?couponType=4&status=2";
const getUserHomepageInfourl = "/v1/portal/card/base/info";

class RewardsBoutiqueStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frozen: false,
      resultdata: null,
      brandTitle: null,
      optional: [],
      pageNum: 1,
      pageSize: 50,
      celling: 500,
      floor: 500,
      loadingMore: false,
      dataContent: [[], [], [], []],
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.exchangeGitfCard = this.exchangeGitfCard.bind(this);
  }

  getTop(e) {
    let T = e.offsetTop;
    while ((e = e.offsetParent)) {
      T += e.offsetTop;
    }
    return T;
  }

  changeTab() {
    const navagat = document.querySelectorAll(".navagat_Tab");
    const H = document.documentElement.clientHeight; // 获取可视区域高度
    const S = bodyScrollTop.get();
    const visibleTop = window.scrollY;
    const pretab = document.querySelectorAll(".currentnavigationRow");
    for (let i = 0; i < navagat.length; i++) {
      if (H + S > this.getTop(navagat[i])) {
        const topHeigth = navagat[0].offsetTop;
        const centerY = navagat[i].offsetTop;
        if (
          visibleTop + topHeigth < centerY + navagat[i].offsetHeight &&
          visibleTop + topHeigth > centerY
        ) {
          const tabs = document.querySelectorAll(".navigationRow");
          if (i >= 1) {
            pretab[0] && pretab[0].classList.remove("currentnavigationRow");
            tabs[i]
              .querySelectorAll("a")[0]
              .classList.add("currentnavigationRow");
          } else if (
            pretab[0] &&
            pretab[0] !== tabs[i].querySelectorAll("a")[0]
          ) {
            pretab[0] && pretab[0].classList.remove("currentnavigationRow");
            tabs[i]
              .querySelectorAll("a")[0]
              .classList.add("currentnavigationRow");
          }
        }
      }
    }
  }

  // 滚屏控制吸顶
  handleScroll() {
    this.changeTab();

    const { frozen } = this.state;
    const offset =
      this.refs.SliderBanner && this.refs.SliderBanner.offsetHeight + 63;
    // console.log(tabdom);
    if (window.pageYOffset - offset >= 0) {
      this.setState({
        frozen: true,
      });
    }
    if (frozen) {
      if (window.pageYOffset - offset < 0) {
        this.setState({
          frozen: false,
        });
      }
    }
  }

  parseDatar = (data) => {
    switch (data.type) {
      case "Integral":
        return { Integral: data.results };
        break;
      case "banner":
        return { banner: data.results };
        break;
      case "couponsList":
        return { couponsList: data.results };
        break;
      case "exchangeList":
        return { exchangeList: this.getGiftCard(data.results.content) };
        break;
    }
  };

  // 丝享卡过滤，只有item的status是2 的才是丝享卡
  getGiftCard(results) {
    if (results && results.length > 0) {
      return results.filter((item) => item.status === 2);
    }
  }

  getAllData = () => {
    const cardNo = getParms("cardNo");
    const storeNo = getParms("store");
    const { brandId } = this.props;

    if (storeNo) {
      setParms({ key: "storeNo", value: storeNo });
    } else {
      DelSingleCookie2({ key: "storeNo" });
    }

    const banner = server(
      "banner",
      brandId ? getBannnerurl + `/${brandId}` : getBannnerurl
    );
    const Integral = server(
      "Integral",
      getViperIntegralAllurl +
        `?cardNo=${cardNo}` +
        (brandId ? `&brandId=${brandId}` : "")
    );
    if (brandId === null) {
      const exchangeList = server("exchangeList", exchangeListurl);
      exchangeList.then((value) => {
        let resultdata = Object.assign({}, this.parseDatar(value));
        this.setState(resultdata);
      });
    }

    Integral.then((value) => {
      let resultdata = Object.assign({}, this.parseDatar(value));
      this.setState(resultdata);
      if (resultdata && resultdata.Integral && resultdata.Integral.brandName) {
        // document.title = `${resultdata.Integral.brandName}积分商城`
        this.setState({ brandName: resultdata.Integral.brandName });
      }
    });

    banner.then((value) => {
      let resultdata = Object.assign({}, this.parseDatar(value));
      this.setState(resultdata);
    });
    this.getCouponsList();
  };
  getCouponsList = (tabs) => {
    const { pageSize, pageNum, celling, floor } = this.state;
    const cardNo = getParms("cardNo");
    const storeNo = getParms("store");
    const { brandId } = this.props;
    const param_celling = tabs ? tabs : celling;
    const param_floor = tabs ? tabs : floor;
    if (brandId) {
      const couponsList = server(
        "couponsList",
        getCouponsListurl +
          `?cardNo=${cardNo}` +
          `&storeNo=${storeNo}` +
          `&pageNum=${pageNum}` +
          `&pageSize=${pageSize}` +
          (brandId ? `&brandId=${brandId}` : "")
      );
      couponsList.then((value) => {
        let resultdata = Object.assign({}, this.parseDatar(value));
        console.log(
          "resultdata==>",
          resultdata,
          pageNum,
          resultdata.couponsList.page.pageNum
        );
        if (!this.state.couponsList) {
          this.setState(resultdata);
        }
        if (resultdata.couponsList.content.length > 0) {
          resultdata.couponsList.content.forEach((item, index) => {
            // console.log(item)
            if (item.length > 0) {
              console.log("item==>", item);
              if (
                this.state.couponsList.content[index].length > 0 &&
                pageNum !== 1
              ) {
                const data = this.state.couponsList.content[index].concat(item);
                this.state.couponsList.content[index] = data;
                console.log(this.state.couponsList.content[index]);
              } else {
                this.state.couponsList.content[index] = item;
              }
            }
          });
        }

        if (
          resultdata.couponsList.page.totalPage >
          resultdata.couponsList.page.pageNum
        ) {
          console.log("继续加载");
          this.setState({ pageNum: pageNum + 1 });
          this.getCouponsList();
        }
      });
    } else {
      const couponsList = server(
        "couponsList",
        getCouponsListurl +
          `?cardNo=${cardNo}` +
          `&storeNo=${storeNo}` +
          `&pageNum=${pageNum}` +
          `&celling=${param_celling}` +
          `&floor=${param_floor}` +
          `&pageSize=${pageSize}` +
          (brandId ? `&brandId=${brandId}` : "")
      );
      couponsList.then((value) => {
        let resultdata = Object.assign({}, this.parseDatar(value));
        console.log(
          "resultdata==>",
          resultdata,
          pageNum,
          resultdata.couponsList.page.pageNum
        );
        if (!this.state.couponsList) {
          this.setState(resultdata);
        }
        if (resultdata.couponsList.content.length > 0) {
          resultdata.couponsList.content.forEach((item, index) => {
            // console.log(item)
            if (item.length > 0) {
              console.log("item==>", item);
              if (
                this.state.couponsList.content[index].length > 0 &&
                pageNum !== 1
              ) {
                const data = this.state.couponsList.content[index].concat(item);
                this.state.couponsList.content[index] = data;
                console.log(this.state.couponsList.content[index]);
              } else {
                this.state.couponsList.content[index] = item;
              }
            }
          });
        }

        console.log("更新后==》", this.state.couponsList.content);
        if (
          resultdata.couponsList.page.totalPage ==
          resultdata.couponsList.page.pageNum
        ) {
          const optional = resultdata.couponsList.optional;
          this.setState({ optional: optional });
          optional.forEach((h, index) => {
            // console.log(h)
            if (celling === h && celling < 12000) {
              // console.log(index);
              // console.log(optional.length);
              this.setState({
                celling: optional[index + 1],
                floor: optional[index + 1],
                pageNum: 1,
              });
              this.getCouponsList();
            }
          });
        }
        if (
          resultdata.couponsList.page.totalPage >
          resultdata.couponsList.page.pageNum
        ) {
          console.log("继续加载");
          this.setState({ pageNum: pageNum + 1 });
          this.getCouponsList();
        }
      });
    }
  };

  // 丝享卡兑换-转跳小程序
  exchangeGitfCard(item) {
    // 首页领取思想卡
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/sp/mem/jump-mini?pageType=continue-redeem&eGiftSecret=${item.egiftSecret}`,
      });
    } else {
      // app跳丝享卡
      window.location.href = `/v2/html/exchangeReceiveSuccess/${item.egiftSecret}`;
    }
  }

  getDate = () => {
    const cardNo = getParms("cardNo");
    const storeNo = getParms("store");
    const token = getParms("Token");
    // 在微信端的情况下，如果拿到了token 则把token存入到微信webview的cookie中
    if (!getTokenByCookie() && device.device_inMiniProgramsEnvironment()) {
      setParms({ key: "Token", value: token });
    }
    this.setState({
      cardNo,
      storeNo,
    });
    const getUserHomepageInfo = server(
      "getUserHomepageInfo",
      getUserHomepageInfourl,
      {
        headers: {
          channel: "MOBILE",
        },
      }
    );
    getUserHomepageInfo.then((value) => {
      const { jQueryStatus } = value;
      if (jQueryStatus.status === 401) {
        if (device.device_inMiniProgramsEnvironment()) {
          MpToH5 && MpToH5();
        }
        window.location.href = `/login?historyLocation=${encodeURIComponent(
          window.location.pathname.replace("/", "").replace("?", "&")
        )}${window.location.search.replace("?", "&")}`;
      }
      let via = "";
      if ((via = value.results) && (via = via.cardNo)) {
        setParms({ key: "cardNo", value: via });
        this.getAllData();
      }
    });
  };

  componentDidMount() {
    const {
      resultdata,
      brandTitle,
      optional,
      loadingMore,
      dataContent,
      brandName,
    } = this.state; // TODO: 请移除无用state
    console.log(
      resultdata,
      brandTitle,
      optional,
      loadingMore,
      dataContent,
      brandName
    );
    setTimeout(() => {
      // 兼容ios页面回退时页面空白，需要手动滚动恢复
      if (document.documentElement) {
        document.documentElement.scrollTop = 2;
        // console.log(document.documentElement.scrollTop,'document.documentElement.scrollTop');
      } else if (document.body) {
        bodyScrollTop.set(2);
      } else {
        window.scrollTo(0, 2);
        // console.log(2,'scrollTo');
      }
      // window.scrollTo(0,300);
      // console.log(300,'scrollTo');
    }, 500);
    if (device.device_inMiniProgramsEnvironment()) {
      // 微信环境下清空上次的缓存
      DelSingleCookie2({ key: "Token" });
      DelSingleCookie2({ key: "cardNo" });
      DelSingleCookie2({ key: "storeNo" });
      DelSingleCookie2({ key: "store" });
      /**
       * 加载微信的sdk
       */
      setupWeChat({});

      document.title = "会员积分商城";
    }
    this.getDate();
    if (window.location.pathname.indexOf("/v2/html/rewardsBrand") < 0) {
      window.addEventListener("scroll", this.handleScroll, false);
    }
  }

  render() {
    const {
      Integral,
      couponsList,
      banner,
      exchangeList,
      cardNo,
      storeNo,
      frozen,
    } = this.state;
    const { changeRule, ruleShow, brandId } = this.props;
    const style = ruleShow === true ? { height: "100%" } : {};
    return (
      <div className="container clear" style={style}>
        {ruleShow && brandId === null && <RuleModal changeRule={changeRule} />}
        <div id="apptitle"> 会员积分商城</div>
        <div
          className={frozen ? "topContainerFix topContainer" : "topContainer"}
          ref="topContainer"
        >
          {frozen && <Donation isTop />}

          <StoreTitle
            changeRule={changeRule}
            {...Integral}
            brandId={brandId}
            cardNo={cardNo}
            storeNo={storeNo}
            frozen={frozen}
          />
        </div>
        <div
          className="sliderContainer"
          ref="SliderBanner"
          onScroll={this.handleScroll}
        >
          <SliderBanner {...banner} brandId={brandId} />
        </div>
        {/* 积分捐赠入口 */}
        {/*品牌积分隐藏积分捐赠入口*/}
        {!brandId && <Donation />}
        <CouponsList
          {...couponsList}
          brandId={brandId}
          cardNo={cardNo}
          storeNo={storeNo}
          frozen={frozen}
        />
        {brandId === null ? (
          <DonateBanner {...banner} cardNo={cardNo} storeNo={storeNo} />
        ) : null}
        {brandId === null ? (
          <div className="GiftCardContainer">
            {exchangeList && exchangeList.length > 0 && (
              <GiftCardList
                GiftCardList={exchangeList}
                exchangeGitfCard={this.exchangeGitfCard}
              />
            )}
          </div>
        ) : null}

        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ruleShow: state.rewards.ruleShow,
  };
};
export default connect(mapStateToProps, { popupAlert, changeRule })(
  RewardsBoutiqueStore
);
