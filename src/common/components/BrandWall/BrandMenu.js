/*
 * @Author: zone Tian
 * @Date: 2020-02-03 14:52:40
 * @Last Modified by: zone Tian
 * @Last Modified time: 2020-02-03 14:53:30
 */
import React from "react";

const BrandMenu = ({ BrandAll, callback, curId }) => (
  <div className="brand_menu">
    <span
      className={
        curId == 0
          ? "hot_brand_menu brand_menu_list curHot"
          : "hot_brand_menu brand_menu_list"
      }
      onClick={() => callback(0)}
     />
    {BrandAll &&
      BrandAll.map((d, i) => {
        return (
          <span
            key={d.brandTitle}
            onClick={() => callback(i + 1)}
            className={
              i + 1 === curId ? "brand_menu_list cur" : "brand_menu_list"
            }
          >
            {d.brandTitle}
          </span>
        );
      })}
  </div>
);

export default BrandMenu;
