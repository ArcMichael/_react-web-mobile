import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import Image from "../../../components/ImagesLazyLoad/index";
class Brandscreencon extends Component {
  constructor(props) {
    super(props);
    this.goUrl = this.goUrl.bind(this);
    this.state = {
      currenturl: null,
      categoryid: null,
    };
  }
  goUrl() {
    let { obj } = this.props,
      isContain = false;
    let pathname = browserHistory.getCurrentLocation().pathname;
    let currenturl = pathname.split("/")[2];
    let currentCategory = pathname.split("/")[4];
    let currentsearch = browserHistory.getCurrentLocation().search;
    if (obj.childFacetCategories) {
      obj.childFacetCategories.map((con) => {
        con.categoryId == currentCategory && (isContain = true);
      });
    }
    Sensor.go("ListClick", {
      button_name: obj.categoryName,
    });
    let brandName = currenturl.split("-")[0];
    let firstCategory = obj.categoryName;
    if (brandName) {
      brandName = brandName.toLowerCase();
    }
    GoogleAnalytics.pushV2({
      event: "brandPlpQuickFilter",
      productFirstCategory: `${brandName} | ${firstCategory}`,
    });
    if (
      (currentCategory &&
        currentCategory == obj.categoryId &&
        currentCategory.match(/^[0-9]*$/)) ||
      isContain
    ) {
      if (currentsearch) {
        currentsearch = currentsearch.replace(
          /minFilterPrice=.*?&|minFilterPrice=.*/,
          ""
        );
        currentsearch = currentsearch.replace(
          /maxFilterPrice=.*?&|maxFilterPrice=.*/,
          ""
        );
        window.location.href = `/brand/${currenturl}/${currentsearch}`;
      } else {
        window.location.href = `/brand/${currenturl}/`;
      }
    } else {
      if (currentsearch) {
        currentsearch = currentsearch.replace(
          /minFilterPrice=.*?&|minFilterPrice=.*/,
          ""
        );
        currentsearch = currentsearch.replace(
          /maxFilterPrice=.*?&|maxFilterPrice=.*/,
          ""
        );
        window.location.href = `/brand/${currenturl}/page1/${obj.categoryId}/${currentsearch}`;
      } else {
        window.location.href = `/brand/${currenturl}/page1/${obj.categoryId}/`;
      }
    }
  }

  componentDidMount() {
    const { currenturl } = this.state; // TODO: 请移除无用state
    console.log(currenturl);
    this.setState({
      currenturl: browserHistory.getCurrentLocation().pathname,
      categoryid: browserHistory.getCurrentLocation().pathname.split("/")[4],
    });
  }

  render() {
    let { obj } = this.props;
    let isTrue = false;
    if (obj.categoryId == this.state.categoryid) {
      isTrue = true;
    } else {
      obj.childFacetCategories.map((el) => {
        if (el.categoryId == this.state.categoryid) {
          isTrue = true;
        }
      });
    }
    return (
      <a className="brand_screencon" onClick={this.goUrl}>
        <Image
          src={obj.categoryLogoPath ? obj.categoryLogoPath + "150x150.jpg" : ""}
          alt=""
         />
        {isTrue ? (
          <p className="text_black">{obj.categoryName}</p>
        ) : (
          <p>{obj.categoryName}</p>
        )}
        {isTrue ? <span className="click_line" /> : null}
      </a>
    );
  }
}

export default Brandscreencon;
