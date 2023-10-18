import React, { Component } from "react";
import ProductDetails from "../../ProductDetails";

export default class ProductTabContentDetail extends Component {
  render() {
    return <ProductDetails {...this.props} />;
  }
}
