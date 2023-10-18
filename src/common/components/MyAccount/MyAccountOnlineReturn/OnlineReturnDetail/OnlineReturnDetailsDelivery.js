/*
 * @Author: Leo.Si
 * @Date: 2019-09-20 15:35:51
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-23 15:54:21
 * @function 等待退款状态下，申请金额，物流信息
 */
import React from "react";
import { copyToClipboard } from "../../../../lib/Tools";
const OnlineReturnDetailsDelivery = ({ _returnDetailsData, _clickCallback }) =>
  !!_returnDetailsData && (
    <div className="online_return_details_delivery_success">
      {/* <p className='online_return_details_delivery_success_price border_bottom'>申请金额：¥{_returnDetailsData.actualTotalPrice}</p> */}
      <div className="online_return_info">
        <p className="online_return_page_detail_title info">快递信息</p>
        <p className="online_return_page_info">
          <span>快递公司</span>
          <span>{_returnDetailsData.logisticsCompany}</span>
        </p>
        <p className="online_return_page_info">
          <span>快递单号</span>
          <span>{_returnDetailsData.logisticsNumber}</span>
          <span
            className="order_info_copy"
            onClick={() =>
              copyToClipboard(
                _returnDetailsData.logisticsNumber,
                _clickCallback
              )
            }
           />
        </p>
      </div>
    </div>
  );
export default OnlineReturnDetailsDelivery;
