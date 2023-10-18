import React from "react";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import {
  getLipQuizImage,
  questionSkuList,
  objfun,
} from "../../actions/lipquiz";
import { getVaDownloadLink } from "../../Utils/deeplink";
import * as device from "../../lib/device";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../PopupAlert/index";
import Sensor from "../../Utils/sensor";

const dynamic = new Dynamic();

class QuizResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style2: {
        transform: "",
      },
      pageNo: 1,
      // skusInfo: [],
      timenum: 0,
    };
  }
  componentDidMount() {
    const { pageNo, timenum } = this.state; // TODO: 请移除无用state
    console.log(pageNo, timenum);
    this.props.getLipQuizImage({}, (callback) => {
      if (callback) {
        this.setState({
          shareImagePath: callback.imagePath,
        });
      }
    });
  }
  touchStart(e) {
    let position = this.state;
    position["startX"] = e.changedTouches[0].pageX;
    position["startY"] = e.changedTouches[0].pageY;
  }
  touchMove(e) {
    e.preventDefault();
    e.stopPropagation();
    let position = this.state;
    position["endX"] = e.changedTouches[0].pageX;
    position["endY"] = e.changedTouches[0].pageY;
    let abs = Math.abs(position["endY"] - position["startY"]);
    if (abs > 50 && abs < 180) {
      this.setState({
        style2: {
          transition: "1s cubic-bezier(.1, .57, .1, 1)",
          transform: "scale3d(1.1,1.1,1.1)",
        },
      });
    }
  }
  touchEnd(e) {
    e.stopPropagation();
    this.setState({
      style2: {
        transform: "scale3d(1,1,1)",
      },
    });
    let position = this.state;
    let dis = position["endY"] - position["startY"];
    if (dis < -100) {
      if (
        this.props.skusInfo &&
        this.props.skusInfo.currentPage * this.props.skusInfo.pageSize >=
          this.props.skusInfo.totalRecordsCount
      )
        return;
      let pageNo = this.props.skusInfo.currentPage,
        records = this.props.skusInfo.records;
      pageNo++;
      this.props.questionSkuList(
        { answerDtos: this.props.selected, pageNo: pageNo },
        (callback) => {
          if (callback) {
            records = [...records, ...callback.results.records];
            if (device.isApp()) {
              // 处理分页虚拟试妆按钮调用APP端接口
              let dataSku = records.map((item) => {
                return {
                  ...item,
                  appears: false,
                };
              });
              let arrObj = dataSku.map((item) => {
                return item.skuId;
              });
              let sum = arrObj.join();
              let that = this;
              let config = {
                skuIds: sum,
                success: (res) => {
                  that.setState({
                    timenum: 1,
                  });
                  if (res.skuIds) {
                    let records = that.filterMethod(res.skuIds, dataSku);
                    that.props.objfun(
                      Object.assign(callback.results, { records })
                    );
                  } else {
                    that.props.objfun(
                      Object.assign(callback.results, { records })
                    );
                  }
                },
              };
              dynamic.sepBridge().then((sep) => {
                sep.vaSkuFinder && sep.vaSkuFinder(config);
              });
              setTimeout(() => {
                if (that.state.timenum !== 1) {
                  that.props.objfun(
                    Object.assign(callback.results, { records })
                  );
                }
              }, 1000);
            } else {
              this.props.objfun(Object.assign(callback.results, { records }));
            }
          }
        }
      );
    }
  }
  filterMethod = (str, arr) => {
    const newStr = str.split(",");
    newStr.forEach((item) => {
      arr.forEach((ele) => {
        if (Number(item) === Number(ele.skuId)) {
          ele.appears = true;
        }
      });
    });
    return arr;
  };
  reStart() {
    Sensor.go("LipFinderClick", {
      button_name: "重新测试",
      commodity_sku: "",
      OP_code: "",
    });
    window.history.go(0);
  }
  clickSaveStart() {
    if (device.isApp()) {
      this.state.timer = setTimeout(() => {
        let config = {
          title: "口红种草机LIP FINDER",
          text: "找到你的专属唇妆",
          imageUrl:
            "https://ssl1.sephorastatic.cn/soa/nmobile/img/LipFinder_Share.png",
          miniProgramPath: "pages/home/index",
          miniProgramScene: "",
          postWithCodeType: "WechatCode",
        };
        dynamic.sepBridge().then((sep) => {
          sep.createPoster && sep.createPoster(config);
        });
      }, 800);
    }
  }
  clickSaveEnd() {
    clearTimeout(this.state.timer);
  }
  jumpDetail(skuId, spuId) {
    if (typeof window === "undefined") {
      return;
    }
    Sensor.go("LipFinderClick", {
      button_name: "点击进入PDP",
      commodity_sku: skuId,
      OP_code: spuId,
    });
    new window.SEPHORA_JSINVOKE().jumpPage({
      product: {
        productId: `${spuId}`,
        skuId: `${skuId}`,
        productcn: "",
      },
    });
  }
  jumpVa(skuId, spuId) {
    Sensor.go("LipFinderClick", {
      button_name: "虚拟试妆",
      commodity_sku: skuId,
      OP_code: spuId,
    });
    const { popupAlert } = this.props;
    if (device.isApp()) {
      window.location.href = getVaDownloadLink({ skuId });
    } else if (device.isWeChat()) {
      popupAlert(1, "PopupVaConfirm", {
        _title: "提示",
        _text: "前往丝芙兰APP“虚拟试妆”体验",
      });
    } else {
      popupAlert(1, "PopupConfirm", {
        _title: "提示",
        _text: "前往丝芙兰APP“虚拟试妆”体验",
        _closeCallback: () =>
          (window.location.href = "/public/download.html?source=va"),
      });
    }
  }
  render() {
    let { shareImagePath } = this.state;
    let goodItem;
    if (
      this.props.skusInfo &&
      this.props.skusInfo.records &&
      this.props.skusInfo.records.length > 0
    ) {
      goodItem = this.props.skusInfo.records.map((item, index) => {
        return (
          <div className="goods_item" key={index}>
            <div className="product_img">
              <img
                src={`${item.imagePath}640x640.jpg`}
                alt=""
                onClick={this.jumpDetail.bind(this, item.skuId, item.spuId)}
              />
            </div>
            <div className="product_mess">
              <p className="head">{item.brandName}</p>
              <p className="cont">{item.productName}</p>
              <div className="buy">
                <p className="price">￥{item.price}</p>
                <div className="bottom_icon">
                  {item.appears && !device.isWeChat() ? (
                    <img
                      className="icon"
                      src="https://ssl1.sephorastatic.cn/soa/nmobile/img/virture_btn.png"
                      alt=""
                      onClick={this.jumpVa.bind(this, item.skuId, item.spuId)}
                    />
                  ) : (
                    ""
                  )}

                  <img
                    className="icon"
                    src="https://ssl1.sephorastatic.cn/soa/nmobile/img/addtocart.png"
                    alt=""
                    onClick={this.jumpDetail.bind(this, item.skuId, item.spuId)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      goodItem = (
        <div className="no_content">
          <img
            className="no_icon"
            src="https://ssl1.sephorastatic.cn/soa/nmobile/img/lip_search.png"
            alt=""
          />
          暂无符合的商品，建议重新测试哦
        </div>
      );
    }
    return (
      <div className="result_main_page">
        <PopupAlert _zIndex={1001} />
        <header style={this.state.style2} className={`result_header`}>
          <img className="share_image" src={shareImagePath} />
          <div className="logo_txt">
            LIP <span>FINDER</span>
          </div>
          <div className="result_title">查收你专属的最IN唇色</div>
          <div className="save_pic">长按生成图片，分享你的专属唇妆</div>
          <div className="rest_btn" onClick={this.reStart.bind(this)}>
            重新测试
          </div>
        </header>
        <div
          className="result_content"
          onTouchStart={this.touchStart.bind(this)}
          onTouchMove={this.touchMove.bind(this)}
          onTouchEnd={this.touchEnd.bind(this)}
        >
          {device.isWeChat() ? null : (
            <div className="result_try">
              <em className="icon-virture" />使用虚拟试妆唇色
            </div>
          )}

          <div className="result_item">{goodItem}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  return {
    skusInfo: s.lipQuiz.skuresults,
    selected: s.lipQuiz.selected,
  };
};
export default connect(mapStateToProps, {
  getLipQuizImage,
  questionSkuList,
  objfun,
  popupAlert,
})(QuizResults);
