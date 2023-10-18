/*
 * @Author: Leo.Si
 * @Date: 2020-07-28 10:15:17
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Tu 02:28:17
 * @function 定金预售展示的相关逻辑
 */
import React from "react";
import { GetSingleCookie } from "@/lib/Tools";
import CountDown from "./CountDown";
const PreSaleDetails = ({ _productData, _callback }) => 
  !!_productData && (
    <div className="product-info-presale">
      <div
        className="product-info-presale-activity"
        style={{ backgroundImage: `url(${_productData.bannerImage1})`,backgroundSize:"cover", display: `${_productData.bannerImage1 ? 'flex':'none'}`}}
      >
        <div className="product-info-presale-activity-left">
          <div className="product-info-presale-activity-price">
          { _productData.preSaleActivity.preSalePrice ? _productData.preSaleActivity.preSalePriceName :  _productData.preSaleActivity.originPriceName}
            <span>
              {(_productData.preSaleActivity.preSalePrice &&
                _productData.preSaleActivity.preSalePrice) ||
                (_productData.preSaleActivity.originPrice &&
                  _productData.preSaleActivity.originPrice)}
            </span>
          </div>
          {
            ((_productData.RoleActivity && _productData.RoleActivity.price &&  _productData.preSaleActivity?.preSalePrice) || 
            !GetSingleCookie(document.cookie, "Token") || (GetSingleCookie(document.cookie, "Token") && _productData.preSaleActivity.preSalePrice))
            && <div className="product-info-presale-activity-desc">
              {/* 尾款立减，是非必填项  尾款立减=原价-定金-促销优惠金额（RoleActivityDto.price 是非必填项) */}
              {
                GetSingleCookie(document.cookie, "Token") ? _productData.preSaleActivity?.preSalePrice && <span>{_productData.preSaleActivity.earnestMoneyName}{_productData.preSaleActivity.earnestMoney}, 尾款立减 
                {(_productData.preSaleActivity.originPrice - _productData.preSaleActivity.preSalePrice).toFixed(2)}</span> : <span>登录后展示更多优惠</span>
              }
              {_productData.RoleActivity && _productData.RoleActivity.price &&  _productData.preSaleActivity?.preSalePrice
                ? `，尾款立减${
                    _productData.originPrice -
                    _productData.earnestMoney -
                    _productData.RoleActivity.price
                  }`
                : ""}
            </div>
          }
        </div>
        {/* { _productData?.wholePreSaleActivity?.deliveryTime ? <CountDown
                  precision={2}
                  endTime={
                    _productData.roleActivity.countDown &&
                    _productData.roleActivity.countDown.milliseconds
                  }
                /> : <span>{ _productData.bannerDesc1}</span>
                  } */}
        {
          _productData.preSaleActivity && _productData.bannerDesc1 && <div className="product-info-presale-progress-text-yushou">
            { _productData.bannerDesc1 }
          </div>
        }
        {/* 非定金预售显示倒计时 */}
        {!_productData.preSaleActivity && (
          <div>
            {/* <p>{_productData.preSaleActivity.countDown.name}</p> */}
            <p>距结束还剩</p>
            <p>
              <CountDown
                precision={2}
                endTime={
                  _productData.preSaleActivity.countDown &&
                  _productData.preSaleActivity.countDown.milliseconds
                }
              />
            </p>
          </div>
        ) }
      </div>
      {_productData &&
      _productData.preSaleActivity &&
      _productData.preSaleActivity.startTime ? (
        <div className="product-info-presale-progress">
          <div className="product-info-presale-left">
            <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pre-sale-progress.png" />
          </div>
          <div className="product-info-presale-right">
            <div>
              <p>
                定金 <span>￥{_productData.preSaleActivity.earnestMoney}</span>
              </p>
              <p>{`支付定金时间：${_productData.preSaleActivity.startTime}~${_productData.preSaleActivity.endTime}`}</p>
            </div>
            <div>
              <p>
                尾款
                <span>
                  ￥
                  {_productData.preSaleActivity.preSalePrice ? 
                    (_productData.preSaleActivity.preSalePrice - _productData.preSaleActivity.earnestMoney).toFixed(2)
                    : (_productData.preSaleActivity.originPrice - _productData.preSaleActivity.earnestMoney).toFixed(2)
                  }
                </span>
              </p>
              <p>{`支付尾款时间：${_productData.preSaleActivity.tailPayStartTime}~${_productData.preSaleActivity.tailPayEndTime}`}</p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="product-info-presale-rule">
        <div>{_productData.preSaleActivity.deliveryTime}</div>
        <div
          className="product-info-presale-rule-right"
          onClick={
            _callback &&
            _callback.bind(
              this,
              "presaleActivity",
              _productData.preSaleActivity.rule
            )
          }
        >
          <img
            className="pdp-rule-icon"
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/alert_circle.png"
          />
          <span>预售规则</span>
          <img
            className="pdp-more-icon"
            src="https://sslstage1.sephorastatic.cn/soa/mobile/images/pdp/pdp-more.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
export default PreSaleDetails;