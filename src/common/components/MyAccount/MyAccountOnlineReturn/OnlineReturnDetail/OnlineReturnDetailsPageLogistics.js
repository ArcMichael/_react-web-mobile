/*
 * @Author: Leo.Si
 * @Date: 2019-09-12 14:01:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-03 15:13:22
 * @function 申请退货详情的产品信息、退货原因、退货数量、退货金额、退货说明
 */
import React from "react";
import OnlineReturnReason from "../OnlineReturnReason";
import { copyToClipboard } from "../../../../lib/Tools";
export default class OnlineReturnDetailsPageLogistics extends React.Component {
  constructor(props) {
    super(props);
    this.saveDelivery = this.saveDelivery.bind(this);
  }
  copy(returnNumber) {
    let { _clickCallback } = this.props;
    copyToClipboard && copyToClipboard(returnNumber, _clickCallback);
  }
  //saveDelivery 记录快递单号
  saveDelivery(e) {
    const { _clickCallback } = this.props;
    _clickCallback && _clickCallback("getLogisticsNumber", e.target.value);
  }
  render() {
    const { _returnDetailsData, _clickCallback } = this.props;
    const { warehouseAddress, warehouseTelephone, warehouseContacter } = _returnDetailsData;
    return (
      !!_returnDetailsData && (
        <div className="online_return_page_detail_logistics">
          <div className="online_return_info">
            <p className="online_return_page_detail_address">
              退货地址
              <span
                className="order_info_copy"
                onClick={this.copy.bind(
                  this,
                  warehouseAddress + (warehouseTelephone ? "," + warehouseTelephone : ""),
                )}
              />
            </p>
            <p className="online_return_page_detail_logistics_detail">
              <strong>{warehouseContacter}</strong>
              {warehouseTelephone}
            </p>
            <p className="online_return_page_detail_logistics_detail">{warehouseAddress}</p>
          </div>

          <div className="online_return_info">
            <p className="online_return_page_detail_address">填写快递信息</p>
            <div>
              <OnlineReturnReason
                _clickCallback={_clickCallback}
                _obj={_returnDetailsData.delivery}
                _tile="点击选择快递公司"
              />
            </div>
            <p className="online_return_page_info input-color ">
              <span>请填写快递单号</span>
              <input
                placeholder="点击填写快递单号"
                className="online_return_page_info_input"
                onChange={this.saveDelivery}
              />
              <img
                className="online_return_page_info_img"
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png"
              />
            </p>
          </div>
          {/* <div className='online_return_page_reason online_return_page_detail_logistics_delivery'>
                    <OnlineReturnReason  _clickCallback={_clickCallback} _obj={_returnDetailsData.delivery} />
                </div>
                <div className='online_return_page_detail_logistics_delivery_num'>
                    <span>请填写快递单号</span>
                    <input onChange={this.saveDelivery}/>
                </div> */}
        </div>
      )
    );
  }
}
