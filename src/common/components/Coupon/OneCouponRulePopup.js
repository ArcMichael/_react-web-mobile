import React from "react";

/**
 * 优惠券使用规则弹层
 */
class OneCouponRulePopup extends React.Component {
  render() {
    let { isShow, closePopup } = this.props;
    return (
      <div className={"coupon-rule-popup " + (isShow ? "cur" : "")}>
        <div className="bg" onClick={closePopup} />
        <div className="box-content">
          <p className="title">使用规则</p>
          <div className="content-info">
            <p>
              * 现金券不可与其他优惠券同时使用，一个订单只能使用一张代金券.
              <br />
              * 优惠券包含现金体验券/折扣券/礼品券等,每个订单最多使用三张优惠券,同种类型的优惠券一个订单只能使用一次.
              <br />
              *
              如您订单已生成的赠品或试用装缺货，SEPHORA将自动为您更换同等或价值更高的同品牌赠品或试用装，以确保您享受同等优惠，购物车中显示已赠完的赠品不再另行替换发出。
              <br />
              *
              除非有特殊说明，满额赠礼机制适用于订单应付金额而非折前价格，如您应付金额未达到指定额度，将无法享受满赠活动。
              <br />* 特价商品不适用现金抵用券和折扣券
            </p>
          </div>
          <div className="bottom-con">
            <a className="btn-conf" onClick={closePopup}>
              我知道了
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default OneCouponRulePopup;
