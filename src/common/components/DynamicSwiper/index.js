import React, { Component } from "react";
import Dynamic from "@/Utils/Dynamic";

/**
 * react-id-swiper 1.6.7 props
 * @typedef {{
 * ContainerEl	        :string;	//  'div'	            Element type for container
 * containerClass	    :string;	//  swiper-container	Swiper container class name
 * WrapperEl	        :string;	//  'div'	            Element type for wrapper
 * wrapperClass	        :string;	//  swiper-wrapper	    Swiper wrapper class name
 * slideClass	        :string;	//  swiper-slide	    Swiper slide class name
 * shouldSwiperUpdate	:boolean;	//  false	            Update swiper when component is updated
 * rebuildOnUpdate	    :boolean;	//  false	            Rebuild swiper when component is updated
 * noSwiping	        :boolean;	//  false	            Disable swiping by condition
 * activeSlideKey	    :string;	//  null	            Initial slide index
 * renderPrevButton	    :Function;	//  	                Render props function for prev button
 * renderNextButton	    :Function;	//  	                Render props function for next button
 * renderScrollbar	    :Function;	//  	                Render props function for scrollbar
 * renderPagination	    :Function;	//  	                Render props function for pagination
 * renderParallax		:Function;	//                      Render props function for parallax
 * }} ReactIdSwiper
 */

/**
 * react-id-swiper 依赖swiper 4.3.5
 * {@link https://github.com/nolimits4web/Swiper/blob/Swiper4/API.md}
 * @typedef {{
 *  [K:string]:any;
 * }} SwiperProps
 */

/**
 * @typedef {ReactIdSwiper & SwiperProps} DynamicSwiperProps
 */

/**
 * @extends {React.Component<DynamicSwiperProps>}
 */
export default class DynamicSwiper extends Component {
  state = {
    Swiper: null,
  };
  swiper = null;
  isMounted = false;
  componentDidMount() {
    this.isMounted = true;
    const dynamic = new Dynamic();
    dynamic.reactSwipperId().then((Swiper) => {
      if (this.isMounted) {
        this.setState({
          Swiper: Swiper.default,
        });
      }
    });
  }
  componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
    const { Swiper } = this.state;
    if (Swiper) {
      return (
        <Swiper
          ref={(ref) => {
            if (ref) {
              this.swiper = ref.swiper;
            }
          }}
          {...this.props}
         />
      );
    }
    return <div />;
  }
}
