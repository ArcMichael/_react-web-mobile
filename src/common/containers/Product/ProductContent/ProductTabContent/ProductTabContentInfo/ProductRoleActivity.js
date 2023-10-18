/*
 * @Author: Leo.Si 
 * @Date: 2020-07-09 16:47:17 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-24 17:01:49
 * @function 当黑金卡活动开启时展示对应的信息（roleActivity）
 */

import React, { PureComponent } from "react";
import { GetSingleCookie } from "@/lib/Tools";
import CountDown from "./CountDown";
const seckillDesc=["inProgress","sellOut","suspend"] //需要展示倒计时
class ProductRoleActivity extends PureComponent {
  render() {
    const { _productData, _callback } = this.props;
    if (_productData && _productData.seckillActivityDto&&_productData.seckillActivityDto.status!="ended") {
      console.log(_productData.seckillActivityDto);
      return (
        <div
          className="product-info-role-activity"
          style={{
            backgroundImage: `url(${_productData.bannerImage1})`,
            backgroundSize: "cover",
          }}
        >
          <div className="product-info-seckill">
            <div className="seckill-left">
              <div className="seckill-price-name">
                {_productData.seckillActivityDto.priceName}
              </div>
              <div className="seckill-price">
                {"¥"+_productData.seckillActivityDto.price}
              </div>
            </div>
            {/* 预热 */}
            
           {_productData.seckillActivityDto.status=="preheat"&&<div className="seckill-right">
              <div className="seckill-pre">{_productData.seckillActivityDto.preheatContent}</div>
            </div>
            } 
            {/* 倒计时 */}
            {_productData.seckillActivityDto.countDownDto&&seckillDesc.indexOf(_productData.seckillActivityDto.status)!=-1 && (
              <div>
                <p>{_productData.seckillActivityDto.countDownDto.name}</p>
                <p>
                  <CountDown
                    precision={_productData.seckillActivityDto.countDownDto.precision}
                    endTime={
                      _productData.seckillActivityDto.countDownDto.milliseconds
                    }
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      !!_productData && (
        <div
          className="product-info-role-activity"
          style={{
            backgroundImage: `url(${_productData.bannerImage1})`,
            backgroundSize: "cover",
          }}
        >
          <div className="product-info-role-activity-left">
            {_productData.roleActivity.price && (
              <div className="product-info-role-activity-price">
                {`￥${_productData.roleActivity.price}`}
              </div>
            )}
            {
              GetSingleCookie(document.cookie, "Token") ? _productData.roleActivity.priceName && <div className="product-info-role-activity-name">
                <span>{_productData.roleActivity.priceName}</span>
                {_productData.roleActivity.desc && (
                  <span
                    className="product-info-role-activity-name-icon"
                    onClick={
                      _callback &&
                      _callback.bind(
                        this,
                        "roleActivity",
                        _productData.roleActivity.desc
                      )
                    }
                  >?</span>
                )}
              </div> : <div className="product-info-role-activity-name"><span>登录后展示更多优惠</span></div>
            }
            
          </div>

          {_productData.roleActivity.countDown && (
            <div>
              <p>{_productData.roleActivity.countDown.name}</p>
              <p>
                <CountDown
                  precision={2}
                  endTime={
                    _productData.roleActivity.countDown &&
                    _productData.roleActivity.countDown.milliseconds
                  }
                />
              </p>
            </div>
          )}
        </div>
      )
    );
  }
}
export default ProductRoleActivity;