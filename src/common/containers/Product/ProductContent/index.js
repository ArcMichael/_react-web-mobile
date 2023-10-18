/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 10:18:02
 * @Last Modified by: cathy.peng
 * @Last Modified time: 2020-11-Th 02:43:03
 * @function product page container
 */
import React from "react";
// import Swiper from "@/components/DynamicSwiper";
// import GoogleAnalytics from "@/Utils/GoogleAnalytics";
import isBrowser from "@/Utils/utils/isBrowser";
import { GetSingleCookie } from "@/lib/Tools";
import ProductButton from "./ProductButton";
import ProductTab from "./ProductTab";
import HeroBannerClickPopup from "./HeroBannerClickPopup";
import ProductTabContentInfo from "./ProductTabContent/ProductTabContentInfo";
// import ProductTabContentDetail from "./ProductTabContent/ProductTabContentDetail";
import ProductTabContentEvaluation from "./ProductTabContent/ProductTabContentEvaluation";
import ProductAttrChoice from "./ProductAttrChoice";
// import NewTabBottom from './ProductTab/NewTabBottom'
// const isNotInIframe = () => {
//   if (isBrowser()) {
//     return window.self === window.top;
//   }
//   return false;
// };

class ProductContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      Token: null,
      commentList:null
    };
    this.swiper = null;
    this.getSwiper = this.getSwiper.bind(this);
    this.tabScroll = this.tabScroll.bind(this);
    // this.bindHandleScroll = this.throttle(this.bindHandleScroll, 300);
    this.bindHandleScroll = this.bindHandleScroll.bind(this)
    this._changeTab = this._changeTab.bind(this)
    this.setCommentList = this.setCommentList.bind(this)
  }
  componentDidMount() {
    this.props._callback("recordSwiper", this.swiper);
    window.addEventListener('scroll', this.bindHandleScroll)
    // this.props._callback("tabClickfun", {
    //   _mySwiper: this.swiper,
    //   nowIndex: 2,
    // });

    const Token = GetSingleCookie(document.cookie, "Token")
    console.log(Token,"Token")
    this.setState({
      Token
    })

  }
  setCommentList(commentList){
    this.setState({
      commentList
    })
  }

  componentDidUpdate() {
    if (this.swiper) {
      this.swiper.update();
    }
  }

  throttle = (fn) => {
    let valid = true
    const context = this

    return function() {
      if (!valid) return
      valid = false

      const args = arguments

      fn.apply(context, args)

      setTimeout(() => {
        valid = true
      }, 1000);
    }
  }

  bindHandleScroll() {
    let index = this.state.activeIndex;
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const brandTop = document.getElementById('brandPage') && document.getElementById('brandPage').offsetTop - 57 || 0;
    const productTop = document.getElementById('productPage') && document.getElementById('productPage').offsetTop - 57 || 0;
    const recommendTop = document.getElementById('recommendPage') && document.getElementById('recommendPage').offsetTop - 57 || 0;
    if(scrollTop < brandTop){
      index = 0
    }
    else if(scrollTop >= brandTop && scrollTop < productTop){
      index = 1
    }
    else if(scrollTop >= productTop && ( recommendTop ==0 || (scrollTop < recommendTop) )){
      index = 2
    }
    else if(scrollTop >= recommendTop && recommendTop > 0 ){
      index = 3
    }
    if(index !== this.state.activeIndex){
      this.setState({
        activeIndex: index
      })
    }
  }

  tabScroll(index) {
    if(index == 0){
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      document.getElementById('ProductTabContentInfo').style.height='initial';
      document.getElementById('ProductTabContentEvaluation').style.height='0';
    }else if(index === 1 && document.getElementById('brandPage')){
      let brandTop = document.getElementById('brandPage').offsetTop || 0;
      brandTop = brandTop - 56
      document.body.scrollTop = brandTop
      document.documentElement.scrollTop = brandTop
    }else if(index === 2 && document.getElementById('productPage')){
      let brandTop = document.getElementById('productPage').offsetTop || 0;
      brandTop = brandTop - 56
      document.body.scrollTop = brandTop
      document.documentElement.scrollTop = brandTop
    }else if(index === 3 && document.getElementById('recommendPage')){
      let brandTop = document.getElementById('recommendPage').offsetTop || 0;
      brandTop = brandTop - 46
      document.body.scrollTop = brandTop
      document.documentElement.scrollTop = brandTop
    }
    this.setState({activeIndex: index})
    this.props._callback("tabClickfun", {
      _mySwiper: this.swiper,
      nowIndex: index,
    });
  }

  _changeTab(){
    this.setState({
      activeIndex: 4
    })
    document.getElementById('ProductTabContentInfo').style.height='0';
    document.getElementById('ProductTabContentEvaluation').style.height='initial';
  }

  getSwiper() {
    if (isBrowser()) {
      const { _callback, _productData, _otherData } = this.props;
      const index = _productData.tab.tabIndex
      // const $this = this;
      // const notInIframe = isNotInIframe();
      // const params = {
      //   lazy: true,
      //   autoHeight: true,
      //   observer: true,
      //   observeParents: true,
      //   observeSlideChildren: true,
      //   allowSlideNext: notInIframe,
      //   allowSlidePrev: notInIframe,
      //   allowTouchMove: notInIframe,
      //   noSwipingSelector:
      //     ".product-info-recommend-list.cantslide,.product-info-ranking-list.cantslide",
      //   on: {
      //     slideChange: function () {
      //       _callback("tabClickfun", {
      //         _mySwiper: this.swiper,
      //         nowIndex: this.activeIndex,
      //       });
      //       $this.setState({
      //         activeIndex: this.activeIndex,
      //       });
      //       let type = "商品";
      //       if (this.activeIndex == 1) {
      //         type = "详情";
      //       } else if (this.activeIndex == 2) {
      //         type = "评价";
      //       }
      //       GoogleAnalytics.pushV2({
      //         event: "productDetailInteraction",
      //         // pdpInteractionDetail: type,
      //         pdpInteractionType: type,
      //       });
      //     },
      //   },
      // };
      // if(this.state.activeIndex === 4){
        return <div className="product-container-box ">
          {/* 商品页 */}
          <div id="ProductTabContentInfo" style={{overflow:'hidden', height: index !== 4 ? "initial" : '0'}}>
            <ProductTabContentInfo
              _productData={_productData.productInfo}
              _heroTab={_productData.heroTab}
              _commentList={this.state.commentList}
              _callback={_callback}
              _otherData={_otherData}
              _mySwiper={{activeIndex: 0}}
              _details={_productData.details}
              _ranking={_productData.ranking}
              _promotionTags={_productData.promotionTags}
              _promotionFast={_productData.promotionFast}
              _VBList={_productData.VBList}
              _changeTab={this._changeTab}
              _Token={this.state.Token}
            />
          </div>

          <div id="ProductTabContentEvaluation" style={{overflow:'scroll',height: index == 4 ? "initial" : '0'}}>
            {
              _productData &&
              _productData.productInfo &&
              _productData.productInfo.sku &&
              _productData.productInfo.sku.productId && <ProductTabContentEvaluation
              _callback={_callback}
              _productData={_productData.commentList}
              _view={_otherData.view}
              isActive={true}
              swiper={this.swiper}
              setCommentList={this.setCommentList}
              productId={
                _productData &&
                _productData.productInfo &&
                _productData.productInfo.sku &&
                _productData.productInfo.sku.productId
              }
            />
            }
          </div>
        </div>
      // }
      // return (
      //   <Swiper
      //     {...params}
      //     ref={(node) => {
      //       if (node) this.swiper = node.swiper;
      //     }}
      //   >
      //     <div className="product-container-box ">
      //       {/* 商品页 */}
      //       <ProductTabContentInfo
      //         _productData={_productData.productInfo}
      //         _heroTab={_productData.heroTab}
      //         _commentList={_productData.commentList}
      //         _callback={_callback}
      //         _otherData={_otherData}
      //         _mySwiper={this.swiper}
      //         _details={_productData.details}
      //         _ranking={_productData.ranking}
      //         _promotionTags={_productData.promotionTags}
      //         _VBList={_productData.VBList}
      //       />
      //     </div>
      //     <div className="product-container-box ">
      //       详情页
      //       <ProductTabContentDetail
      //         _callback={_callback}
      //         _productData={_productData.details}
      //         isActive={this.state.activeIndex === 1}
      //        />
      //     </div>
      //     <div className="product-container-box ">
      //       评论页
      //       <ProductTabContentEvaluation
      //         _callback={_callback}
      //         _productData={_productData.commentList}
      //         _view={_otherData.view}
      //         isActive={this.state.activeIndex === 2}
      //         swiper={this.swiper}
      //         productId={
      //           _productData &&
      //           _productData.productInfo &&
      //           _productData.productInfo.sku &&
      //           _productData.productInfo.sku.productId
      //         }
      //        />
      //     </div>
      //   </Swiper>
      // );
    }
    return <div />;
  }

  componentWillUnmount() {
    if (this.swiper) {
      this.swiper.destroy();
    }
    window.removeEventListener('scroll', this.bindHandleScroll);
  }
  render() {
    const { _callback, _productData, _otherData } = this.props;
    return (
      <div className="product-container">
        <ProductTab
          _callback={this.tabScroll}
          _callbackMore={_callback}
          _productData={_productData.tab}
          // _otherData={_otherData}
          _mySwiper={this.swiper}
          tabIndex={this.state.activeIndex}
        />
        {/* {_productData.tab.tabMore&&<NewTabBottom 
          _callbackMore={_callback}
          _productData={_productData.tab}
          
        />} */}
        {_productData.productInfo.sku ? (
          <HeroBannerClickPopup
            heroTab={_productData.heroTab}
            _view={_otherData.view}
            _callback={_callback}
            _productData={_productData.productInfo.sku.richImages}
          />
        ) : null}
        {this.getSwiper()}
        {_productData &&
          _productData.productInfo &&
          _productData.productInfo.saleChannel && (
            <div
              id="product-special-sale-channel"
              className="product-special-sale-channel"
            >
              <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/NoticeOpenIcon.png" />
              <span>{_productData.productInfo.saleChannel}</span>
            </div>
          )}
        {ProductButton &&
          !(_otherData && _otherData.specs && _otherData.specs.showOrHide) && (
            <ProductButton
              _productData={_productData.productInfo}
              milliseconds={_productData.milliseconds}
              QCPTQ={_productData.QCPTQ}
              _callback={_callback}
              _tabIndex={_productData.tab.tabIndex}
              _ifComment={_otherData.ifComment}
            />
          )}
        {_otherData &&
          _otherData.specs &&
          _otherData.specs.showOrHide &&
          ProductAttrChoice && (
            <ProductAttrChoice
              _callback={_callback}
              _productData={_productData.productInfo}
              _recordNowNumber={_otherData.recordNowNumber}
              _name={_otherData.name}
              showOrHide={_otherData.specs.showOrHide}
              _specs={_otherData.specs.source}
              _lipStickOnOff={_otherData.lipStickOnOff}
              _lipStickOnOff2={_otherData.lipStickOnOff2}
              _lipStickOnOff3={_otherData.lipStickOnOff3}
              _tabIndex={_productData.tab.tabIndex}
              _ifComment={_otherData.ifComment}
              QCPTQ={_productData.QCPTQ}
              milliseconds={_productData.milliseconds}
            />
          )}
      </div>
    );
  }
}

export default ProductContent;
