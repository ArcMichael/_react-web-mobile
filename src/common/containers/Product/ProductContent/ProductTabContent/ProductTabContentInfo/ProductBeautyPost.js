/*
 * @Author: Leo.Si
 * @Date: 2020-07-20 17:01:40
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-25 21:59:47
 * @function
 */
import React from "react";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import LazyloadImage from "@/components/LazyloadImage";

const ProductBeautyPost = ({ _otherData }) =>
  !!_otherData && (
    <div className="product-info-beauty-post">
      <div className="product-info-beauty-post-title">
        <p>
          美印社区<span>{_otherData.total && `(${_otherData.total})`}</span>
        </p>
        {_otherData.isMore && (
          <a
            onClick={() => {
              Sensor.go("PDPClick", {
                OP_code: window.location.pathname.split("/")[2].split(".")[0] || null,
                button_name: "美印社区",
              });
              GoogleAnalytics.pushV2({
                event: "productDetailInteraction",
                // "pdpInteractionDetail": "美印社区",
                pdpInteractionType: "美印社区",
              });
              window.location.href = _otherData.isMore;
            }}
          >
            查看更多
            <img
              className="product-page-arrow"
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png"
            />
          </a>
        )}
      </div>
      <ul>
        {_otherData.newArray &&
          _otherData.newArray.map((item, index) => {
            const { imageUrl, link } = item;
            return (
              <li key={`product-info-beauty-post-${index}`}>
                <a href={link}>
                  <LazyloadImage
                    imgProps={{
                      src: imageUrl,
                      style: {
                        width: "1.68rem",
                        height: "1.68rem",
                      },
                    }}
                   />
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );

export default ProductBeautyPost;
