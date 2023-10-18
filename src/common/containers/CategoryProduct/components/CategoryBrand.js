import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";
import DataLink from "@/components/Atoms/DataLink";
import Image from "../../../components/ImagesLazyLoad/index";

class CagegoryBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branddata: [],
    };
  }

  _ClickCallback(brand) {
    const { products } = this.props;
    const condition = [];
    let curgourl = "category";
    const currenturl = window.location.pathname;
    const hasInventory = browserHistory.getCurrentLocation().query.hasInventory || 0;
    products.filters.indexOf(brand) >= 0 ? null : condition.push(brand);
    products.filters.split(",").map((d) => {
      if (d === brand) return;
      d !== "" && condition.push(d);
    });

    curgourl = condition.indexOf(",") > 0 ? "categories" : "category";
    window.location =
      "/" +
      curgourl +
      "/" +
      currenturl.split("/")[2] +
      "/page1/" +
      (condition.length > 0 ? condition.join(",") + "/" : "") +
      "?hasInventory=" +
      hasInventory +
      "&pageSize=20" +
      "&sortField=" +
      products.sortField +
      "&sortMode=" +
      products.sortMode +
      "&minFilterPrice=" +
      products.minFilterPrice +
      "&maxFilterPrice=" +
      products.maxFilterPrice +
      "&brand";

  }

  setBrandData(products, obtainResults) {
    const brandData = [];
    obtainResults.facetBrands &&
      obtainResults.facetBrands.map((d, i) => {
        const obj = JSON.parse(JSON.stringify(d));
        if (i < 9) {
          products.filters.split(",").indexOf(d.seoIdentifier) > -1
            ? (obj.classname = "brandComponent active")
            : (obj.classname = "brandComponent");
          brandData.push(obj);
        }
      });
    this.setState({
      branddata: brandData,
    });
  }

  componentDidMount() {
    this.setBrandData(this.props.products, this.props.obtainResults);
  }

  render() {
    const { branddata } = this.state;
    return (
      <div className="categoryBrand">
        <div className="brandList">
          {branddata &&
            branddata.map((d) => {
              const { brandLogoPath, classname, brandNameCN, seoIdentifier } = d;
              return (
                <DataLink
                  _ClassName={classname}
                  _ClickCallback={this._ClickCallback.bind(this, seoIdentifier)}
                  _Sensor={{
                    eventKey: "ListClick",
                    value: {
                      button_name: brandNameCN,
                      action_id: "1000202_010",
                      page_id: "MB_1000202",
                      $element_target_url: location.href,
                      categoryId: d.brandId,
                      brand_cn: brandNameCN,
                      brand_id: d.brandId,
                      key_words: ""
                    },
                  }}
                  key={d.brandId}
                >
                  <Image src={brandLogoPath} alt="" />
                  <p>{brandNameCN}</p>
                </DataLink>
              );
            })}
          <div style={{ padding: "0 5px", backgroundColor: "#f5f5f5" }} />
        </div>
      </div>
    );
  }
}

export default CagegoryBrand;
