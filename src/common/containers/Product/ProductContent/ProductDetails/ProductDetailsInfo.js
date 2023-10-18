/*
 * @Author: Leo.Si
 * @Date: 2020-07-03 17:47:46
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-10 10:35:46
 * @function 展示PDP页面 详情-->商品详情--> 产品描述、产品功效、主要成分、产地
 */
import React from "react";
import $ from "jquery";
import ProductDetailsText from "./ProductDetailsText";
// import ProductDetailsSpecs from "./ProductDetailsSpecs";

let showTimes = 0;
class ProductDetailsInfo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      more: false
    }
  }

  componentDidMount() {
    const { _productData } = this.props;
    console.log(_productData,"_productData");
    // _productData.aemUrl ====> true/false
    // _productData.mobileHtml ====> https://stagem.sephora.cn/wcsstore/Dragon/html/productsm/OP983253/OP983253.html
    if (!!_productData  && _productData.aemUrl) {
      if(_productData.mobileHtml){
        // aem图文详情
        this.aemDetailRender();
      }
    } else {
      // php返回的图文详情
      if (!!_productData && _productData.graphicDetails) {
        this.detailRender();
      }
    }
  }

  componentDidUpdate() {
    const { _productData } = this.props;
    if (!!_productData  && _productData.aemUrl) {
      if(!!_productData && _productData.mobileHtml) {
        // aem图文详情
        this.aemDetailRender();
      }
    } else {
      // php返回的图文详情
      if (!!_productData && _productData.graphicDetails) {
        this.detailRender();
      }
    }
  }

  aemDetailRender(){
    const { _productData } = this.props;
    let graphicDetails = $(".product-details-graphicDetails");
    if(!!_productData && _productData.mobileHtml && _productData.aemUrl && _productData.aemDom && !graphicDetails.children().length) {
      let html = _productData.aemDom;
      // graphicDetails.append(html);
      graphicDetails.html(html);
      // let clientWidth = $("#root").width();
      // let scale = clientWidth / 750;
      // $(".product-details-graphicDetails").css({
      //   zoom: scale,
      // });
      showTimes += 1;
    }
  }

  detailRender() {
    const { _productData } = this.props;
    let graphicDetails = $(".product-details-graphicDetails");
    if (!showTimes || (!graphicDetails.children().length && graphicDetails)) {
      let html = _productData.graphicDetails;
      graphicDetails.append(html);
      let clientWidth = $("#root").width();
      let scale = clientWidth / 750;
      $(".product-details-graphicDetails").css({
        zoom: scale,
      });
      showTimes += 1;
    }
  }
  render() {
    const { _productData } = this.props;
    // const more = this.state.more;
    let more = false;
    let productLength = 0;
    if(_productData && _productData.detailsInfo){
      _productData.detailsInfo.map((item) => {
        if (item.value) {
          productLength = productLength + 1;
        }
      })
    }
    if(this.state.more !== true){
      const moreLength = productLength + (_productData.skuAttrDtos && _productData.skuAttrDtos.length || 0)
      if(moreLength > 5){
        more = true
      }
    }
    
    
    return (
      !!_productData && (
        <div>
          <ul className="product-details-info">
            {_productData &&
              _productData.detailsInfo &&
              _productData.detailsInfo.map((item, index) => {
                const { key, value } = item;
                let vals = [];
                if (value) {
                  let splitVal = value.split("\n");
                  splitVal.forEach((val, ind) => {
                    if (splitVal.length === ind + 1) {
                      vals.push(val);
                    } else {
                      vals.push(val);
                      vals.push(<br />);
                    }
                  });
                }
                return value && ( (more && index <= 4) || !more ) ? (
                  <li
                    className={`${_productData.graphicDetails ? "haveline" : ""}`}
                    key={`product-details-info-${index}`}
                  >
                    <span>{key}</span><div>{vals}</div>
                  </li>
                ) : null;
              })}
              {
                  _productData && _productData.skuAttrDtos && _productData.skuAttrDtos.map((item, index) => {
                      const { attrLabel, attrValue } = item
                      return ( (more && (productLength + index) < 5) || !more ) ? <li key={`product-details-specs-${index}`}>
                          <span>{`${attrLabel}`}</span>
                          {`${attrValue}`}
                      </li> : null
                  })
              }
              { more && <p className="product-details-info-more">
                  <span onClick={() => this.setState({more : true})}>展开全部</span>
                </p>}
          </ul>
          {(_productData && _productData.graphicDetails) || (_productData && _productData.aemUrl && _productData.mobileHtml) ? (
            <div className="product-details-graphicDetails" />
          ) : null}
          <ProductDetailsText />
        </div>
      )
    );
  }
}

export default ProductDetailsInfo;
