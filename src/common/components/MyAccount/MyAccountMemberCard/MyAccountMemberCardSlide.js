/*
 * @Author: Leo.Si
 * @Date: 2019-08-19 19:14:43
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Th 10:34:20
 * @function 会员权益页面 会员卡滑动效果
 */
import React from "react";
import { connect } from "react-redux";
import Swiper from "swiper";
import MyAccountMemberCardEquity from "./MyAccountMemberCardEquity";
import Sensor from "../../../Utils/sensor";
import { popupAlert } from "../../../actions/popup";
import PopupAlert from "../../PopupAlert/index";
import Image from "../../ImagesLazyLoad/index";

class MyAccountMemberCardSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowIndex: 0,
      direction: "",
    };
  }

  componentDidMount() {
    const { direction } = this.state; // TODO: 请移除无用state
    console.log(direction);
    this.setState({
      nowIndex: this.props._data.currentIndex
        ? this.props._data.currentIndex
        : 0,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      (nextProps._data && nextProps._data.currentIndex) !==
        (this.props._data && this.props._data.currentIndex) &&
      nextProps._data.currentIndex
    ) {
      this.setState({
        nowIndex: nextProps._data.currentIndex,
        direction: "right",
      });
    }
    const t = this;
    if (!this.state.mySwiper) {
      new Swiper(".swiper-container", {
        slidesPerView: "auto",
        initialSlide: nextProps._data.currentIndex,
        spaceBetween: 25,
        autoplay: false,
        centeredSlides: true, // 选中居中
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        on: {
          slideChange() {
            t.setState({
              nowIndex: this.activeIndex,
            });
            try {
              Sensor.go("myAccountClick", {
                $lib_detail:
                  "M_NewMobile##getSensorData##MyAccountMemberCardSlide.js##46",
                button_name: ["粉卡", "白卡", "黑卡", "金卡"][this.activeIndex],
              });
            } catch (err) {
              console.log("error-sensor");
            }
          },
        },
      });
    }
  }

  callback(data, index) {
    const { popupAlert } = this.props;
    let equityStatus = index <= data.belong[this.props._data.currentIndex];
    let catStatus = index <= data.belong[this.state.nowIndex];
    if (this.props._data.currentIndex < this.state.nowIndex) {
      if (!equityStatus) catStatus = false;
    }
    if (data.text === "精美生日礼" || data.text === "生日月双倍积分") {
      if (!this.props._results.birthday && data.text === "生日月双倍积分") {
        data.linkUrl = "/myAccount/profile.html";
        data.CTAText = "补全生日信息";
      }
      switch (this.props._data.cardList[this.state.nowIndex].cardType) {
        case "BLACK":
          data.linkUrl =
            "https://m.sephora.cn/campaign/crm/Black_birthdayOffer/Black_birthdayOffermb20200714.html";
          break;
        case "GOLDEN":
          data.linkUrl =
            "https://m.sephora.cn/campaign/crm/Gold_birthdayOffer/Gold_birthdayOffermb20200714.html";
          break;
      }
      if (this.props._data.currentIndex < this.state.nowIndex) {
        equityStatus = false;
        catStatus = false;
      }
    }
    popupAlert(1, "PopupMemberEquity", {
      _index: index,
      _equityStatus: equityStatus,
      _catStatus: catStatus,
      _titleImg: data.imageUrl,
      _title: data.text,
      _text:
        typeof data.content === "object"
          ? data.content[
              `${this.props._data.cardList[this.state.nowIndex].cardType}`
            ]
          : data.content,
      _confirmText: data.CTAText,
      _closeCallback: () =>
        (window.location.href = data.linkUrl ? data.linkUrl : ""),
    });
  }

  render() {
    const { _data } = this.props;
    const { nowIndex } = this.state;
    const slide =
      _data &&
      _data.cardList &&
      _data.cardList.length > 0 &&
      _data.cardList.map((item, index) => {
        const { cardImageUrl, cardText } = item;
        return (
          <div
            key={`MyAccountMemberCardSlide-${index}`}
            className={`${
              index === nowIndex ? "active_li swiper-slide" : "swiper-slide"
            }`}
          >
            {/* 增加懒加载 */}
            <Image
              src={cardImageUrl}
              className={`${index === nowIndex ? "active_img" : ""}`}
            />
            {/* <img src={cardImageUrl} className={`${index === nowIndex ? "active_img" : ""}`} /> */}
            <span>{cardText}</span>
          </div>
        );
      });
    return (
      <div className="myAccount_integral_member_card_slide_container">
        <div className="swiper-container myAccount_integral_member_card_slide">
          <div className="swiper-wrapper">{slide}</div>
        </div>
        <MyAccountMemberCardEquity
          callback={this.callback.bind(this)}
          _data={_data}
          _nowIndex={nowIndex}
        />
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}

const mapStateToProps = () => {};
export default connect(mapStateToProps, { popupAlert })(
  MyAccountMemberCardSlide
);
