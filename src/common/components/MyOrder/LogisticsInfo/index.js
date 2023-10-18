/*
 * @Author: Leo.Si
 * @Date: 2020-06-10 13:42:40
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-09-Mo 11:26:37
 * @function 展示具体的物流信息
 */
import React from "react";
import LogisticsStatus from "./LogisticsStatus";
import LogisticsProduct from "./LogisticsProduct";
import LogisticsDetails from "./LogisticsDetails";
const LogisticsInfoIndex = ({ _data }) => (
  <div className="myorder-delivery">
    {_data && _data.length >= 2 ? "" : <div className="myorder-delivery-blank" />}
    {_data &&
      _data.length > 0 &&
      _data.map((item, index) => {
        const {
          orderStatus,
          companyNameCN,
          deliveryNumber,
          productDtos,
          // deliveryUrl,
          totalQuantity,
          deliveryTrackings,
          estimatedDeliveryTime,
        } = item;
        return (
          <div className="myorder-delivery-content" key={`myorder-delivery-content-${index}`}>
            {/* {_data.length >= 2 ? <span className="delivery-package">{`包裹${index + 1}`}</span> : ""} */}
            <LogisticsStatus
              _index={index}
              _statusData={{
                orderStatus,
                companyNameCN,
                deliveryNumber,
                estimatedDeliveryTime,
              }}
            />
            <LogisticsProduct
              _productData={{
                productDtos,
                totalQuantity,
              }}
            />
            {/* {deliveryUrl && (
              <a className="myorder-delivery-three-party">
                <img src="https://ssl1.sephorastatic.cn/soa/pc/images/logic-pic.png" />
                <p>第三方物流</p>
                
              </a>
            )} */}
            <LogisticsDetails _detailsData={deliveryTrackings} />
          </div>
        );
      })}
  </div>
);
export default LogisticsInfoIndex;
