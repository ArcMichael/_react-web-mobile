/**
 * Created by ZHAN561 on 2017/4/20.
 */

import Sensor from "@/Utils/sensor";
import React, { Component } from "react";

import CategoryExhibition from "./CategoryExhibition";

class Categoryproduct extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
    Sensor.go("$pageview", {
      page_id: "MB_1000201",
      action_id: "1000201_000",     
    });
  }

  render() {
    let { name } = this.props;
    return (
      <div className="category_product">
        <CategoryExhibition name={name} />
      </div>
    );
  }
}

export default Categoryproduct;
