import React from "react";
import EnterVisualArea from "./enterVisualArea";
import Swiper from "react-id-swiper";
import LazyloadImage from "@/components/LazyloadImage";

class ImgAnimation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimation: false,
      isOutSide: false,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isEnter !== this.props.isEnter && nextProps.isEnter) {
      this.setState({
        isAnimation: true,
      });
    }
    if (nextProps.isOuter !== this.props.isOuter && nextProps.isOuter) {
      this.setState({
        isOutSide: true,
      });
    }
  }
  render() {
    const { isAnimation, isOutSide } = this.state;
    const { _datas } = this.props;
    const params = {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    };
    if (isOutSide) {
      const loaderRender = (
        <Swiper {...params}>
          {_datas.map((item, index) => (
            <div
              className="nf_swiper_detail_product-list-con"
              key={`nf_swiper_detail_product-list-con-${index}`}
            >
              <a
                href={item.link}
                className="nf_swiper_detail_product-list"
                key={`loaderRenderProductList-${index}`}
              >
                <LazyloadImage
                  imgProps={{
                    src: item.imagePath,
                  }}
                 />
                <p className="nf_swiper_detail_product-name">{item.name}</p>
                <p className="nf_swiper_detail_product-description">
                  {item.description}
                </p>
              </a>
            </div>
          ))}
        </Swiper>
      );
      return loaderRender;
    } else {
      return (
        <div className="ceshi">
          <LazyloadImage
            imgProps={{
              className: `img_normal  ${isAnimation ? "img_animaion" : ""}`,
              src: _datas[0].imagePath,
            }}
           />
        </div>
      );
    }
  }
}

export default EnterVisualArea(ImgAnimation);
