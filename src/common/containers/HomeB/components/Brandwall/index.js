import React, { Component } from "react";
import Card from "@/containers/HomeB/components/Card";
import Text from "@/components/Text";
import DataLink from "@/components/Atoms/DataLink";
import LazyloadImage from "@/components/LazyloadImage";
import getBrandListPageData from "../../libs/getBrandListPageData";

const { Title } = Text;

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
 * @typedef {{
 *  dataSource:brandItem[],
 *  titleProps?:import('@/components/Text/Title').TitleProps;
 *  type?:string;
 * }} BrandwallProps
 */

/**
 * @extends {React.Component<BrandwallProps>}
 */
export default class Brandwall extends Component {
  constructor(props) {
    super(props);
    this.getBrands = this.getBrands.bind(this);
    this.jumpHandle = this.jumpHandle.bind(this);
    this.state = {
      /** @type {JSX.Element[]} - description */
      brands: this.getBrands(this.props.dataSource || []),
    };
  }

  jumpHandle(e, data) {
    e.preventDefault();
    if (data.link && data.link.split("/").length > 4) {
      let linkSplit = data.link.split("/");
      // 需要跳转到品牌页的分类中
      let brandCategoryId = "",
        brandId = 1,
        pageNum = 1,
        pageSize = 20,
        channel = "MOBILE";
      if (!isNaN(linkSplit[4])) {
        brandCategoryId = linkSplit[4];
      }
      if (linkSplit[2].split("-").length > 1) {
        brandId =
          linkSplit[2]
            .split("-")
            [linkSplit[2].split("-").length - 1].split(",")
            .join("") || 1;
      }
      let param = `brandCategoryId=${brandCategoryId ||
        ""}&brandId=${brandId}&pageNum=${pageNum}&pageSize=${pageSize}&channel=${channel}`;
      getBrandListPageData(param, json => {
        if (json && json.results && json.results.categoryTree) {
          let categoryTree = json.results.categoryTree;
          if (categoryTree && categoryTree.length < 3) {
            // 品牌页不展示分类，不跳到特定分类下
            window.location.href = `${data.link.split("page1")[0]}${data.trackingCode}`;
          } else {
            let hasCategoryId = false;
            if (brandCategoryId && categoryTree) {
              hasCategoryId = categoryTree.find(val => {
                return val.categoryId === brandCategoryId;
              });
            }
            // 品牌分类中没有当前分类时跳全部分类
            if (!hasCategoryId) {
              return (window.location.href = `${data.link.split("page1")[0]}${data.trackingCode}`);
            }
            window.location.href = `${data.link}${data.trackingCode}`;
          }
        } else {
          window.location.href = `${data.link}${data.trackingCode}`;
        }
      });
    } else {
      window.location.href = `${data.link}${data.trackingCode}`;
    }
    return false;
  }

  /**
   * @param {BrandwallProps} nextProps
   * @param {*} nextState
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.dataSource) !== this.props.dataSource) {
      const brands = this.getBrands(nextProps.dataSource);
      this.setState({
        brands,
      });
    }
  }

  /**
   * @param {brandItem[]} list
   * @return {JSX.Element[]} - description
   */
  getBrands(list) {
    const { type } = this.props;
    return list.map((data, i) => {
      return (
        <DataLink
          key={`${i}`}
          _Sensor={{
            eventKey: "clickBanner_App_Mob",
            value: {
              platform_type: "mobile",
              system_type: "",
              environment_type: "",
              vip_card: "",
              vip_card_type: "",
              action_id: "1000001_014",
              page_id: "MB_1000001",
              $title: "首页",
              page_type_detail: "",
              page_type: "",
              $url_path: "",
              $url_query: "",
              $url: "",
              current_url: "",
              banner_current_url: "home",
              banner_current_page_type: "home",

              banner_content: data.brandNameCN,
              banner_belong_area: `${type || "Select"}_Brand Wall`,
              banner_to_url: data.link,
              banner_to_page_type: data.link,
              campaign_code: data.trackingCode,
              banner_ranking: i + 1,
            },
          }}
          _Href={data && data.link}
          _Omniture={data.trackingCode}
          _ClickCallback={e => this.jumpHandle.call(this, e, data)}
        >
          <LazyloadImage
            imgProps={{
              src: data.image,
              alt: data.brandNameCN,
            }}
            shape="horizontal-rect"
            loadingType="smalltype"
          />
        </DataLink>
      );
    });
  }

  render() {
    const { titleProps } = this.props;
    const { children, ...restTitleProps } = titleProps || {};
    return (
      <Card className="brandwarll" style={{ paddingBottom: "0.32rem", paddingTop: "0.32rem" }}>
        <div className="wrap">{this.state.brands}</div>
        {titleProps && titleProps.children && (
          <Title className="brandwarll-title" level={4} {...restTitleProps}>
            {titleProps.children}
          </Title>
        )}
      </Card>
    );
  }
}
