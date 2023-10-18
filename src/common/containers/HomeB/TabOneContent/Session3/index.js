import React, { Component } from "react";
import { connect } from "react-redux";
import Sensor from "@/Utils/sensor/index";
import Brandwall from "@/containers/HomeB/components/Brandwall";
import { Consumer } from "../../context";
import Announcement from "./Announcement";
import "./style.scss";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {import('@/lib/services/Mpcms').ImageCommonDetail} ImageCommonDetail
 */
/**
 * @typedef {import('@/lib/services/EsBrandWall').TopBrandDTO} TopBrandDTO
 */

/**
 * @typedef {Pick<RootState,'homepage'>} Session3Props
 */

/**
 * @typedef {{
 *  brandNameEN:string;
 *  brandNameCN:string;
 *  link:string;
 *  image:string;
 *  trackingCode?:string;
 * }} brandItem
 */

/**
 * @extends {React.Component<Session3Props>}
 */
export class Session3 extends Component {
  /**
   * @param {Session3Props} props
   */
  constructor(props) {
    super(props);
    this.getBrandItems = this.getBrandItems.bind(this);
  }
  RightBrandwallLimit = 8;

  /**
   *
   * @param {TopBrandDTO[]} left
   * @param {ImageCommonDetail[]} right
   * @return {brandItem[]} - description
   */
  getBrandItems(left, right) {
    /** @type {brandItem[]} - description */
    let data = new Array(16);
    const leftIndexs = [0, 1, 4, 5, 8, 9, 12, 13];
    const rightIndexs = [2, 3, 6, 7, 10, 11, 14, 15];
    leftIndexs.forEach((targetIndex, leftIndex) => {
      const leftItem = left[leftIndex];
      if (leftItem) {
        data[targetIndex] = {
          brandNameCN: leftItem.brandNameCN,
          brandNameEN: leftItem.brandNameEN,
          link: `/brand/${leftItem.brandNameEN.toLowerCase()}-${leftItem.brandId
            }/`,
          image: leftItem.imagePath,
          trackingCode: "",
        };
      }
    });
    rightIndexs.forEach((targetIndex, rightIndex) => {
      const rightItem = right[rightIndex];
      if (rightItem) {
        data[targetIndex] = {
          brandNameCN: rightItem.text,
          brandNameEN: rightItem.text,
          link: rightItem.link,
          image: rightItem.image,
          trackingCode: rightItem.trackingCode,
        };
      }
    });
    return data;
  }

  render() {
    const {
      homepage: { session1, topBrand },
    } = this.props;
    const { board } = session1 || {};

    const allBrand = session1 && session1.brand ? session1.brand.allBrand : {};

    /** @type {import('@/containers/HomeB/components/Brandwall').BrandwallProps['titleProps']} - description */
    const titleProps = {
      children: (allBrand && allBrand.text) || "全部品牌",
      href: (allBrand && allBrand.link) || "/brand",
      onClick: () => {
        // let TabList;
        // const { homepage } = this.props;
        // if (homepage) {
        //   TabList = homepage.TabList;
        // }
        // let pathname = window.location.pathname;
        // const selectedTab = TabList && TabList.find(item => {
        //   return pathname.includes(item.id) || TabList[0]
        // })

        Sensor.go("clickBanner_App_Mob", {
          banner_content: "全部品牌",
          banner_belong_area: "Select_ All Brand",
          action_id: "1000001_014",
          page_id: "MB_1000001",
          banner_to_url: "brand/?categoryId=select",
         // $element_position: selectedTab && selectedTab.name,
        });
      },
    };
    const list = this.getBrandItems(
      topBrand || [],
      session1 && session1.brand && session1.brand.brandWall
        ? session1.brand.brandWall
        : []
    );

    return (
      <Consumer>
        {({ scrollTop }) => {
          return (
            <div className="Session3" style={{ marginTop: "-0.48rem" }}>
              {scrollTop > 0 && (
                <Announcement data={board || []} />
              )}
              {scrollTop > 0 && (
                <Brandwall
                  dataSource={list}
                  titleProps={titleProps}
                />
              )}
            </div>
          );
        }}
      </Consumer>
    );
  }
}

/**
 * @param {import('@/store/configureStore').RootState} state
 */
const mapStateToProps = (state) => {
  return {
    homepage: state.homepage,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Session3);
