/* eslint-disable import/extensions */
/* eslint-disable global-require */
import React, { Component } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import LazyloadImage from "@/components/LazyloadImage";
import * as action from "../../../lib/BLL";
import * as device from "../../../lib/device";
import { urlGetParams } from "../../../lib/url";
import PopupLottery from '../../../components/PopupAlert/PopupLottery';

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/default.scss");
  require("../../../../public/style/lotteryActivity.scss");
  require("../../../../public/style/questionnaire.scss");
}

// 热搜词列表页
class Answer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeInfo:null,
      errorMessage: null,
      noPrize: false,
      luckInfo: null,
      lotteryId: null,
      share: false,
      hasAddress: false
    };
    this.getHome = this.getHome.bind(this)
    this.handleBegin = this.handleBegin.bind(this)
    this.seeResult = this.seeResult.bind(this)
    this.seePrize = this.seePrize.bind(this)
    this.clickShare = this.props.clickShare;
    this.seeProduct = this.seeProduct.bind(this)
    this.shareCLick = this.shareCLick.bind(this)
    this.addressDteail = this.addressDteail.bind(this)
    this.clickAddress = this.clickAddress.bind(this)
  }

  componentDidMount(){
    this.getHome()
    this.props.onRef(this);
  }

  getHome(){
    action.getHomePage(urlGetParams(window.location, "id"), (res) => {
      if(res.jQueryStatus.status === 200){
        if(res.errorCode == "2701"){
          this.setState({
            errorMessage: res.errorMessage
          })
        }else{
          this.setState({
            homeInfo: res.results
          })

          this.props.setValue({ 
            homeInfo: res.results,
            type:res.results.type
          })
          // this.props.setValue({name: res.results.name})
          // this.props.setValue({proListImg: res.results.detailImage})
          // this.props.setValue({type: res.results.type})
        }
      }
    })
  }

  // 开始答题
  handleBegin(){
    const homeInfo = this.state.homeInfo
    if(homeInfo.failCode === "2702"){
      this.login()
    }else if(homeInfo.status != 2){
      // 未开始或结束
    }else if(homeInfo.status === 2){
      // 答题次数为0(分享新增的答题次数为0，剩余分享次数不为0)
      // 需要去分享，才能答题
      if(homeInfo.failCode === "2708"){
        this.setState({
          share: true
        })
        return
      }
      // 抱歉，您不符合参与条件！
      if(homeInfo.failCode === "2703"){
        return this.props.setValue({ popupTitle : homeInfo.failMessage })
      }
      // 进行中
      this.props.setValue({step: 2})
    }
  }

  // 登录方法
  login(){
    if (device.device_inMiniProgramsEnvironment()) {
      wx.miniProgram.navigateTo({
        url: `/packagesA/pages/newLogin/newPhoneNumberAuth?redirectPath=${encodeURIComponent(
          `sp/web?nto=1&ncn=1&nui=1&url=${window.location.href}`,
        )}`,
      });
    } else if (device.isApp()) {
      window.location.href =
        `${window.location.origin}/login?historyLocation=` + encodeURIComponent(window.location.href);
    } else {
      window.location.href = `/login?historyLocation=${encodeURIComponent(
        window.location.pathname.replace("/", "").replace("?", "&"),
      )}${window.location.search.replace("?", "&")}`;
    }
  }

  // 查看结果
  seeResult(){
    this.props.setValue({step: 3})
  }

  // 我的奖品
  seePrize(){
    if(this.state.homeInfo.failCode === "2702"){
      return this.login()
    }
    // 未答题
    if(this.state.homeInfo.isAnswer === 0){
      this.setState({
        noPrize:true
      })
      return
    }
    action.getAnswerResult(urlGetParams(window.location, "id"), (res) => {
      if(res.jQueryStatus.status === 200){
        action.myPrize(res.results.lotteryId, (json)=> {
          if(json.jQueryStatus.status === 200 && json.results.hasPrize === true){
            this.setState({
              luckInfo: json.results,
              lotteryId: res.results.lotteryId
            })
          }else{
            this.setState({
              noPrize:true
            })
          }
        })
      }
    })
  }

  // 查看商品
  seeProduct() {
    action.seePrize(this.state.lotteryId, (res) => {
      if(res.jQueryStatus.status === 200){
        if (device.device_inMiniProgramsEnvironment()) {
          wx.miniProgram.navigateTo({
            url: res.results.prizeForwardUrl
          });
        } else {
          window.location.href = res.results.prizeForwardUrl;
        }
      }
    })
  }

  shareCLick(){
    this.setState({
      share: false
    })
    this.clickShare()
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
        // popupAlert(1, "PopupToast", { _text: "活动已结束", _autoClose: true });
        this.props.setValue({ popupTitle : "活动已结束" })
      }
    } else {
      const lotteryId = this.state.lotteryId
      const wid = urlGetParams(window.location,"id")
      if (device.device_inMiniProgramsEnvironment()) {
        wx.miniProgram.navigateTo({
          url: `/sp/web?nto=1&nui=1&url=${encodeURIComponent(
            `${host}/myAccount/address?id=${lotteryId}&type=quest&wid=${wid}&token=${urlGetParams(window.location,"token")}&step=1`
          )}`
        });
      } else {
        window.location.href = `/myAccount/address?id=${lotteryId}&type=quest&wid=${wid}`;
      }
    }
  }
  
  render() {
    let { homeInfo, errorMessage, noPrize, luckInfo, share, hasAddress } = this.state
    if(!homeInfo && !errorMessage){
      return null
    }
    if(!homeInfo){
      return <PopupLottery _text={errorMessage} />
    }
    return (
      <div className="Answer_List">
        <div className="layer1" style={{background: `url(${homeInfo.coverImage}) no-repeat`}}>
          <div className="layer2">
            { homeInfo.mainTitle && <span className="word1">{homeInfo.mainTitle}</span> }
            { homeInfo.subTitle && <span className="info1">{homeInfo.subTitle}</span>}
          </div>
        </div>
        <div className="boxContent">
          <div className="bd1 flex-row">
            <span className="txt2">活动细则</span>
          </div>
          <div className="bd2 flex-row">
            <span className="infoBox1">
              {homeInfo.ruleDesc}
            </span>
            <div className="outer1 flex-col" />
          </div>
        </div>
        <div className="footer">
          { homeInfo.isAnswer == 0 && homeInfo.status != 2 && homeInfo.failCode != "2702" &&<div 
          className="word5"
          onClick={this.handleBegin}>
            开始答题
          </div> }
          { homeInfo.isAnswer == 0 && (homeInfo.status == 2 || homeInfo.failCode == "2702") &&<div 
          className="word4" 
          onClick={this.handleBegin}>
            开始答题
          </div> }
          { homeInfo.isAnswer == 0 && homeInfo.lotteryId && <div className="prize" onClick={this.seePrize}>我的奖品</div>}
          { homeInfo.isAnswer == 1 &&  <div className="word4" onClick={this.seeResult}>查看结果</div>}
          { homeInfo.isAnswer == 1 && <div className="rFooter">
             { homeInfo.lotteryId  && <span onClick={this.seePrize}>我的奖品</span>}
             { homeInfo.failCode !== "2709"  && <span>|</span> }
             { homeInfo.failCode !== "2709" && <span onClick={this.handleBegin}>再答一次</span>}
          </div>}
        </div>
        {
          noPrize && <div className="rPouple">
            <div className="rPbox" style={{paddingBottom:'30px',height:'initial'}}>
              <div className="rPtext" style={{fontSize:'16px'}}>
                暂无中奖记录！
              </div>
              <div className="lSumbit" style={{width:'5rem'}} onClick={() => this.setState({noPrize:false})}>确定</div>
            </div>
          </div>
        }
        {
          share && <div className="share">
            <div className="rPbox" style={{paddingBottom:'16px',height:'initial'}}>
              <div className="rPtext" style={{fontSize:'16px'}}>
                <p>答题机会已用完，分享好友可获得答题机会！</p>
              </div>
              <div className="lSumbit" style={{width:'5rem'}}  onClick={this.shareCLick}>立即分享</div>
              <p onClick={() => this.setState({share:false})} className="shareText">取消</p>
              {/* <div className="rPsumbit" onClick={this.shareCLick}>立即分享</div> */}
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
      </div>
    );
  }
}

export default Answer;

// const mapStateToProps = () => ({});

// export default connect(mapStateToProps, {})(Answer);