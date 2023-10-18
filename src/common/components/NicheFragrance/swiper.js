import React, { Component } from "react";
import { connect } from "react-redux";
import LazyloadImage from "@/components/LazyloadImage";
import loadable from "@loadable/component";

import {
  nicheFragranceChangeIndex,
  nicheFragranceChangeDetails,
} from "../../actions/nichefragrance";

const SwiperWrap = loadable.lib(() => import("react-id-swiper"));

const params = {
  effect: "cube",
  grabCursor: true,
  WrapperEl: "section",
  lazy: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
};
class NicheFragranceSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientHeight: 0,
    };
    this.loaderRenderIcon = this.loaderRenderIcon.bind(this);
    this.activeHandleClick = this.activeHandleClick.bind(this);
    this.loaderRenderPagination = this.loaderRenderPagination.bind(this);
  }
  componentDidMount() {
    this.setState({
      clientHeight: window.document.documentElement.clientHeight,
    });
  }
  loaderRenderIcon(iconType) {
    switch (iconType) {
      case "back":
        return (
          <i
            className="nf_swiper_back"
            onClick={this.loaderRenderIconEvent.bind(this, iconType)}
          >
            <LazyloadImage
              imgProps={{
                src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/back.png",
              }}
             />
          </i>
        );
      case "shared":
        return (
          <i className="nf_swiper_shared">
            <LazyloadImage
              imgProps={{
                src: "https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shared.png",
              }}
             />
          </i>
        );
      default:
        return null;
    }
  }

  loaderRenderIconEvent(iconType) {
    switch (iconType) {
      case "back":
        return history.go(-1);
      default:
        return false;
    }
  }

  loaderRenderPagination(index) {
    // const { _datas } = this.props
    return (
      <i className="nf_swiper_pagination">
        {index === 0 ? null : <em className="nf_swiper_pagination-left" />}
        {/* {(index + 1) === (_datas && _datas.length) ? null : <em className='nf_swiper_pagination-right' />} */}
        <em
          className={`nf_swiper_pagination-right ${
            index === 0
              ? "nf_swiper_pagination_animation  nf_swiper_pagination-right-black"
              : ""
          }`}
        />
      </i>
    );
  }

  activeRenderButton() {
    return <div />;
  }

  activeHandleClick(idx) {
    const { nicheFragranceChangeIndex, nicheFragranceChangeDetails } =
      this.props;
    if (idx !== undefined) {
      nicheFragranceChangeIndex(idx);
      nicheFragranceChangeDetails(true);
    }
  }
  render() {
    const { _datas, $nichefragrance } = this.props;
    const { PRELOADIMG } = $nichefragrance;
    const { clientHeight } = this.state;
    return (
      <div className="nf_swiper_items_container">
        <SwiperWrap>
          {({ default: Swiper }) => {
            return (
              <Swiper {...params}>
                {_datas.map((data, idx) => {
                  return (
                    <div
                      className="posr nf_swiper_items"
                      key={idx}
                      style={{
                        height: clientHeight,
                        width: "100vw",
                        backgroundImage: `url(${data._origin})`,
                        backgroundSize: "100% auto",
                        backgroundColor: data.bgColor,
                      }}
                    >
                      <div className="nf_swiper_gradient_upward">
                        {this.loaderRenderIcon("back")}
                      </div>
                      <div
                        className={`nf_swiper_brandgroup_light_colour  ${
                          data.isLightColour ? "" : "nf_swiper_brandgroup"
                        }`}
                      >
                        <div className="nf_swiper_brand">
                          <LazyloadImage
                            imgProps={{
                              src: data._logo,
                            }}
                           />
                        </div>
                        <div className="nf_swiper_des">
                          <LazyloadImage
                            imgProps={{
                              src: data._intro,
                            }}
                           />
                        </div>
                        <div
                          className="nf_swiper_brand_button"
                          onClick={this.activeHandleClick.bind(this, idx)}
                        >
                          {PRELOADIMG.includes(idx) ? (
                            <i href="#">查看详情</i>
                          ) : (
                            <i className="nf_swiper_brand_button_loading" />
                          )}
                        </div>
                      </div>
                      {this.loaderRenderPagination(idx)}
                    </div>
                  );
                })}
              </Swiper>
            );
          }}
        </SwiperWrap>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    $nichefragrance: state.nichefragrance,
  };
};

export default connect(mapStateToProps, {
  nicheFragranceChangeIndex,
  nicheFragranceChangeDetails,
})(NicheFragranceSwiper);
