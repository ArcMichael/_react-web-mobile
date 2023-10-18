/*
 * @Author: Leo.Si
 * @Date: 2019-09-18 10:25:33
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-09-Tu 03:06:53
 * @function OnlineReturn  退货/售后 列表 订单数据
 */
import React from "react";
// import Product from "../../../Product/index";
import Product from "@/components/MyOrder/OrderList/OrderListContentGoods";
import { copyToClipboard } from "../../../../lib/Tools";
export default class OnlineReturnListData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      returnNumberNow: "",
    };
  }
  componentDidMount() {
    const { returnNumberNow } = this.state; // TODO: 请移除无用state
    console.log(returnNumberNow);
  }
  copy(returnNumber) {
    let { _clickCallback } = this.props;
    copyToClipboard && copyToClipboard(returnNumber, _clickCallback);
  }

  render() {
    let { _data } = this.props;
    if (!_data || !_data.content || _data.content.length == 0) {
      return (
        <div className="online_return_list_data">
          <img
            className="online_return_list_data_no_img"
            src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/group_icon.png"
          />
          <span className="online_return_list_data_no_tip">您目前没有相关申请</span>
        </div>
      );
    }
    return (
      <ul className="online_return_list_data">
        {_data &&
          _data.content &&
          _data.content.length > 0 &&
          _data.content.map((item, index) => {
            const {
              returnNumber,
              processComment,
              defaultImagePath,
              brandNameEN,
              brandNameCN,
              productNameCN,
              productNameEN,
              skuSaleAttr,
              applyQty,
              returnProductId,
              returnSkuId,
              returnId,
            } = item;
            let productData = {
              defaultImagePath,
              brandNameEN,
              brandNameCN,
              productNameCN,
              productNameEN,
              skuSaleAttrDto: skuSaleAttr,
              quantity: applyQty,
              productId: returnProductId,
              skuId: returnSkuId,
            };
            return (
              <li className="online_return_list_data_li" key={`online_return_list_data_${index}`}>
                <div className="online_return_list_data_top">
                  <p>
                    退货单号 {returnNumber}
                    <span className="copy_img" onClick={this.copy.bind(this, returnNumber)}>
                      复制
                    </span>
                  </p>

                  <p>{processComment}</p>
                </div>
                <div className="online_return_list_data_product">
                  <Product productInfoDtoList={productData} />
                </div>
                <div className="online_return_list_data_bottom">
                  <a href={`/myAccount/returnDetails?returnId=${returnId}`}>查看详情</a>
                </div>
              </li>
            );
          })}
      </ul>
    );
  }
}
