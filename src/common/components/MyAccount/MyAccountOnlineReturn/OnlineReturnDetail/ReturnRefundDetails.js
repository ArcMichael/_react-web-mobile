/*
 * @Author: Leo.Si
 * @Date: 2019-09-20 16:43:36
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-09-14 15:56:09
 * @function 退款明细
 */
import React from "react";
import OrderListGoods from "@/components/MyOrder/OrderList/OrderListContentGoods";
import { copyToClipboard } from "../../../../lib/Tools";
const ReturnRefundDetails = ({ _refundDetails, _callback }) =>
  !!_refundDetails && (
    <div className="online_return_refond_details">
      <div className="online_return_info">
        <p className="online_return_page_detail_title">退货商品</p>
        <ul>
          {_refundDetails.productData &&
            _refundDetails.productData.map((products) => {
              return (
                <li key={products.skuId} className="">
                  <OrderListGoods productInfoDtoList={products} isHideTag/>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="online_return_info">
        <p className="online_return_page_info">
          <span>退货单号</span>
          <span>{`${_refundDetails.returnNumber}`}</span>
          <span
            className="order_info_copy"
            onClick={() =>
              copyToClipboard(_refundDetails.returnNumber, _callback)
            }
           />
        </p>
        <p className="online_return_page_info">
          <span>实退金额</span>
          <span>{`¥${_refundDetails.actualTotalPrice.toFixed(2)}`}</span>
        </p>
        {/* <p className="online_return_page_info">
          <span>优惠券</span>
          <span>{`¥${_refundDetails.promotionPrice.toFixed(2)}`}</span>
        </p> */}
        <p className="online_return_page_info">
          <span>支付方式</span>
          <span>{`${_refundDetails.paymentType || ""}`}</span>
        </p>
        <p className="online_return_page_info">
          <span>退款类型</span>
          <span>{`${_refundDetails.refundType}`}</span>
        </p>
      </div>
    </div>
  );
export default ReturnRefundDetails;
