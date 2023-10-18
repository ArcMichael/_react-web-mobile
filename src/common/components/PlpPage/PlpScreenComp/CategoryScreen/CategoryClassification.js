import React, { Component } from "react";
import CategoryStrockhd from "./CategoryStrockhd";

class CategoryClassification extends Component {
  render() {
    let stockcon = [];
    let { products, CATEGORY_RESETQUANTITY, firstShowScreen } = this.props;
    if (!firstShowScreen) return <div className="category_strock category_allstrock" />;
    let CategoryListall = CATEGORY_RESETQUANTITY || products;
    if (CategoryListall) {
      stockcon = CategoryListall.facetAttrs.map((el, index) => {
        return <CategoryStrockhd key={index} type="types" obj={el} _index={index} {...this.props} />;
      });
    }
    return <div className="category_strock category_allstrock">{stockcon}</div>;
  }
}

export default CategoryClassification;
