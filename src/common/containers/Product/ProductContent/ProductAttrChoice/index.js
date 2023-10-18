/*
 * @Author: Leo.Si
 * @Date: 2020-07-24 11:01:46
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Tu 03:48:01
 * @function pdp 页面展示选择规格
 */
import React, { PureComponent } from "react";
import { Consumer } from "@/layout/LayoutContext";
import LazyloadImage from "@/components/LazyloadImage";
import ProductPopupInfo from "./ProductPopupInfo";

class ProductAttrChoice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ProductButton: null,
    };
  }

  componentDidMount() {
    require.ensure([], () => {
      this.setState({
        ProductButton: require("../ProductButton").default,
      });
    });
  }

  render() {
    const {
      _productData,
      _callback,
      _specs,
      _recordNowNumber,
      _name,
      _lipStickOnOff,
      _lipStickOnOff2,
      _lipStickOnOff3,
      milliseconds,
      QCPTQ,
      _tabIndex,
      _ifComment
    } = this.props;
    const { ProductButton } = this.state;
    const name = _productData.sku.inventory === 1 ? "all" : _name;
    return (
      <Consumer>
        {({ getImageSrcByIsSupportWeb, isSupportWebp }) => {
          return (
            <div className="product-attr-choice">
              <div className="product-attr-choice-content">
                <div className="product-attr-choice-content-top">
                  <LazyloadImage
                    imgProps={{
                      src: `${_productData.sku && _productData.sku.defaultImage}180x180.jpg`,
                      style: { width: "1.8rem", height: "1.8rem" }
                    }}
                   />
                  <div className="product-attr-choice-content-top-cont">
                    {/* <h1>
                      {_productData.sku.brandEN}
                      {_productData.sku.productNameCN}
                    </h1> */}

                    <ProductPopupInfo {..._productData} />
                  </div>
                  {/* <div className="product-attr-choice-content-top-bottom">
                    {_productData.sku &&
                      _productData.sku.isShowTags &&
                      _productData.sku.tags.map((item, index) => (
                        <i
                          key={`product-tags-${index}`}
                          className={`product-tags product-tags-choice ${item.key}`}
                        >
                          {item.value}
                        </i>
                      ))}
                    <span className="product-attr-choice-content-top-skuCode">{`货号:<${
                      _productData.sku && _productData.sku.skuCode
                    }>`}</span>
                  </div> */}
                  <em
                    className="product-attr-choice-close"
                    onClick={_callback && _callback.bind(this, "closeAttrChoice")}
                  >
                    <img className="product-close-icon" src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_black.png" alt="" />
                  </em>
                </div>
                <div className="product-attr-choice-content-inner">
                  <div className="attr-con">
                    <div className="attr-con-head">
                      {/* <span>{_specs.title}</span> */}
                      <span>商品规格</span>
                      {/* <p>
                        <em>已选</em>
                        <label>
                          {_productData.sku &&
                            _productData.sku.saleAttr &&
                            _productData.sku.saleAttr.value}
                        </label>
                      </p> */}
                    </div>
                    <div className="attr-con-list">
                      {/* {_specs && _specs.embedId && (
                        <div style={{ width: "100%" }}>
                          <div id="findation-widget-button" />
                        </div>
                      )} */}
                      {_specs &&
                        _specs.saleAttrs &&
                        _specs.saleAttrs.map((item, index) => {
                          const { skuId, status } = item;
                          let _classname =
                            status && status === "NO_INV" ? "attr-con-list-item-noInv" : "";
                          if (skuId === _productData.sku.skuId)
                            _classname += " attr-con-list-item-now";
                          return (
                            <div
                              key={`attr-con-list-${index}`}
                              className={`attr-con-list-item ${_classname}`}
                              onClick={_callback && _callback.bind(this, "changeAttr", skuId)}
                            >
                              {item.image && !item.color && (
                                <img
                                  src={getImageSrcByIsSupportWeb(item.image, isSupportWebp)}
                                />
                              )}
                              {item.color && <em style={{ background: item.color }} />}
                              {item.value && <label>{item.value}</label>}
                              { !item.image && !item.color && !item.value && <div/>}
                            </div>
                          );
                        })}
                      {_specs && _specs.colorSeriesNum > 0 && (
                        <span
                          className="attr-choice-all-colors"
                          onClick={
                            _callback &&
                            _callback.bind(this, "pickColors", {
                              productId: _productData.sku && _productData.sku.productId,
                              skuId: _productData.sku && _productData.sku.skuId,
                            })
                          }
                        >{`查看全部${_specs.colorSeriesNum}种色号 >`}</span>
                      )}
                    </div>
                  </div>
                  <div className="product-attr-choice-content-number">
                    <div>
                      
                     <span>购买数量</span>
                      <span> {_productData.sku.limitCount > 0 &&`(每人限购${_productData.sku.limitCount}件)`}</span>
                    </div>
                    <p>
                      <em
                        className={
                          name == "reduce" || name == "all" ? "number-reduce cur" : "number-reduce"
                        }
                        onClick={_callback && _callback.bind(this, "countNum", "reduce")}
                      />
                      <em className="number">{_recordNowNumber}</em>
                      <em
                        className={
                          name == "plus" || name == "all" ? "number-plus cur" : "number-plus"
                        }
                        onClick={_callback && _callback.bind(this, "countNum", "plus")}
                      >
                        +
                      </em>
                    </p>
                  </div>
                </div>
               
              </div>
              {_lipStickOnOff && _lipStickOnOff.isShow && (
                  <div
                    className="product-attr-choice-lipStick"
                    onClick={() => (window.location.href = _lipStickOnOff.link)}
                  >
                    <img src={getImageSrcByIsSupportWeb(_lipStickOnOff.imagePath, isSupportWebp)} />
                  </div>
                )}
                {_lipStickOnOff2 && _lipStickOnOff2.isShow && (
                  <div
                    className="product-attr-choice-lipStick"
                    onClick={() => (window.location.href = _lipStickOnOff2.link)}
                  >
                    <img
                      src={getImageSrcByIsSupportWeb(_lipStickOnOff2.imagePath, isSupportWebp)}
                    />
                  </div>
                )}
                {_lipStickOnOff3 && _lipStickOnOff3.isShow && (
                  <div
                    className="product-attr-choice-lipStick"
                    onClick={() => (window.location.href = _lipStickOnOff3.link)}
                  >
                    <img
                      src={getImageSrcByIsSupportWeb(_lipStickOnOff3.imagePath, isSupportWebp)}
                    />
                  </div>
                )}
              {ProductButton ? (
                <ProductButton
                  _productData={_productData}
                  milliseconds={milliseconds}
                  QCPTQ={QCPTQ}
                  _callback={_callback}
                  _tabIndex={_tabIndex}
                  _ifComment={_ifComment}
                />
              ) : null}
            </div>
          );
        }}
      </Consumer>
    );
  }
}
export default ProductAttrChoice;
