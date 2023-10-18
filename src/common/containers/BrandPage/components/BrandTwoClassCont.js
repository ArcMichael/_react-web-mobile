import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";

class BrandTwoClassCont extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { obj, categoryid } = this.props,
      categorycur = "brand_twoclasscont",
      goUrl = "javascript:;";
    if (categoryid == obj.categoryId) {
      categorycur += " cur";
    }
    if (browserHistory) {
      let pathname = browserHistory.getCurrentLocation().pathname;
      let currenturl = pathname.split("/")[2];
      let currentsearch = browserHistory.getCurrentLocation().search;
      if (currentsearch) {
        goUrl = `/brand/${currenturl}/page1/${obj.categoryId}/${currentsearch}`;
      } else {
        goUrl = `/brand/${currenturl}/page1/${obj.categoryId}/`;
      }
    }

    return (
      <a href={goUrl} className={categorycur}>
        {obj.categoryName}
      </a>
    );
  }
}

export default BrandTwoClassCont;
