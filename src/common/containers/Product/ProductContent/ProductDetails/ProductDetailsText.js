/*
 * @Author: Leo.Si
 * @Date: 2020-07-03 09:51:09
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Mo 01:47:27
 * @function 显示商品详情页--商品的具体文字信息
 */

import React, { PureComponent } from "react";
const DETAILSTEXT = require("./detailsText.json");

class ProductDetailsText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      List: JSON.parse(JSON.stringify(DETAILSTEXT)),
    };
  }

  changeItem(index) {
    const List = this.state.List;
    const check = List[index].check ? true : false;
    List[index].check = !check;
    this.setState({
      List: JSON.parse(JSON.stringify(List)),
    });
  }

  render() {
    const List = this.state.List;
    return (
      <ul className="product-details-text">
        {List.map((item, index) => {
          const { title, describe } = item;
          return (
            <li
              className="product-details-text-li"
              key={`product-details-text-${index}`}
            >
              <p>
                {title}
                <span onClick={() => this.changeItem(index)}>
                  {item.check ? (
                    <img className="arrow-down" src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/popup-arrow.png" />
                  ) : (
                    <img className="arrow-up" src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/popup-arrow.png" />
                  )}
                </span>
              </p>
              {!item.check && title != "保障承诺" && (
                <ul className="product-details-describe">
                  {describe.map((value, key) => {
                    return (
                      <li key={`product-details-describe-${key}`}>{value}</li>
                    );
                  })}
                </ul>
              )}
              {
                !item.check && title == "保障承诺" && <ul className="product-details-describe-promise">
                  <li>
                    <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/promise-ems.png" alt="" />
                    <span>顺丰EMS速达</span>
                  </li>
                  <li>
                    <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/promise-gifts.png" alt="" />
                    <span>丰富礼赠</span>
                  </li>
                  <li>
                    <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/promise-gua.png" alt="" />
                    <span>100%正品</span>
                  </li>
                  <li>
                    <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/promise-repay.png" alt="" />
                    <span>无障碍退款</span>
                  </li>
                  <li>
                    <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/promise-pay.png" alt="" />
                    <span>安全支付</span>
                  </li>
                </ul>
              }
            </li>
          );
        })}
      </ul>
    );
  }
}
export default ProductDetailsText;
// export default ScrollLazyLoading(ProductDetailsText, {
//     'name': 'productDetailsText'
// })
