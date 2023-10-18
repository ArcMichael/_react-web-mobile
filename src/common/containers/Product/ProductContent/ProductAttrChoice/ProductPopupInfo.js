import React from "react";
import ProductMessageTags from "@/components/PlpPage/ProductMessageTags";

const ProductPopupInfo = ({ preSaleActivity, sku, recombination, bannerImage1 }) => {
  let node = (
    <div className="categoryshop_bot">
      <p className="commonFontPrice">
        <span>¥{sku.price}</span> 
        <ProductMessageTags tags={ sku && sku.isShowTags && sku.tags } />
      </p>
    </div>
  );
  let discountRate = null;
  if (recombination && recombination.discountRatePercent) {
    discountRate = (
      <div className="custom_price_name" style={{ marginRight: "0px" }}>
        优惠折扣{recombination.discountRatePercent}
      </div>
    );
  }
  if (preSaleActivity) {
    const { preSalePriceName } = preSaleActivity;
    node = (
      <div className="product-info-message-row">
        <p className="product-info-message-youhui-preSale">
          定金 <span><i>￥</i>{preSaleActivity.earnestMoney}</span>
          <ProductMessageTags tags={ sku && sku.isShowTags && sku.tags } />
        </p>
        
        <div style={{ paddingTop: ".05rem" }}>
          <span className="product-info-message-price-yushou">
            <em>{preSalePriceName}</em>
            <i>￥</i>
            {recombination && recombination.price
              ? recombination.price
              : recombination.oldPrice}
          </span>
        </div>
        <div className="product-info-message-row two">
          {recombination && recombination.price && (
            <span className={`product-info-message-preSaleCostPrice oldPrice`}>
              非活动价
              <i>{"￥" + recombination.oldPrice}</i>
            </span>
          )}
          {/* <span className="product-info-message-preSaleCostPrice">
            <i> {preSaleActivity.earnestMoneyName} </i>
            <em>￥</em>
            {preSaleActivity.earnestMoney}
          </span> */}
        </div>
      </div>
    );
  } else {
    node = (
      <div className="categoryshop_bot">
        <p className="commonFontPrice">
          <span style={{color: bannerImage1 ? "#dd0031" : "#000"}}>¥{sku.price}</span> 
          <ProductMessageTags tags={ sku && sku.isShowTags && sku.tags } />
        </p>
        {recombination.oldPrice && (
          <div className="oldPrice">¥{recombination.oldPrice}</div>
        )}
        {recombination.customPrice && (
          <div className="custom_price_name">{recombination.customPrice}，</div>
        )}
        {discountRate}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, width: "1px" }}>
      {node}
      <p className="product-attr-choice-selected">
        <span>
          <em>已选 </em>
          <label>{sku && sku.saleAttr && sku.saleAttr.value}</label>
        </span>
        <span className="product-attr-choice-content-top-skuCode">{`货号:<${
          sku && sku.skuCode
        }>`}</span>
      </p>
    </div>
  );
};
export default ProductPopupInfo;
