import React, { Component } from "react";
import { SetSingleCookie2 } from "@/lib/Tools";
import Image from "../../../components/ImagesLazyLoad/index";

class Brandstorycon extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let { Brandpagecon } = this.props;
    if (Brandpagecon && Brandpagecon.brandStoryUrlForMobile) {
      SetSingleCookie2({ key: "brandstoryName", value: Brandpagecon.currentBrand.brandNameCN });
    }
  }
  render() {
    let { Brandpagecon } = this.props;
    let Style;
    let imgurl = "";
    let brandcn = "";
    let brandUrl = "";
    if (Brandpagecon && Brandpagecon.currentBrand) {
      imgurl = Brandpagecon.currentBrand.brandLogoPath;
      brandcn = Brandpagecon.currentBrand.brandNameCN;
      brandUrl =
        "/brand/story-" +
        Brandpagecon.currentBrand.brandNameEN.toLowerCase().replace(/[^\w]/g, "") +
        "-" +
        Brandpagecon.currentBrand.brandId +
        "/";
      if (!Brandpagecon.brandStoryUrlForMobile) {
        Style = {
          display: "none",
        };
      }
      return (
        <div className="brand_storycon">
          <div>
            <Image src={imgurl} alt="" />
            <h1>{brandcn}</h1>
          </div>
          <a href={brandUrl} style={Style}>
            <span>品牌故事</span>
            <em />
          </a>
        </div>
      );
    }
    return null;
  }
}

export default Brandstorycon;
