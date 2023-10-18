/*
 * @Author: Martin.song
 * @LastEditors: fancy.chen
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-10-15 14:31:33
 * @LastEditTime: 2021-08-19 15:32:44
 */
import React from "react";

import LazyloadImage from "@/components/LazyloadImage";
import Sensor from "@/Utils/sensor/index"; //'../../Utils/sensor/index'// 埋点
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import getConfigs from "isomorphisms/getConfigs";
import { LocationToH5 } from "../../../../lib/MPTools";
import { WeChatPath } from "../../util";

// const ITEMHIEGHT = 108
let height = 0; //标题高度
let heightTitle = 0; //标题高度
export default class CouponsList extends React.Component {
  constructor(props) {
    super(props);
    const config = getConfigs();
    this.state = {
      current: 0,
      tagObj: {
        hot: `${config.static}/soa/nmobile/img/tag-hot.png`,
        new: `${config.static}/soa/nmobile/img/tag-fullnew.png`,
        online: `${config.static}/soa/nmobile/img/tag-online.png`,
        gold_card: `${config.static}/soa/nmobile/img/tag-gold.png`,
        black_card: `${config.static}/soa/nmobile/img/tag-black.png`,
        black_gold: `${config.static}/soa/nmobile/img/tag-black-gold.png`,
        redeem_nearly_end: `${config.static}/soa/nmobile/img/tag-finish.png`,
      },
    };
    this.exchangeHandler = this.exchangeHandler.bind(this);
    this.showDetail = this.showDetail.bind(this);
    this.hashTo = this.hashTo.bind(this);
    // this.handleScroll = this.handleScroll.bind(this);
  }
  // 兑换详情;
  exchangeHandler(item) {
    // 埋点 有相关参数就传给给埋点
    const { brandId } = this.props;
    Sensor.go("pointMall_hp_click", {
      coupon_name: item.title,
      coupon_ID: item.id,
      button_name: "兑换",
    });
    const brand = brandId ? `?brandId=${brandId}` : "";
    window.location.href = WeChatPath(
      `/v2/html/exchangeDetail/${item.id}${brand}`
    );
  }

  hashTo(tab, index) {
    const { frozen } = this.props;
    const tabdom = document.querySelector(`#navagat_${tab}`);
    // let pretab = document.querySelectorAll(".currentnavigationRow");
    // pretab[0] && pretab[0].classList.remove("currentnavigationRow");
    tabdom.scrollIntoView();
    let top = tabdom.offsetTop;
    let donationHeight = 44; //积分商城入口高度
    if (frozen) {
      bodyScrollTop.set(top - height - donationHeight);
    } else {
      bodyScrollTop.set(top - height - height - heightTitle - donationHeight);
    }

    this.setState({ current: index });
  }
  componentDidMount() {
    height =
      document.getElementsByClassName("scoreHeader")[0] &&
      document.getElementsByClassName("scoreHeader")[0].offsetHeight;
    heightTitle =
      document.getElementsByClassName("title")[0] &&
      document.getElementsByClassName("title")[0].offsetHeight;
  }

  // 查看详情;
  showDetail(item) {
    let url;
    // 品牌积分进入查看详情时不应该有赚积分按钮
    if (this.props.brandId) {
      url = WeChatPath(
        `/v2/html/exchangeDetail/${item.id}?brandId=${this.props.brandId}`
      );
    } else {
      url = WeChatPath(`/v2/html/exchangeDetail/${item.id}`);
    }
    LocationToH5(url);
  }
  render() {
    const { content, optional, frozen, brandId } = this.props;
    const { current, tagObj } = this.state;

    return (
      <div className="ExchangeList">
        <div className="title"> 积分兑换 </div>
        {brandId === null ? (
          <div className={frozen ? "frozenstyle tabs" : "tabs"}>
            <ul>
              {optional &&
                optional.map((item, index) => {
                  return (
                    <li
                      className="navigationRow"
                      key={item + "_" + index}
                      onClick={() => {
                        this.hashTo(item, index);
                      }}
                    >
                      <a
                        className={
                          current === index ? "currentnavigationRow" : ""
                        }
                        onClick={() => {
                          this.hashTo(item, index);
                        }}
                        href="javascript:void(0)"
                      >
                        {item}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : null}
        <div className="list">
          {content &&
            content.map((list, index) => {
              return (
                <div
                  key={`navagat_${index}`}
                  className="navagat_Tab"
                  id={`navagat_${optional[index]}`}
                >
                  <ul>
                    {list &&
                      list.map((item, index) => {
                        // item.stockStatus=0
                        return (
                          <li
                            className="proBoxBorder"
                            key={item.id + "_" + index}
                          >
                            <div
                              className="proBox"
                              onClick={() => {
                                // if (item.convertible === 1 && item.stockStatus === 1) {
                                //
                                // }
                                this.exchangeHandler(item);
                              }}
                            >
                              <div className="proPic">
                                {/* 库存为0正在补货 */}
                                {item.stockStatus === 0 && (
                                  <div className="dim">
                                    <div className="dimtxt"> 正在补货 </div>
                                  </div>
                                )}
                                {item.stockStatus === 0 && (
                                  <LazyloadImage
                                    imgProps={{
                                      src: item.imageUrl + "S.jpg",
                                      width: "1.6rem",
                                      height: "1.6rem",
                                      alt: "bottom icon",
                                      style: {
                                        opacity: "0.3",
                                      },
                                    }}
                                  />
                                )}
                                {item.stockStatus !== 0 && (
                                  <LazyloadImage
                                    imgProps={{
                                      src: item.imageUrl + "S.jpg",
                                      alt: "",
                                      width: "1.6rem",
                                      height: "1.6rem",
                                    }}
                                  />
                                )}
                                {/* <img src={item.imageUrl+"120x120.jpg"}/> */}
                              </div>
                              <div className="proDesp">
                                <div className="pro-info">
                                  {item.tag&&item.tag.length>0&&<div className="tag-list" >
                                    {item.tag&&Array.isArray(item.tag)&&item.tag.length>0&&item.tag.map((tag) => {
                                      return <img src={tagObj[tag]} />;
                                    })}
                                  </div>
                                  }
                                  {(item.convertible === 0 ||
                                    item.stockStatus === 0) && (
                                    <p className="convertiblecampaigName">
                                      {item.title}
                                    </p>
                                  )}
                                  {item.convertible !== 0 &&
                                    item.stockStatus !== 0 && (
                                      <p className="campaigName" >
                                        {item.title}
                                      </p>
                                    )}
                                </div>
                                <div className="proBtn">
                                  {item.convertible === 1 &&
                                    item.stockStatus === 1 && (
                                      <a
                                        className="btn"
                                        onClick={() => {
                                          this.exchangeHandler(item);
                                        }}
                                      >
                                        兑换
                                      </a>
                                    )}
                                  {/* 库存为0 或积分不够不能兑换 ，只能查看详情 */}
                                  {(item.convertible === 0 ||
                                    item.stockStatus === 0) && (
                                    <a
                                      className="outOfStock"
                                      onClick={() => {
                                        this.showDetail(item);
                                      }}
                                    >
                                      查看详情
                                    </a>
                                  )}
                                  {item.marginIntegral && (
                                    <span className="marginScore">
                                      差 {item.marginIntegral}
                                      积分
                                    </span>
                                  )}
                                  {!item.marginIntegral && (
                                    <span className="scoreNormal">
                                      需 {item.integral}
                                      积分
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
