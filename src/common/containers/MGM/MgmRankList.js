/*
 * @Author: summer
 * @Date: 2020-10-22 17:08:56
 * @function mgm申领
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import isBrowser from "@/Utils/utils/isBrowser";
import CurrentComponentCommonTop from "../../components/CommonTop";
import { getLeaderboard, getAssistanceList } from "../../actions/mgmTrialIndex";
import { urlGetParams } from "../../lib/url";
import * as device from "../../lib/device";
import Image from "../../components/ImagesLazyLoad/index";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/MgmTrialApplication.scss");
}

const dynamic = new Dynamic();
export class MgmRankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRankList: null,
      rankPageNo: 1,
      rankInfo: null,
      listInfo: null,
      listPageNo: 1,
      btnText: "",
      eventStatus: "",
    };
  }
  componentDidMount() {
    let rankPageNo = this.state.rankPageNo;
    this.props.getLeaderboard({ pageNo: rankPageNo }, (callback) => {
      // console.log(callback);
      this.setState({
        rankInfo: callback,
        currentUserPartnerNum: callback.currentUserPartnerNum,
        currentUserRank: callback.currentUserRank,
      });
    });
    let listPageNo = this.state.listPageNo;
    this.props.getAssistanceList({ pageNo: listPageNo }, (res) => {
      this.setState({
        listInfo: res,
      });
    });
    let btnText = decodeURIComponent(urlGetParams(window.location, "btnText")),
      eventStatus = urlGetParams(window.location, "eventStatus"),
      showRankList = Number(urlGetParams(window.location, "showRankList")),
      leaderboardNum = urlGetParams(window.location, "leaderboardNum");
    if (eventStatus != 0) {
      if (leaderboardNum > 0) {
        showRankList = true;
      }
    }
    this.setState({
      btnText,
      eventStatus,
      showRankList,
      leaderboardNum,
    });
    if (device.isApp()) {
      let eventId = urlGetParams(window.location, "eventId");
      let params = {
        screenName: `campaign_mgmRankList_${eventId}`,
        screenType: "Campaign",
        URL: window.location.pathname,
      };

      let JSINVOKE = new window.SEPHORA_JSINVOKE();
      if (JSINVOKE.logEvent) {
        JSINVOKE.logEvent("customScreenView", params);
        JSINVOKE.logEvent("screen_view", params);
      }
    }
  }
  clickRankList() {
    this.setState({
      showRankList: true,
    });
  }
  clickClose() {
    this.setState({
      showRankList: false,
    });
  }
  clickShare(e) {
    e.stopPropagation();
    let param = JSON.parse(localStorage.getItem("shareInfo"));
    dynamic.sepBridge().then((sep) => {
      sep.probationShare && sep.probationShare(param);
    });
  }
  touchStart(e) {
    let position = this.state;
    position["startX"] = e.changedTouches[0].pageX;
    position["startY"] = e.changedTouches[0].pageY;
  }
  touchMove(e) {
    e.stopPropagation();
    let position = this.state;
    position["endX"] = e.changedTouches[0].pageX;
    position["endY"] = e.changedTouches[0].pageY;
  }
  touchEnd(e) {
    e.stopPropagation();
    let position = this.state;
    let dis = position["endY"] - position["startY"];

    if (dis < -100) {
      let pageNo = position.rankPageNo,
        rankList = position.rankInfo.rankList,
        rankInfo = position.rankInfo;
      pageNo++;
      this.props.getLeaderboard({ pageNo }, (callback) => {
        if (callback.rankList == 0) return;
        rankList = [...rankList, ...callback.rankList];
        rankInfo = Object.assign(callback, { rankList });
        this.setState({
          rankPageNo: pageNo,
          rankInfo,
        });
      });
    }
  }
  touchListStart(e) {
    let distance = this.state;
    distance["startX"] = e.changedTouches[0].pageX;
    distance["startY"] = e.changedTouches[0].pageY;
  }
  touchListMove(e) {
    e.stopPropagation();
    let distance = this.state;
    distance["endX"] = e.changedTouches[0].pageX;
    distance["endY"] = e.changedTouches[0].pageY;
  }
  touchListEnd(e) {
    e.stopPropagation();
    let distance = this.state;
    let dis = distance["endY"] - distance["startY"];
    if (dis < -100) {
      let pageNo = distance.listPageNo,
        listInfo = distance.listInfo;
      pageNo++;
      this.props.getAssistanceList({ pageNo }, (callback) => {
        if (callback.length == 0) return;
        listInfo = [...listInfo, ...callback];
        this.setState({
          listPageNo: pageNo,
          listInfo,
        });
      });
    }
  }
  render() {
    let {
      showRankList,
      rankInfo,
      listInfo,
      btnText,
      eventStatus,
      leaderboardNum,
      currentUserPartnerNum,
      currentUserRank,
    } = this.state;
    let thirdArr = [];
    for (let i = 0; i < 3; i++) {
      if (rankInfo && rankInfo.rankList.length > 0) {
        thirdArr[i] = rankInfo && rankInfo.rankList[i];
      } else {
        thirdArr[i] = {};
      }
    }
    return (
      <div>
        <CurrentComponentCommonTop />
        <div id="apptitle">助力成功</div>
        <div className="mgm_page_title">
          <div>共{currentUserPartnerNum}人助力</div>
          {leaderboardNum > 0 ? (
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={this.clickRankList.bind(this)}
            >
              排行榜
              <div className="mgm_avatar">
                {thirdArr.map((item, index) => {
                  if (item && item.avatarUrl) {
                    return <Image key={index} src={item.avatarUrl} alt="" />;
                  } else {
                    return (
                      <Image
                        key={index}
                        src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm_none.png"
                        alt=""
                      />
                    );
                  }
                })}
              </div>
              <div style={{ color: "#ddd" }}>
                <Image
                  className="arror-more"
                  src="https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Arrow_Outlined_grey.png"
                  alt=""
                />{" "}
              </div>
            </div>
          ) : null}
        </div>
        {listInfo && listInfo.length > 0 ? (
          <div
            className="mgm_page_box"
            onTouchStart={this.touchListStart.bind(this)}
            onTouchMove={this.touchListMove.bind(this)}
            onTouchEnd={this.touchListEnd.bind(this)}
          >
            {listInfo.map((val, index) => {
              return (
                <div className="list_item" key={index}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {val.partnerAvatarUrl && (
                      <Image className="list_avatar" src={val.partnerAvatarUrl} alt="" />
                    )}
                    <div className="list_name">{val.partnerNickName}</div>
                  </div>
                  <div className="list_status">助力成功</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mgm_page_box_no">
            <p>还没有好友为你助力</p>
            <p>立即转发赢取好礼哦！</p>
          </div>
        )}
        {eventStatus == 2 || eventStatus == 3 ? null : (
          <div className="share_btn_bottom" onClick={this.clickShare.bind(this)}>
            {btnText}
          </div>
        )}
        {showRankList ? (
          <div className="rank_dialog" onClick={this.clickClose.bind(this)}>
            <div className="rank_box">
              <p className="rank_title">排行榜</p>
              {eventStatus == 2 || eventStatus == 3 ? null : (
                <div className="share_btn" onClick={this.clickShare.bind(this)}>
                  {btnText}
                </div>
              )}

              <div className="rank_status">
                <div>当前排名:{currentUserRank}</div>
                <div>分享人数:{currentUserPartnerNum}</div>
              </div>
              <p className="rank_txt">榜单每10分钟刷新</p>
              <div
                className="rank_con"
                onTouchStart={this.touchStart.bind(this)}
                onTouchMove={this.touchMove.bind(this)}
                onTouchEnd={this.touchEnd.bind(this)}
              >
                {rankInfo &&
                  rankInfo.rankList.length > 0 &&
                  rankInfo.rankList.map((item, index) => {
                    if (index == 0) {
                      return (
                        <div className="rank_list" key={index}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div className={`rank_no_${index}`}>{index + 1}</div>
                            <div className="rank_avator">
                              {item.avatarUrl && <Image src={item.avatarUrl} alt="" />}
                              <Image
                                className="avatar_tag"
                                src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Rank_01.png"
                                alt=""
                              />
                            </div>
                            <div className="rank_name">{item.nickName}</div>
                          </div>
                          <div className="share_num">
                            分享人数：<span>{item.partnerNum}</span>
                          </div>
                        </div>
                      );
                    } else if (index == 1) {
                      return (
                        <div className="rank_list" key={index}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div className={`rank_no_${index}`}>{index + 1}</div>
                            <div className="rank_avator">
                              {item.avatarUrl && <Image src={item.avatarUrl} alt="" />}
                              <Image
                                className="avatar_tag"
                                src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Rank_02.png"
                                alt=""
                              />
                            </div>
                            <div className="rank_name">{item.nickName}</div>
                          </div>
                          <div className="share_num">
                            分享人数：<span>{item.partnerNum}</span>
                          </div>
                        </div>
                      );
                    } else if (index == 2) {
                      return (
                        <div className="rank_list" key={index}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div className={`rank_no_${index}`}>{index + 1}</div>
                            <div className="rank_avator">
                              {item.avatarUrl && <Image src={item.avatarUrl} alt="" />}
                              <Image
                                className="avatar_tag"
                                src=" https://ssl1.sephorastatic.cn/soa/nmobile/img/Icons_Rank_03.png"
                                alt=""
                              />
                            </div>
                            <div className="rank_name">{item.nickName}</div>
                          </div>
                          <div className="share_num">
                            分享人数：<span>{item.partnerNum}</span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="rank_list" key={index}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div className="rank_no_others">{index + 1}</div>
                            {item.avatarUrl && (
                              <Image className="rank_avator_img" src={item.avatarUrl} alt="" />
                            )}
                            <div className="rank_name">{item.nickName}</div>
                          </div>
                          <div className="share_num">
                            分享人数：<span>{item.partnerNum}</span>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { getLeaderboard, getAssistanceList })(MgmRankList);
