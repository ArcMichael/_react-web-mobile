import React, { Component } from "react";
import { connect } from "react-redux";
import AnyImagesRender from "../Images/renderReplace";
import MoreRecommended from "./moreRecommended";
import CurrentComponentCommonTop from "../CommonTop/index";
import ImgAnimation from "./imgAnimation";
import { getCCVideo, nicheFragranceChangeDetails } from "../../actions/nichefragrance";
import Video from "../Video/index";
import LazyloadImage from "@/components/LazyloadImage";

class NicheFragranceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classname: "nf_swiper_details",
      videoSrc: "",
      timer: null,
    };
    this.loaderRenderBanner = this.loaderRenderBanner.bind(this);
    this.loaderRenderProduct = this.loaderRenderProduct.bind(this);
    this.loaderRenderProductList = this.loaderRenderProductList.bind(this);
  }
  componentDidMount() {
    const { _datas } = this.props;

    let newTimer = setTimeout(() => {
      this.setState({ classname: "nf_swiper_details popup " });
    }, 100);
    _datas.videoId &&
      this.props.getCCVideo(_datas.videoId, (callback) => {
        if (callback && callback.results && callback.results.playurl) {
          this.setState({
            videoSrc: callback.results.playurl,
            timer: newTimer,
          });
        }
      });
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
  loaderRenderIcon(iconType) {
    switch (iconType) {
      case "back":
        return (
          <i className="nf_swiper_back" onClick={this.loaderRenderIconEvent.bind(this, iconType)}>
              <LazyloadImage
             imgProps={{
               src:"https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/back.png"
             }}
            />
          </i>
        );
      case "shared":
        return (
          <i className="nf_swiper_shared">
             <LazyloadImage
             imgProps={{
               src:"https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shared.png"
             }}
            />
      
          </i>
        );
      case "backScroll":
        return (
          <i className="nf_swiper_back" onClick={this.loaderRenderIconEvent.bind(this, "back")}>
               <LazyloadImage
             imgProps={{
               src:"https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png"
             }}
            />
          </i>
        );
      default:
        return null;
    }
  }

  loaderRenderIconEvent(iconType) {
    const { nicheFragranceChangeDetails } = this.props;
    switch (iconType) {
      case "back":
        return (() => {
          this.setState({ classname: "nf_swiper_details " }, () => {
            setTimeout(() => {
              nicheFragranceChangeDetails(false);
            }, 800);
          });
        })();
      default:
        return false;
    }
  }
  loaderRenderItems() {
    const { classname, videoSrc } = this.state;
    const { _datas, scrollTop } = this.props;
    return (
      <div className={classname}>
        <div
          className={
            scrollTop > 100 ? "nf_swiper_gradient_upward_scroll" : "nf_swiper_gradient_upward"
          }
        >
          {this.loaderRenderIcon(scrollTop > 100 ? "backScroll" : "back")}
        </div>
        {videoSrc ? (
          <Video
            src={videoSrc}
            type="mp4"
            height="420px"
            width="750px"
            poster={_datas.videoPoster}
          />
        ) : (
          <LazyloadImage
          
          imgProps={{
            className:"no_video_img",
            src:_datas.videoPoster
          }}
         />
        )}
        {this.loaderRenderBanner()}
        {this.loaderRenderProduct()}
        <MoreRecommended _moreRecommendedKey={_datas.moreRecommendedKey} />
      </div>
    );
  }
  // 生成第一个banner
  loaderRenderBanner() {
    const { _datas } = this.props;
    return (
      <AnyImagesRender
        _className="nf_swiper_detail-banner"
        _mini={_datas.banner_mini}
        _origin={_datas.banner_orign}
      />
    );
  }
  // 循环生成产品数据
  loaderRenderProduct() {
    const { _datas } = this.props;
    const item = _datas.details.map((data, index) => {
      return (
        <div className="nf_swiper_detail_product" key={`nf_swiper_detail_product_${index}`}>
          <AnyImagesRender
            _className="nf_swiper_detail_product-banner"
            _mini={data.bannerUrl_mini}
            _origin={data.bannerUrl_orign}
          />
          {this.loaderRenderProductList(data.productList)}
          <a href={_datas.linkmore} className="nf_swiper_detail_product_more">
            查看更多
          </a>
        </div>
      );
    });
    return <div>{item}</div>;
  }
  // 循环生成产品数据list
  loaderRenderProductList(datas) {
    return <ImgAnimation _datas={datas} />;
  }

  render() {
    return (
      <div className="nf_swiper_details-con">
        <CurrentComponentCommonTop />
        {this.loaderRenderItems()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    $nichefragrance: state.nichefragrance,
    scrollTop: state.view.SCROLL_TOP,
  };
};

export default connect(mapStateToProps, {
  getCCVideo,
  nicheFragranceChangeDetails,
})(NicheFragranceDetail);
