import Images from "@/components/Images/render";
import Sensor from "@/Utils/sensor";
import React from "react";

const ProductRanking = ({ _data, OP_code }) => {
  let canScroll = true;
  if (_data.length > 1) {
    canScroll = false;
  }
  return (
    <div className="product-info-ranking-container">
      <Images
        _src="https://ssl1.sephorastatic.cn/soa/nmobile/img/pdp_ranking_icon2.png"
        _className="product-info-ranking-image"
       />
      <div className={`product-info-ranking-list ${canScroll ? "" : "cantslide"}`}>
        {_data.map((rank, index) => {
          if (index > 1) return null;
          return (
            <a
              href={`/v2/html/standings?id=${rank.rankingId}&name=${rank.desc}`}
              key={`product-info-ranking-${index}`}
              onClick={() => {
                Sensor.go("PDPClick", {
                  current_url: window.location.href,
                  OP_code,
                  button_name: "查看榜单",
                });
              }}
            >
              <span className={`product-info-ranking-${index}`}>{rank.desc}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
export default ProductRanking;
