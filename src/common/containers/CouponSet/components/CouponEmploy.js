import React from "react";
import OneCouponRulePopup from "@/components/Coupon/OneCouponRulePopup";
import { getCdnImageUrl } from "@/components/CdnImage";
import Image from "../../../components/ImagesLazyLoad/index";

//前端新增优惠券对应金额图片配置 SEP-56521
const newChashCouponList = [45, 75, 105, 135, 180];
class CouponEmploy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      needHidden: false, //  文字超出2行 需要隐藏
      isShowPopup: false,
    };
    this.closeRulePopup = this.closeRulePopup.bind(this);
    this.openRulePopup = this.openRulePopup.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    const cssStyles = { fontSize: "0.24prem" };
    let needHidden = this.isElementCollision(
      this.refs["content"],
      2,
      cssStyles,
      true
    );
    this.setState({
      needHidden,
    });
  }
  // 判断文本超出行数
  isElementCollision = (ele, rowCount = 2, cssStyles, removeChild) => {
    if (!ele) {
      return false;
    }
    const clonedNode = ele.cloneNode(true);
    // 给clone的dom增加样式
    clonedNode.style.overflow = "visible";
    clonedNode.style.display = "inline-block";
    clonedNode.style.width = "auto";
    clonedNode.style.whiteSpace = "nowrap";
    clonedNode.style.visibility = "hidden";
    // console.log(clonedNode);
    // 将传入的css字体样式赋值
    if (cssStyles) {
      Object.keys(cssStyles).forEach((item) => {
        clonedNode.style[item] = cssStyles[item];
      });
    }
    // 给clone的dom增加id属性
    let _time = new Date().getTime();
    const containerID = "collision_node_id_" + _time;
    clonedNode.setAttribute("id", containerID);

    let tmpNode = document.getElementById(containerID);
    let newNode = clonedNode;
    if (tmpNode) {
      document.body.replaceChild(clonedNode, tmpNode);
    } else {
      newNode = document.body.appendChild(clonedNode);
    }
    const differ = newNode.offsetWidth - ele.offsetWidth * rowCount + 32;
    if (removeChild) {
      document.body.removeChild(newNode);
    }
    return differ > 0;
  };

  handleContent = (e) => {
    e.stopPropagation();
    let { showAll } = this.state;
    this.setState({
      showAll: !showAll,
    });
  };
  clickRule() {
    this.openRulePopup();
  }
  openRulePopup() {
    this.setState({
      isShowPopup: true,
    });
  }
  closeRulePopup() {
    this.setState({
      isShowPopup: false,
    });
  }
  render() {
    let { needHidden, showAll, isShowPopup } = this.state;
    let { content } = this.props;
    let imgUrl;
    if (content.iconUrl) {
      imgUrl = content.iconUrl;
    } else if (content.displayType == 1 || content.displayType == 2) {
      if (
        content.displayType === 1 &&
        newChashCouponList.indexOf(content.discountValue) >= 0
      ) {
        imgUrl = getCdnImageUrl(
          `/soa/nmobile/img/coupon/cny${content.discountValue}.png`
        );
      } else {
        imgUrl =
          "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/off_normal.png";
      }
    } else if (content.displayType == 3) {
      imgUrl =
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/gift_normal.png";
    } else if (content.displayType == 4) {
      imgUrl =
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/coupon/express_normal.png";
    }
    return (
      <div className="coupon-employ">
        <div className="coupon-box">
          <Image className="coupon-pic" src={imgUrl} alt="" />
          <div style={{ padding: "20px 0" }}>
            <p className="txt-small">以下商品可使用此优惠券</p>
            <div className="text-content">
              <p
                className="txt-font"
                ref={"content"}
                className={[
                  "content",
                  !showAll && needHidden ? "hidden-text" : "",
                ].join(" ")}
              >
                {content.promDesc}
              </p>
              {needHidden && (
                <div
                  className="content-btn"
                  onClick={(e) => {
                    this.handleContent(e);
                  }}
                >
                  {!showAll ? (
                    <Image
                      src="https://ssl1.sephorastatic.cn/soa/nmobile/img/search/coupon-more-arrow.png"
                      alt=""
                     />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="coupon-desc-bg" />
        <div className="coupon-desc">
          <div className="coupon-time">
            限{content.effective}至{content.expire}使用
          </div>
          <div
            className="coupon-rule"
            onClick={this.clickRule.bind(this, "giftDetails", " cur")}
          >
            <Image
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/exchange_rule.png"
              alt=""
             />
            使用规则
          </div>
        </div>
        {/* 弹框 */}
        <OneCouponRulePopup
          isShow={isShowPopup}
          closePopup={this.closeRulePopup}
        />
      </div>
    );
  }
}

export default CouponEmploy;
