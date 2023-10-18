import React, { Component } from "react";
import DataLink from "@/components/Atoms/DataLink";
import LazyloadImage from "@/components/LazyloadImage";
import Supports from "@/lib/Supports";
import Utils from "@/lib/utils";
import loadable from "@loadable/component";

const SwiperWrap = loadable.lib(() => import("react-id-swiper"));

const params = {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  shouldSwiperUpdate: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: true,
  lazy: true,
};

/**
 * @typedef {{
 * dataSource?:import('@/lib/services/Mpcms').ImageCommonDetail[];
 * type:import('@/containers/HomeB/TabCommonContent').TabKeyType;
 * height:number | string;
 * width:number | string;
 * paginationStyle?: Partial<{
 *  height:string | number;
 *  width:string | number;
 *  top:number;
 *  left:number;
 *  bottom:number;
 *  right:number;
 * }>;
 * }} CarouselProps
 */

/**
 * @extends {React.Component<CarouselProps>}
 */
class Carousel extends Component {
  static defaultProps = {
    dataSource: [],
  };
  constructor(props) {
    super(props);
    this.getBannerItems = this.getBannerItems.bind(this);
    this.handleGetNodes = this.handleGetNodes.bind(this);

    this.state = {
      nodes: [],
      swiperParams: {},
    };
  }

  SwiperRef = null;

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    Utils.afterPageShow().then(() => {
      if (this.isMounted) {
        this.setState({
          swiperParams: params,
        });
      }
    });
    this.handleGetNodes();
  }
  componentWillUnmount() {
    this.isMounted = false;
  }

  /**
   * @param {CarouselProps?} nextProps
   */
  handleGetNodes(nextProps) {
    if (!this.isMounted) {
      return;
    }
    const { dataSource, type } = nextProps || this.props;
    const support = new Supports();
    support.register().then(() => {
      const nodes = this.getBannerItems({
        isSupportWebp: support.isSupportWebp,
        dataSource,
        type,
      });
      this.setState({
        nodes,
      });
    });
  }

  /**
   *
   * @param {CarouselProps} nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.dataSource) !==
      JSON.stringify(this.props.dataSource)
    ) {
      this.handleGetNodes(nextProps);
    }
  }

  /**
   *
   * @param {object} params
   * @param {boolean} params.isSupportWebp
   * @param {CarouselProps['dataSource']} params.dataSource
   * @param {CarouselProps['type']} params.type
   */
  getBannerItems(params) {
    const { height } = this.props;
    const { dataSource, type, isSupportWebp } = params;

    return dataSource.map((image, i) => {
      if (image) {
        const src = isSupportWebp
          ? LazyloadImage.GetWebpSrcBySrc(image.image)
          : image.image;
        return (
          <div key={`${i}`} style={{ height, overflow: "hidden" }}>
            <DataLink
              _Href={image.link}
              _Omniture={image.trackingCode}
              _Sensor={{
                eventKey: "clickBanner_App_Mob",
                value: {
                  platform_type: "mobile",
                  system_type: "",
                  environment_type: "",
                  vip_card: "",
                  vip_card_type: "",
                  action_id: "1000001_006",
                  page_id: "MB_1000001",
                  $title: "首页",
                  page_type_detail: "",
                  page_type: "",
                  $url_path: "",
                  $url_query: "",
                  $url: "",
                  current_url: "",
                  banner_current_url: "home",
                  banner_current_page_type: "home",
                  
                  banner_content: image.text,
                  banner_belong_area: type ? `${type}_Hero` : "Select_Hero",
                  banner_to_url: image.link,
                  banner_to_page_type: image.link,
                  banner_ranking: i + 1,
                  campaign_code: image.trackingCode,
                },
              }}
              _Style={{ height: "100%" }}
            >
              <img
                src={src}
                alt={"banner hero"}
                style={{ height: "100%", width: "100%" }}
              />
            </DataLink>
          </div>
        );
      }
      return <div key={`${i}`} style={{ height }} />;
    });
  }

  render() {
    return (
      <SwiperWrap>
        {({ default: Swiper }) => (
          <Swiper
            ref={(ref) => (this.SwiperRef = ref)}
            shouldSwiperUpdate
            rebuildOnUpdate
            {...this.state.swiperParams}
          >
            {this.state.nodes}
          </Swiper>
        )}
      </SwiperWrap>
    );
  }
}

export default Carousel;
