/*
 * @Author: Leo.Si
 * @Date: 2020-06-10 15:00:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-09-Mo 11:33:03
 * @function 展示物流状态、物流公司、运单编号
 */
import React from "react";
import { copyToClipboard } from "@/lib/Tools";
const LogisticsStatus = ({ _statusData, _index }) => (
  <div className="myorder-delivery-content-status">
    <p>
      包裹{_index + 1}
      {_statusData.orderStatus || ""}
    </p>
    {_statusData.estimatedDeliveryTime ? (
      <p
        className={`estimatedDeliveryTime`}
      >{`预售商品，预计${_statusData.estimatedDeliveryTime}日起发货`}</p>
    ) : null}
    {_statusData.companyNameCN ? (
      <p>
        物流公司<span>{_statusData.companyNameCN}</span>
      </p>
    ) : null}
    {_statusData.deliveryNumber ? (
      <p>
        运单编号<span>{_statusData.deliveryNumber}</span>
        {_statusData.deliveryNumber!="暂无"&&<span
          className="copy"
          onClick={() => {
            copyToClipboard(_statusData.deliveryNumber, () => {
              alert("复制成功");
            });
          }}
        >
          复制
        </span>
        }
      </p>
    ) : null}
  </div>
);
export default LogisticsStatus;
