import React, { Component } from "react";
import CategoryStrockhd from "./CategoryStrockhd";

class CategoryStrock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [
        {
          name: "库存",
          checkcont: "仅看有货",
          seoIdentifier: "hasInventory",
          items: [{ valueName: "仅看有货", checked: 1 }],
        },
      ],
    };
  }

  render() {
    let stockcon = [];
    if (this.state.stocks) {
      stockcon = this.state.stocks.map((el, index) => {
        return <CategoryStrockhd key={index} type="strock" obj={el} _index={index} {...this.props} />;
      });
    }
    return <div className="category_strock">{stockcon}</div>;
  }
}

export default CategoryStrock;
