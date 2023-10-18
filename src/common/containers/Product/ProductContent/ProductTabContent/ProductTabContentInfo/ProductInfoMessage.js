/*
 * @Author: Leo.Si
 * @Date: 2020-07-07 14:17:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-19 09:58:23
 * @function product page 展示 品牌中文名、品牌英文名、推荐理由
 */
import React from "react";
import getUniqId from "@/Utils/utils/getUniqId";
import Utils from "@/lib/utils";
import ProductMessageTags from "@/components/PlpPage/ProductMessageTags";
import ProductRoleActivity from "./ProductRoleActivity";
import ProductRanking from "./ProductRanking";
import PreSaleDetails from "./PreSaleDetails";
import ProductVipActivity from "./ProductVipActivity";
const ProductInfoMessage = ({ _productData, _ranking, _callback, _Token }) => {
  let priceMain = [],
    priceSecondRow = [];
  if (!_productData) return null;
  if (_productData.preSaleActivity) {

    // 无预计到手价时展示原价
    // priceMain.push(
    //   <span key={getUniqId()} className="product-info-message-price preSale">
    //     <em>{_productData.preSaleActivity.preSalePriceName || _productData.preSaleActivity.originPriceName}</em>
    //     {/* {_productData.recombination && _productData.recombination.price} */}
    //     {_productData.recombination && _productData.recombination.price
    //       ? `￥${_productData.recombination.price}`
    //       : `￥${_productData.recombination.oldPrice}`}
    //   </span>
    // );
    priceMain.push(
      <span key={getUniqId()} className="product-info-message-price">
        {`￥${_productData.recombination && _productData.recombination.oldPrice}`}
      </span>
    );
  } else {
    priceMain.push(
      <span key={getUniqId()} className="product-info-message-price">
        {`￥${_productData.recombination && _productData.recombination.price}`}
      </span>
    );
  }
  if (
    !_productData.preSaleActivity &&
    _productData.recombination &&
    _productData.recombination.oldPrice
  ) {
    priceSecondRow.push(
      <span key={getUniqId()} className="product-info-message-oldPrice product-info-message-customPrice">
        <i>{"￥" + _productData.recombination.oldPrice}</i>
      </span>
    );
  }
  // if (
  //   _productData.preSaleActivity &&
  //   _productData.recombination &&
  //   _productData.recombination.oldPrice
  // ) {
  //   let content = (
  //     <span
  //       key={getUniqId()}
  //       className={`product-info-message-preSaleCostPrice oldPrice`}
  //     >
  //       非活动价
  //       <i>{"￥" + _productData.recombination.oldPrice}</i>
  //     </span>
  //   );
  //   // if (priceMain.length > 1) {
  //   if (_productData.recombination.price) {
  //     // 有预计到手价展示非活动价
  //     priceSecondRow.push(content);
  //   }
  //   // } else {
  //   //   priceMain.push(content);
  //   // }
  // }
  if (
    _productData.recombination &&
    _productData.recombination.customPrice
  ) {
    priceSecondRow.push(
      <span key={getUniqId()} className="product-info-message-customPrice">
        {_productData.recombination.customPrice}{_productData.recombination &&
    _productData.recombination.discountRatePercent && ","}
      </span>
    );
  }
  if (
    _productData.recombination &&
    _productData.recombination.discountRatePercent
  ) {
    priceSecondRow.push(
      <span
        key={getUniqId()}
        className="product-info-message-discount"
      >{`优惠折扣${_productData.recombination.discountRatePercent}`}</span>
    );
  }
  // if (
  //   _productData.preSaleActivity &&
  //   _productData.preSaleActivity.earnestMoneyName &&
  //   _productData.preSaleActivity.earnestMoney
  // ) {
  //   priceSecondRow.push(
  //     <span key={getUniqId()} className="product-info-message-preSaleCostPrice">
  //       <i> {_productData.preSaleActivity.earnestMoneyName} </i>
  //       <em>￥</em>
  //       {_productData.preSaleActivity.earnestMoney}
  //     </span>
  //   );
  // }
  return (
    <div className="product-info-detail">
      {(_productData.roleActivity||_productData.seckillActivityDto) && (
        <ProductRoleActivity
          key={Utils.uniqIdGenerator()}
          _productData={_productData}
          _callback={_callback}
        />
      )}

      {
        _productData?.wholePreSaleActivity?.deliveryTime && <div className="product-info-message-yushou">
          全额预售商品，预计{_productData?.wholePreSaleActivity?.deliveryTime}日起发货
        </div>
      }
      {_productData.preSaleActivity && (
        <div className="product-promotion-presale">
          <PreSaleDetails
            _productData={_productData}
            _recombination={_productData.recombination}
            _callback={_callback}
            _Token={_Token}
          />
        </div>
      )}
      {_productData.vipActivity && (
        <ProductVipActivity
          key={Utils.uniqIdGenerator()}
          _callback={_callback}
          _productData={_productData.vipActivity}
        />
      )}
      <div className="product-info-message">
        <div className="product-info-message-box">
          <div className="product-info-message-row">{priceMain}</div>
          {priceSecondRow && priceSecondRow.length > 0 && (
            <div className="product-info-message-row two">{priceSecondRow}</div>
          )}
          {/* {_ranking && _ranking.length ? (
            <ProductRanking
              _data={_ranking}
              OP_code={_productData.sku && _productData.sku.productId}
            />
          ) : null} */}
        </div>
        {/* <div className="product-coupon">
          <p>6张优惠券可用</p>
          <img
            className="pdp-more"
            src="​https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png"
            alt=""
          />
        </div> */}
        <p className="product-info-name">
          {/* {_productData.sku &&
            _productData.sku.isShowTags &&
            _productData.sku.tags.map((item, index) => (
              <i
                key={`product-tags-${index}`}
                className={`product-tags ${item.key}`}
              >
                {item.value}
              </i>
              
            ))} */}
          <ProductMessageTags
            tags={
              _productData.sku &&
              _productData.sku.isShowTags &&
              _productData.sku.tags
            }
          />
          <span className="product-info-message-productNameEN">
            {_productData.sku && _productData.sku.brandEN}
          </span>
          <span className="product-info-message-productNameCN">
            {_productData.vipActivity && _productData.vipActivity.prefix && (
              <span>【{_productData.vipActivity.prefix}】</span>
            )}
            {_productData.sku && _productData.sku.productNameCN}
          </span>
        </p>

        {_productData.sku && _productData.sku.recommendReason && (
          <p className="product-info-message-recommendReason">
            {_productData.sku.recommendReason}
          </p>
        )}

          {_ranking && _ranking.length ? (
            <ProductRanking
              _data={_ranking}
              OP_code={_productData.sku && _productData.sku.productId}
            />
          ) : null}
        {/* {_productData.deliveryTime && (
          <span className="product-info-message-deliveryTime">
            <label>{_productData.deliveryTime}</label>
          </span>
        )} */}
        {/* 正品标签 */}
        <div className="salable-tags">
          <img src="https://sslstage1.sephorastatic.cn/soa/nmobile/img/guarantee-good.png" />
          <span>顺丰EMS速达</span>
          <span>丰富礼赠</span>
          <span>无忧退款</span>
          <span>安全支付</span>
        </div>
      </div>
    </div>
  );
};
export default ProductInfoMessage;