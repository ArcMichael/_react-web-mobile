/*
 * @Author: Leo.Si
 * @Date: 2020-07-14 10:09:26
 * @Last Modified by: cathy.peng
 * @Last Modified time: 2020-11-Mo 04:34:25
 * @function PDP 页面当中展示默认选择的商品
 */
import React from "react";
import { Consumer } from "@/layout/LayoutContext";
import { findColorNumber } from "@/actions/product";
const ProductDefaultSelection = ({ _productData, _VBList, _callback }) => {
  let emb = !!_productData.sku && _productData.sku.embedId;
  if (emb) {
      findColorNumber();
  }
  let showVB = [];
  let sum = 0;
  if (_VBList) {
    const { gifts, mainSkus } = _VBList;

    if (gifts && gifts.length > 0) {
      gifts.map((item) => {
        item.showText = "赠品";
      });
      showVB = [...gifts];
    }
    if (mainSkus && mainSkus) {
      mainSkus.map((item) => {
        item.showText = "主品";
      });
      showVB = [...mainSkus, ...showVB];
    }
    showVB.map(it => {
      sum = it.number + sum
    })
  }
  return (
    <Consumer>
      {({ getImageSrcByIsSupportWeb, isSupportWebp }) => {
        console.log(_productData.sku.saleAttr);
        return (
          !!_productData &&
          _productData.sku &&
          _productData.sku.status &&
          _productData.sku.status != "OFF" && (
            <div className="product-info-default-selection">
              <div>
                <span className="product-info-title">规格</span>
              </div>
              <div className="product-attr-box">
                <div
                  className="product-label-box"
                  onClick={_productData.attrChoiceFun}
                >
                  
                  {_productData.sku &&
                    _productData.sku.saleAttr &&
                    _productData.sku.saleAttr.value ? (
                      <label className={"more-spec"}>
                        <span> 已选：</span>
                        {_productData.sku &&
                        _productData.sku.saleAttr &&
                        _productData.sku.saleAttr.color && (
                          <em
                            style={{ background: _productData.sku.saleAttr.color }}
                          />
                        )}
                        {_productData.sku.saleAttr.image &&
                          !_productData.sku.saleAttr.color && (
                            <img
                              className="default-selection-img"
                              src={getImageSrcByIsSupportWeb(
                                _productData.sku.saleAttr.image,
                                isSupportWebp
                              )}
                            />
                          )}
                        <span className="spec-text">
                          {_productData.sku.saleAttr.value}
                        </span>
                      </label>
                    ): <label className={"more-spec"} />}
                  {_productData.sku.moreSpec && (
                    <img
                      className="pdp-more"
                      src={getImageSrcByIsSupportWeb(
                        "https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png",
                        isSupportWebp
                      )}
                    />
                  )}
                </div>
                {showVB && showVB.length > 0 && (
                  <div className="vb-box-over">
                    <ul
                      className="vb-box"
                      style={{overflowX:'scroll'}}
                      onClick={
                        _callback &&
                        _callback.bind(this, "productVBDetailsPopup", {
                          skuCode:
                            _productData &&
                            _productData.sku &&
                            _productData.sku.skuCode,
                        })
                      }
                    >
                      {showVB.map((item) => {
                        return (
                          <li>
                            <img
                              className="small-shop"
                              src={
                                item.showText == "赠品"
                                  ? item.defaultImage
                                  : item.image + "150x150.jpg"
                              }
                              alt=""
                            />
                            <div className="small-text">{item.showText}</div>
                          </li>
                        );
                      })}

                      {showVB && showVB.length > 0 && (
                        <li className="vb-number">
                          <div>共{sum}件</div>
                          <img
                            className="pdp-more"
                            src={getImageSrcByIsSupportWeb(
                              "https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png",
                              isSupportWebp
                            )}
                          />
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {!!emb && (
                  <div className="color-help">
                    <div>
                      帮你找色号
                      <div id="findation-widget-button" />
                    </div>
                    <img
                      className="pdp-more"
                      src={getImageSrcByIsSupportWeb(
                        "https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png",
                        isSupportWebp
                      )}
                    />
                  </div>
                )}
              </div>

              {/* <div className="moreSpec">{_productData.sku.moreSpec}</div> */}
            </div>
          )
        );
      }}
    </Consumer>
  );
};

export default ProductDefaultSelection;