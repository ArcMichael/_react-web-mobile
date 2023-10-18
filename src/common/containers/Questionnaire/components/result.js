/* eslint-disable import/extensions */
/* eslint-disable global-require */
import React, { Component } from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import Swiper from "react-id-swiper";
import LazyloadImage from "@/components/LazyloadImage";
import { popupAlert } from "@/actions/popup";
import * as action from "../../../lib/BLL";
import { urlGetParams } from "../../../lib/url";
import * as device from "../../../lib/device";

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/default.scss");
  require("../../../../public/style/questionnaire.scss");
}

const params = {
  direction: "horizontal",
  autoplay: false,
  loop: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true
  },
};

// 热搜词列表页
class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultDto: null,
      luckInfo: null,
      share: false,
      hasAddress: false,
      qualification: null
    }
    this.handleBegin = this.handleBegin.bind(this)
    this.seeProduct = this.seeProduct.bind(this)
    this.closeTask = this.closeTask.bind(this)
    this.getDetails = this.getDetails.bind(this)
    this.clickShare = this.props.clickShare
    this.again = this.again.bind(this)
    this.shareCLick = this.shareCLick.bind(this)
    this.seeProductInfo = this.seeProductInfo.bind(this)
    this.clickAddress = this.clickAddress.bind(this)
    this.addressDteail = this.addressDteail.bind(this)
  }

  componentDidMount(){
    this.getDetails()
    this.props.onRef(this);
  }

    // 查看地址
    addressDteail(){
      this.setState({
        hasAddress: true
      });
    }
  
    // 新增地址
    clickAddress(){
      let host = "https://m.sephora.cn",
      env = this.props.getRunEnv();
      if (env === "stage") {
        host = "https://stagem.sephora.cn";
      } else if (env === "ebf") {
        host = "https://ebfm.sephora.cn";
      }
      // const { popupAlert } = this.props;
      const { luckInfo } = this.state;
      if (luckInfo && luckInfo.lotteryEnd) {
        if (luckInfo && luckInfo.lotteryAddressDto) {
        } else {
          this.props.setValue({ popupTitle : "活动已结束" })
        }
      } else {
        const lotteryId = this.state.resultDto.lotteryId
        const wid = urlGetParams(window.location,"id")
        if (device.device_inMiniProgramsEnvironment()) {
          wx.miniProgram.navigateTo({
            url: `/sp/web?nto=1&nui=1&url=${encodeURIComponent(
              `${host}/myAccount/address?id=${lotteryId}&type=quest&wid=${wid}&token=${urlGetParams(window.location,"token")}&step=3`
            )}`,
          });
        } else {
          window.location.href = `/myAccount/address?id=${lotteryId}&type=quest&wid=${wid}`;
        }
      }
    }

  getDetails(){
    const qualification = this.state.qualification
    action.getAnswerResult(urlGetParams(window.location, "id"), (res) => {
      if(res.jQueryStatus.status === 200){
        this.setState({
          resultDto: res.results,
          qualification: qualification == null ? res.results.qualification : qualification
        })
      }
    })
  }

  // 抽奖 getLuck
  handleBegin(){
    const awardId = urlGetParams(window.location, "id")
    action.getLuck(this.state.resultDto.lotteryId, awardId ,(res) => {
      if(res.jQueryStatus.status === 200 && res.results){
        this.setState({
          luckInfo: res.results
        })
        this.getDetails()
      }else { 
        this.getDetails()
        this.props.setValue({ popupTitle : res.errorMessage })
      }
    })
  }

  // 查看产品
  seeProduct(){
    action.seePrize(this.state.resultDto.lotteryId, (res) => {
      if(res.jQueryStatus.status === 200){
        // window.location.href = res.results.prizeForwardUrl
        if (device.device_inMiniProgramsEnvironment()) {
          wx.miniProgram.navigateTo({
            url: res.results.prizeForwardUrl
          });
        } else {
          window.location.href = res.results.prizeForwardUrl
        }
      }
    })
  }

  // 关闭弹窗
  closeTask(){
    this.setState({
      luckInfo: null
    })
  }

  // 再答一次
  again(){
    if(this.state.resultDto.failCode === "2708"){
      this.setState({
        share: true
      })
      return
    }
    // this.props.setStep(2)
    this.props.setValue({ step : 2 })
  }

  shareCLick(){
    this.setState({
      share: false
    })
    this.clickShare()
  }

  seeProductInfo(spuId){
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/pages/productDetail?productId=${spuId}`,
      });
    } else {
        window.location.href = `/product/${spuId}.html`;
    }
  }

  render() {

    const { resultDto, luckInfo, share, hasAddress } = this.state
    const Info = resultDto?.analysisResultDto || null
    if(!resultDto){
      return null
    }
    return (
      <div className="rBox">
        {
          Info && <div>
            <div className="rResultText">
              <div className="rResultBox">
                <p>您的答题结果</p>
                <div>
                  <strong>{Info.resultTitleText}:</strong>{Info.resultTitle}
                </div>
                <div>{Info.resultDesc}</div>
              </div>
            </div>
            <div className="rContent">
              <p>{Info.productTitleText}</p>
              <div className="rSwiper">
                <Swiper {...params}>
                  {Info.analysisResultProductDtoList.map((v, i) => {
                    return (
                      <div className="list-item" key={`list-li-${i}`}>
                        <LazyloadImage
                          imgProps={{
                            className: "product-img",
                            src: `${v.image}280x280.jpg`,
                            onClick: () => this.seeProductInfo(v.productId)
                          }}
                        />
                      </div>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        }
        {
          resultDto.score && <div className="rNonePrize">
            <div className="rNonePrize-box">
              <LazyloadImage
                imgProps={{
                  className: "rNonePrize-img",
                  src: "https://sslstage1.sephorastatic.cn/soa/nmobile/img/quest/gift.png",
                }}
              />
              <div className="rNonePrize-text">
                <p> { resultDto.score >= resultDto.scoreThreshold ? `恭喜您获得${resultDto.score}分` : `很遗憾，您获得${resultDto.score}分` }</p>
                { resultDto.score < resultDto.scoreThreshold && <p>没有获得抽奖机会</p>} 
                { resultDto.score >= resultDto.scoreThreshold && <p>
                  { resultDto.qualification === 1 ? "快去抽奖吧！" : "" }
                </p> }
              </div>
            </div>
          </div>
        }
        {
          resultDto.qualification === 1 && <div className="rFooterBox">
            <div className="lSumbit" onClick={this.handleBegin}>立即抽奖</div>
            <div className="rFooter">
             <span style={{textAlign: resultDto.failCode === "2709" ? 'center' : 'right'}} onClick={this.clickShare}>分享</span>
             { resultDto.failCode !== "2709" && <span>|</span> }
             { resultDto.failCode !== "2709" && <span onClick={this.again}>再答一次</span>}
            </div>
          </div>
        }
        {
          resultDto.qualification === 0 && <div className="rFooterBox">
            <div className="lSumbit" onClick={this.clickShare}>分享</div>
            {
              resultDto.failCode !== "2709" && <div className="rFooter">
                <span onClick={this.again}>再答一次</span>
              </div>
            }
          </div>
        }
        {
          luckInfo && !luckInfo.hasPrize && <div className="rPouple">
            <div className="rPbox">
              <p className="rPtitle noLine">很遗憾没中奖!</p>
              {/* <div className="rPtext">没有获得抽奖机会</div> */}
              <div className="lSumbit" style={{width:'5.2rem'}} onClick={this.closeTask}>确定</div>
            </div>
          </div>
        }
        {
          luckInfo && luckInfo.hasPrize && <div className="award-box">
            <div className="award-content">
              <div className="lottery-none-nums">
                <div className="none-txt">中奖啦！</div>
                {luckInfo && luckInfo.lotteryAddressDto && hasAddress ? <div style={{paddingTop:'0.2rem'}}>
                  <div className="award-address">
                        <div className="address-items">
                          收货人：
                          {luckInfo && luckInfo.lotteryAddressDto.userName}
                        </div>
                        <div className="address-items">
                          手机号码：
                          {luckInfo && luckInfo.lotteryAddressDto.mobile}
                        </div>
                        <div className="address-items">详细地址：{luckInfo.lotteryAddressDto.address}</div>
                      </div>
                    <div className="address-tips">
                      请确认您的收货地址，活动结束后无法修改哦～
                    </div>
                </div> : <div className="prize-box">
                  <LazyloadImage
                    imgProps={{
                      className: "prize-img",
                      src: `${luckInfo.prizeImageUrl}`
                    }}
                  />
                </div> }
                {luckInfo && luckInfo.prizeType == "goods" && luckInfo.lotteryEnd && hasAddress &&
                  <div className="lSumbit" style={{width:'5rem'}}  
                    onClick ={() => {
                      this.setState({
                        luckInfo: null,
                        hasAddress: false,
                      });
                    }}
                  >修改地址</div>
                }
                {luckInfo && luckInfo.prizeType == "goods" && !luckInfo.lotteryEnd && hasAddress &&
                  <div className="lSumbit" style={{width:'5rem'}}  onClick={this.clickAddress}>修改地址</div>
                }

                {luckInfo && luckInfo.prizeType == "goods" && !hasAddress && (
                    <div>
                      {luckInfo && luckInfo.lotteryAddressDto ? (
                        <div className="lSumbit" style={{width:'5rem'}}  onClick={this.addressDteail}>查看地址</div>
                      ) : (
                        <div className="lSumbit" style={{width:'5rem'}}  onClick={this.clickAddress}>填写地址</div>
                      )}
                    </div>
                  )
                }
                {
                  luckInfo && luckInfo.prizeType !== "goods" &&
                  // <CdnImage
                  //   className="share-btn"
                  //   src="/soa/nmobile/img/quest/seePrize.png"
                  //   onClick={this.seeProduct}
                  // />
                  <div className="share-btn" onClick={this.seeProduct}>查看奖品</div>
                }
              </div>
              <LazyloadImage
                imgProps={{
                  className: "award-close",
                  src: "https://ssl1.sephorastatic.cn/soa/mobile/images/errorIcon.png",
                  onClick: () => this.setState({luckInfo: null, hasAddress: false})
                }}
              />
            </div>
          </div>
        }
        {
          share && <div className="share">
            <div className="rPbox" style={{paddingBottom:'30px',height:'initial'}}>
              <div className="rPtext" style={{fontSize:'16px'}}>
                <p>答题机会已用完，分享好友可获得答题机会！</p>
              </div>
              <div className="rPsumbit" onClick={this.shareCLick}>立即分享</div>
            </div>
          </div>
        }
      </div>
    );
  }
}

// export default Result;

const mapStateToProps = () => ({});

export default connect(mapStateToProps, {
  popupAlert,
})(Result);