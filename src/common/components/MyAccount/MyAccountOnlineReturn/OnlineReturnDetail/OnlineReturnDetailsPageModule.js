/*
 * @Author: Leo.Si
 * @Date: 2019-09-12 14:01:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-02 15:36:00
 * @function 申请退货详情的产品信息、退货原因、退货数量、退货金额、退货说明
 */
import React from "react";
import OrderListGoods from "@/components/MyOrder/OrderList/OrderListContentGoods";
import OnlineReturnDetailsPageLogistics from "./OnlineReturnDetailsPageLogistics";
import OnlineReturnDetailsDelivery from "./OnlineReturnDetailsDelivery";
import { copyToClipboard } from "../../../../lib/Tools";
import Image from "../../../ImagesLazyLoad/index";

export default class OnlineReturnDetailsPageModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // returnNumberNow: "",
    };
  }
  componentDidMount() {
    // const { returnNumberNow } = this.state; // TODO: 请移除无用state
  }
  copy(text) {
    let { _clickCallback } = this.props;
    copyToClipboard && copyToClipboard(text, _clickCallback);
  }
  render() {
    const { _returnDetailsData, _clickCallback, _isSumbit } = this.props;
    return (
      !!_returnDetailsData && (
        <div className="online_return_page_detail">
          {_returnDetailsData.allowAddress ? (
            <OnlineReturnDetailsPageLogistics
              _returnDetailsData={_returnDetailsData}
              _clickCallback={_clickCallback}
            />
          ) : null}
          {_returnDetailsData.showDelivery ? (
            <OnlineReturnDetailsDelivery
              _returnDetailsData={_returnDetailsData}
              _clickCallback={_clickCallback}
            />
          ) : null}
          <div className="online_return_info">
            <p className="online_return_page_detail_title">退货商品</p>
            <ul>
              {_returnDetailsData.productData &&
                _returnDetailsData.productData.map((products) => {
                  return (
                    <li key={products.skuId} className="">
                      <OrderListGoods productInfoDtoList={products} isHideTag />
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="online_return_info">
            <p className="online_return_page_detail_title info">退货信息</p>
            <p className="online_return_page_info">
              <span>退货原因</span>
              <span>{_returnDetailsData.returnReason}</span>
            </p>
            <p className="online_return_page_info">
              <span>退货数量</span>
              <span>{_returnDetailsData.productData[0].quantity}</span>
            </p>
            <p className="online_return_page_info">
              <span>实退金额</span>
              <span className={_returnDetailsData.showPrice ? "red" : ""}>
                ￥{_returnDetailsData.actualTotalPrice.toFixed(2)}
              </span>
              {_returnDetailsData.showPrice ? (
                <a
                  href={`/myAccount/returnRefundDetails?returnId=${_returnDetailsData.returnId}`}
                  className="check_details"
                >
                  查看详情
                </a>
              ) : null}
            </p>
          </div>
          <div className="online_return_info">
            <p className="online_return_page_detail_title">退货说明</p>
            {_returnDetailsData.allowEdit ? (
              <a href={`/myAccount/returnDetailsEdit?returnId=${_returnDetailsData.returnId}`}>
                <img
                  className="online_return_details_content_img"
                  src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/exchange_edit.png"
                />
              </a>
            ) : null}
            <p className="online_return_details_content_applyComment">
              {_returnDetailsData.applyComment}
            </p>
            <ul className="online_return_details_content_imgs">
              {_returnDetailsData.applyImage &&
                _returnDetailsData.applyImage.length > 0 &&
                _returnDetailsData.applyImage.map((item, index) => {
                  return (
                    <li key={`returnDetailsData_applyImage_${index}`}>
                      <Image src={item} />
                      {/* <img src={item} /> */}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="online_return_info">
            <p className="online_return_page_detail_title info">售后信息</p>
            <p className="online_return_page_info">
              <span>退货单号</span>
              <span>{_returnDetailsData.returnNumber}</span>
              <span
                className="order_info_copy"
                onClick={this.copy.bind(this, _returnDetailsData.returnNumber)}
              />
            </p>
            <p className="online_return_page_info">
              <span>申请时间</span>
              <span>{_returnDetailsData.createTime}</span>
            </p>
          </div>
          <div className="online_return_details_tip">
            <p> 您的退货申请需要经过审核，请耐心等待。</p>
            <p> 1. 一般在3个工作日内会完成审核，如有问题请联系客服</p>
            <p> 2. 请注意站内信提醒是否通过审核</p>
          </div>

          {_returnDetailsData.allowAddress ? (
            <div
              className={`online_return_detail_submit ${_isSumbit ? "" : "noVal"}`}
              onClick={_clickCallback.bind(this, "deliverySubmit")}
            >
              提交
            </div>
          ) : null}
        </div>
      )
    );
  }
}
