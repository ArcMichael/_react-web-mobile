import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import Supports from "@/lib/Supports";

/**
 * @typedef {import('react-lazyload').LazyLoadProps} LazyLoadProps
 */

/**
 * @typedef {{
 *  imgProps: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
 *  shape?:'horizontal-rect' | 'vertical-rect' | 'square' | 'circle',
 *  loadingType:'loading' | 'smalltype';
 *  resize?:boolean;
 *  once?:boolean;
 * } & LazyLoadProps} LazyloadImageProps
 */

/**
 * @extends {React.PureComponent<LazyloadImageProps>}
 */
export default class LazyloadImage extends PureComponent {
  /** @type {LazyLoadProps} - description */
  static InitLazyLoad = {
    height: 350,
    offset: 0,
    debounce: 200,
  };
  static ErrorImage =
    "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_50x50.jpg";
  static LoadingImage =
    "https://ssl1.sephorastatic.cn/soa/nmobile/img/product_loading.gif";
  static propTypes = {
    imgProps: PropTypes.object.isRequired,
  };
  static defaultProps = {
    shape: "square",
  };

  /**
   * 获取webp的Image Url
   * @param {string} src
   */
  static GetWebpSrcBySrc(src) {
    if (!src) {
      return "";
    }
    if (src.match(/\?.*f=webp/)) {
      return src;
    }
    if (src.match(/\?.*/)) {
      return `${src}&f=webp`;
    }
    return `${src}?f=webp`;
  }

  isSupportWebp = false;

  constructor(props) {
    super(props);
    this.handleError = this.handleError.bind(this);
    this.getTrueSrc = this.getTrueSrc.bind(this);
    this.getLoadingSrc = this.getLoadingSrc.bind(this);
    const support = new Supports();
    this.isSupportWebp = support.isSupportWebp;
    this.state = {
      error: false,
      src: this.getTrueSrc(
        props.imgProps && props.imgProps.src ? props.imgProps.src : ""
      ),
    };
  }

  componentDidMount() {}

  /**
   *
   * @param {LazyloadImageProps} nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.imgProps.src !== this.props.imgProps.src) {
      const newSrc = this.getTrueSrc(nextProps.imgProps.src);
      this.setState({
        error: false,
        src: newSrc,
      });
    }
  }
  /**
   * @param {string} src
   */
  getTrueSrc(src) {
    return this.isSupportWebp ? LazyloadImage.GetWebpSrcBySrc(src || "") : src;
  }

  /**
   * @param {string} src
   */
  getLoadingSrc(src) {
    if (src && this.props.loadingType === "smalltype") {
      if (src.match(/\?.*/)) {
        return `${src}&q=10`;
      } else {
        return `${src}?q=10`;
      }
    }
    return LazyloadImage.LoadingImage;
  }

  /**
   * @param {React.SyntheticEvent<HTMLImageElement, Event>} event
   */
  handleError(event) {
    const { imgProps } = this.props;
    const { onError } = imgProps;
    this.setState({
      error: true,
    });
    if (onError) {
      onError(event);
    }
  }

  render() {
    const { imgProps, shape, loadingType, ...lazyloadProps } = this.props;
    const { src, onError, ...restImgProps } = imgProps;
    const { error, src: trueSrc } = this.state;
    const loadingsrc = this.getLoadingSrc(trueSrc);

    if (src) {
      return (
        <LazyLoad
          {...LazyloadImage.InitLazyLoad}
          placeholder={
            loadingType ? (
              <img src={loadingsrc} {...restImgProps} />
            ) : (
              <img
                className={`${shape} loading-img`}
                src={loadingsrc}
                {...restImgProps}
              />
            )
          }
          {...lazyloadProps}
        >
          <img
            src={error ? LazyloadImage.ErrorImage : trueSrc}
            onError={this.handleError}
            alt=""
            {...restImgProps}
          />
        </LazyLoad>
      );
    }
    return <img src="" alt="" {...restImgProps} />;
  }
}
