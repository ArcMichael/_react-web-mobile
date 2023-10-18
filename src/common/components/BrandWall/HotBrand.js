/*
 * @Author: zone Tian
 * @Date: 2020-02-03 14:52:02
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 15:50:11
 */
import React from "react";
import BrandFloor from "./BrandWallFloor";

const HotBrand = (Componet) => {
  return class extends React.Component {
    render() {
      const { HotBrandAllcon } = this.props;
      const branddata = HotBrandAllcon.slice(0, 9);
      return (
        <div className="brand_List">
          <div className="brand_top_title">热门品牌</div>
          <Componet
            index={0}
            branddata={branddata}
            classtitle="hot_brand"
            belongarea={"HotBrand"}
          />
        </div>
      );
    }
  };
};

export default HotBrand(BrandFloor);
