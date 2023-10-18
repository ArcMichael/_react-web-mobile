import React, { Component } from "react";
import { connect } from "react-redux";
import {
  saveQuestionCode,
  clickSelect,
  loadAnimateJson,
} from "@/actions/giftIntelligentRecommendation";
import Sensor from "@/Utils/sensor";
import * as action from "@/lib/services/getAnimateJson";
export class questionFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canClick: true,
    };
  }
  componentDidMount() {
    let giftbox = document.getElementsByClassName("gift-box-item")[0];
    let newBox = giftbox.cloneNode(true);
    let newBoxII = giftbox.cloneNode(true);
    let newBoxIII = giftbox.cloneNode(true);
    document.getElementsByClassName("gift-box")[0].append(newBox);
    document.getElementsByClassName("gift-box")[0].append(newBoxII);
    document.getElementsByClassName("gift-box")[0].append(newBoxIII);
    let answerDtos = this.props.answerDtos;
    // 预加载下一个json动画
    let path;
    if (answerDtos.length > 0) {
      let result = answerDtos.map((item) => item.answerCodes);
      let newKey = result.join().toLowerCase();
      switch (true) {
        case newKey.includes("lover") && newKey.includes("blue"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/lb.json";
          break;
        case newKey.includes("lover") && newKey.includes("red"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/lr.json";
          break;
        case newKey.includes("lover") && newKey.includes("yellow"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/ly.json";
          break;
        case newKey.includes("lover") && newKey.includes("green"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/lg.json";
          break;
        case newKey.includes("friend") && newKey.includes("blue"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/fb.json";
          break;
        case newKey.includes("friend") && newKey.includes("green"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/fg.json";
          break;
        case newKey.includes("friend") && newKey.includes("yellow"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/fy.json";
          break;
        case newKey.includes("friend") && newKey.includes("red"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/fr.json";
          break;
        case newKey.includes("senior") && newKey.includes("blue"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/sb.json";
          break;
        case newKey.includes("senior") && newKey.includes("yellow"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/sy.json";
          break;
        case newKey.includes("senior") && newKey.includes("red"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/sr.json";
          break;
        case newKey.includes("senior") && newKey.includes("green"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/sg.json";
          break;
        case newKey.includes("colleague") && newKey.includes("blue"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/cb.json";
          break;
        case newKey.includes("colleague") && newKey.includes("red"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/cr.json";
          break;
        case newKey.includes("colleague") && newKey.includes("yellow"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/cy.json";
          break;
        case newKey.includes("colleague") && newKey.includes("green"):
          path =
            "https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/cg.json";
          break;
        default:
          break;
      }
      action.getAnimateJson(path, (res) => {
        let object = JSON.parse(res);
        for (const key in object) {
          if (key == "assets") {
            const element = object[key];
            if (Object.prototype.toString.call(element) === "[object Array]") {
              element.map((item) => {

                if (item.p) {
                  item.p= `https://sslstage1.sephorastatic.cn/soa/mobile/images/giftEnd/${item.p}`
                  this.getBase64Image(
                    `${item.p}`
                  ).then((res) => {
                    item.p = res;
                    
                  });
                }
              });
            }
          }
        }
        console.log('object----',object);
        this.props.loadAnimateJson(object)
      });
    }
  }
  getBase64Image(url) {
    return new Promise((resolve) => {
      var that = this;
      var image = new Image();
      image.src = url + "?v=" + Math.random(); // 处理缓存
      image.crossOrigin = "*"; // 支持跨域图片
      image.onload = () => {
        var base64 = that.drawBase64Image(image);
        resolve(base64);
      };
    });
  }
  drawBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }
  clickNext(item, index) {
    this.setState({ canClick: false });
    Sensor.go("giftSelectionClick", {
      button_name: `${item.answerDesc}`,
      commodity_sku: "",
      OP_code: "",
      action_id: "1000801_002",
    });
    this.setState({ stretch: index });
    let { _clickCb, questionCode, nextCode, clickSelect } = this.props;
    let x = 0;
    if (item.answerCode == "Budget3") {
      x = -6.56;
    } else if (item.answerCode == "Budget1") {
      x = 5.7;
    } else if (item.answerCode == "Budget4") {
      x = -13;
    }
    this.creatAnimate(x, () => {
      clickSelect(item, questionCode, nextCode, false, () => {
        _clickCb({
          showQuestionOne: false,
          showQuestionTwo: false,
          showQuestionFour: false,
          showQuestionThree: false,
          showFinishAnimate: true,
        });
      });
    });
  }
  creatAnimate(x, cb) {
    let newdom = document.getElementsByClassName("gift-box")[0];
    newdom.style.transition = "transform 1s ease-in-out";
    setTimeout(() => {
      newdom.style.transform = `translateX(${x}rem)`;
    }, 0);
    newdom.addEventListener("webkitTransitionEnd", () => {
      cb();
    });
  }
  componentWillUnmount() {
    if (this.anim) this.anim.destroy();
  }
  render() {
    let { selectResData } = this.props;
    let { stretch, canClick } = this.state;

    return (
      <div className="giftRecommend-container-four  animate__fadeInRight">
        <div className="subject-title">
          {selectResData && (
            <p>
              <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/title_symbol.png" />
              {selectResData.title}
              <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/title_symbol.png" />
            </p>
          )}
        </div>
        <div className="answer-content">
          {selectResData &&
            selectResData.pageDto.records.map((item, index) => (
              <div key={item.answerCode}>
                <button
                  style={{ backgroundImage: `url(${item.answerImageUrl})` }}
                  className={`answer-item ${
                    stretch == index
                      ? "animate__animated  animate__stretch"
                      : ""
                  }`}
                  disabled={!canClick ? true : false}
                  onClick={() => {
                    this.clickNext(item, index);
                  }}
                >
                  {/* <p>{item.answerDesc}</p> */}
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectResData: state.giftIntelligent.selectResData,
  questionCode: state.giftIntelligent.questionCode,
  answerDtos: state.giftIntelligent.answerDtos,
});

export default connect(mapStateToProps, {
  clickSelect,
  saveQuestionCode,
  loadAnimateJson,
})(questionFour);
