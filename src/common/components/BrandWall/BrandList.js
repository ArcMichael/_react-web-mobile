/*
 * @Author: zone Tian
 * @Date: 2020-02-03 14:52:51
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 15:50:20
 */
import React from "react";
import BrandFloor from "./BrandWallFloor";

const BrandList = (Component) => {
  return class extends React.Component {
    render() {
      const { BrandAll } = this.props;
      return (
        BrandAll &&
        BrandAll.map((d, i) => {
          return (
            <Component
              {...this.props}
              index={i + 1}
              key={d.brandTitle}
              branddata={d.brandList}
              classtitle="all_brand_List brand_List "
              label={d.brandTitle}
            />
          );
        })
      );
    }
  };
};

export default BrandList(BrandFloor);
