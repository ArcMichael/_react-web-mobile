/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 15:54:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Fr 11:16:44
 * @function 展示商品的基础信息
 */
import React from "react";
import Utils from "@/lib/utils";
import GuseeYouLike from "@/components/PlpPage/GuessYouLike";
import { GetSingleCookie } from "@/lib/Tools";
import ProductInfoImg from "./ProductInfoImg";
import ProductInfoMessage from "./ProductInfoMessage";
import PromotionDetails from "./PromotionDetails";
// import ProductVBDetails from "./ProductVBDetails";
import ProductDefaultSelection from "./ProductDefaultSelection";
import ProductBrandInfo from "./ProductBrandInfo";
import ProductBeautyPost from "./ProductBeautyPost";
import ProductComment from "./ProductComment";
import ProductRecommendation from "./ProductRecommendation";
import ProductConsulting from "./ProductConsulting";
import ProductDetails from "../../ProductDetails";
// import ProductVipActivity from "./ProductVipActivity";

const ProductTabContentInfo = ({
  _productData,
  _otherData,
  _commentList,
  _callback,
  _mySwiper,
  _details,
  _heroTab,
  _ranking,
  _promotionTags,
  _promotionFast,
  _VBList,
  _changeTab,
}) => {
  const getContent = () => {
    const content = [];
    const _Token = GetSingleCookie(document.cookie, "Token") || null;
    if (_productData) {
      // content.push(
      //   <ProductInfoMessage
      //     key={Utils.uniqIdGenerator()}
      //     _productData={_productData}
      //     _callback={_callback}
      //     _ranking={_ranking}
      //     _Tokne={_Token}
      //   />
      // );
      // if (_productData.vipActivity) {
      //   content.push(
      //     <ProductVipActivity
      //       key={Utils.uniqIdGenerator()}
      //       _callback={_callback}
      //       _productData={_productData.vipActivity}
      //     />
      //   );
      // }

      content.push(
        <ProductDefaultSelection
          key={Utils.uniqIdGenerator()}
          _productData={_productData}
          _callback={_callback}
          _VBList={_VBList}
        />
      );
      // if (_productData.sku && _productData.sku.vbmsg) {
      //   content.push(
      //     <ProductVBDetails
      //       key={Utils.uniqIdGenerator()}
      //       _callback={_callback}
      //       _productData={_productData}
      //     />
      //   );
      // }
      if (
        _productData.sku &&
        _productData.sku.hasPromotion &&
        _promotionTags &&
        _promotionTags.length
      ) {
        content.push(
          <PromotionDetails
            key={Utils.uniqIdGenerator()}
            _callback={_callback}
            _productData={_productData}
            _promotionTags={_promotionTags}
          />
        );
      }
      // _promotionFast
      if (_promotionFast && _promotionFast.length > 0) {
        content.push(
          <div className="product-info-freight">
            <div className="product-info-title">运费</div>
            <div style={{ width: "100%" }}>
              {_promotionFast.map((item, index) => {
                if (index < 2) {
                  return (
                    <div
                      className="product-info-freight-desc"
                      key={item + index}
                    >
                      {item}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      }
    }
    return (
      <div
        style={{
          minHeight: content.length === 0 ? `${10}rem` : "auto",
        }}
      >
        {_productData && (
          <ProductInfoMessage
            key={Utils.uniqIdGenerator()}
            _productData={_productData}
            _callback={_callback}
            _ranking={_ranking}
            _Tokne={_Token}
          />
        )}
        <div
          style={{
            width: "7.02rem",
            margin: "0 auto",
            borderRadius: "0.24rem",
            overflow: "hidden",
          }}
        >
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="product-info">
      <ProductInfoImg
        _richImages={
          _productData && _productData.sku && _productData.sku.richImages
        }
        _heroTab={_heroTab}
        _callback={_callback}
        _mySwiper={_mySwiper}
        _hasVB={_productData && _productData.sku && _productData.sku.hasVB}
        _productData={_productData}
      />
      {getContent()}
      <ProductComment
        productId={
          _productData && _productData.sku && _productData.sku.productId
        }
        _commentList={_commentList}
        _callback={_callback}
        _mySwiper={_mySwiper}
        _changeTab={_changeTab}
      />
      {_otherData && _otherData.beautyPosts && (
        <ProductBeautyPost _otherData={_otherData.beautyPosts} />
      )}
      <div className="product-info-radius">
        <ProductBrandInfo _productData={_productData} _callback={_callback} />
        {_otherData &&
          _otherData.recommend &&
          _otherData.recommend.recommendProductDtoList &&
          _otherData.recommend.recommendProductDtoList.length > 0 && (
            <ProductRecommendation _recommend={_otherData.recommend} />
          )}
      </div>

      <ProductConsulting
        _consulation={_otherData.consulation}
        _callback={_callback}
      />
      <ProductDetails
        _callback={_callback}
        _productData={_details}
        _mySwiper={_mySwiper}
        _className="noPadding"
      />
      {/* 相关商品 */}
      <div id="recommendPage">
        <GuseeYouLike
          _title="推荐"
          type="search"
          listTitle="我的订单:"
          listType="Guess You Like_OrderList"
        // logic="CART_MOBILE,l:20,o:0"
        />
      </div>
    </div>
  );
};

export default ProductTabContentInfo;