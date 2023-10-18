import React, { Component } from "react";
import { connect } from "react-redux";
import {
  saveQuestionCode,
  clickSelect,
} from "@/actions/giftIntelligentRecommendation";
import Sensor from "@/Utils/sensor";
export class questionTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canClick: false,
      animateImg: false,
      leaveOut: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ animateImg: true });
    }, 1000);
    setTimeout(() => {
      this.setState({ canClick: true });
    }, 2000);
  }
  clickNext(item, index) {
    this.setState({ canClick: false });
    Sensor.go("giftSelectionClick", {
      button_name: `${item.answerDesc}`,
      commodity_sku: "",
      OP_code: "",
      action_id: "1000801_002",
    });
    let animiteImg = document.getElementsByClassName("animite-dom");
    animiteImg[index].className += " click-stretch";
    setTimeout(() => {
      let targetDom = null;
      if (animiteImg.length > 0) {
        targetDom = animiteImg[index];
      }
      if (targetDom) {
        let targetRects = targetDom.getBoundingClientRect();
        let x = targetRects.left,
          y = targetRects.top;
        this.creatAnimate(targetDom, x, y, () => {
          let {
            clickSelect,
            _clickCb,
            selectResData,
            questionCode,
            saveQuestionCode,
          } = this.props;
          let nextCode = selectResData.nextQuestionCode;
          saveQuestionCode(nextCode);
          let giftbox = document.getElementsByClassName("gift-box-item")[0];
          giftbox.className = "gift-box-item";

          clickSelect(item, questionCode, nextCode, true, () => {
            _clickCb({
              showQuestionTwo: false,
              showQuestionThree: true,
            });
          });
        });
      }
    }, 1000);
  }
  creatAnimate(dom, left, top, cb) {
    let bar = document.createElement("div");
    bar.style.position = "absolute";
    bar.className = "clone-element";
    bar.style.left = 0;
    bar.style.top = 0;
    bar.style.width = "4rem";
    bar.style.height = "4rem";
    bar.style.backgroundImage = `url(${
      dom.style.backgroundImage.split("(")[1].split(")")[0]
    })`;
    bar.style.backgroundSize = "100%";
    bar.style.transform = "translate(" + left + "px," + top + "px)";
    bar.style.transition = "transform .5s";
    document.body.appendChild(bar);
    // 添加动画属性
    setTimeout(() => {
      let target = document.getElementsByClassName("suspension-box")[0];
      let targetRects = target.getBoundingClientRect();
      let targetX = targetRects.left;
      let targetY = targetRects.top + 20;
      bar.style.transform = "translate(" + targetX + "px," + targetY + "px)";
    }, 0);
    bar.addEventListener("webkitTransitionEnd", () => {
      this.setState({ leaveOut: true });
      let cloneElement = document.getElementsByClassName("clone-element")[0];
      let giftbox = document.getElementsByClassName("gift-box-item")[0];
      giftbox.appendChild(cloneElement);
      giftbox.className += " animate__animated  animate__bounce";
      setTimeout(() => {
        cb();
      }, 1000);
    });
  }
  render() {
    let { selectResData } = this.props;
    let { canClick, animateImg, leaveOut } = this.state;
    let imgUrl;
    return (
      <div className="giftRecommend-container-two">
        <img
          className="animate_img animate__fadeInRight"
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/question_setting.jpg"
        />
        {animateImg ? (
          <div
            className={`${
              leaveOut ? "animate__fadeOutLeft" : "animate__fadeInRight"
            }`}
          >
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
                selectResData.pageDto.records.map((item, index) => {
                  if (item.answerCode == "Lover") {
                    imgUrl =
                      "https://sslstage1.sephorastatic.cn/soa/mobile/images/Lover.png";
                  } else if (item.answerCode == "CloseFriend") {
                    imgUrl =
                      "https://sslstage1.sephorastatic.cn/soa/mobile/images/CloseFriend.png";
                  } else if (item.answerCode == "Senior") {
                    imgUrl =
                      "https://sslstage1.sephorastatic.cn/soa/mobile/images/Senior.png";
                  } else if (item.answerCode == "Colleague") {
                    imgUrl =
                      "https://sslstage1.sephorastatic.cn/soa/mobile/images/Colleague.png";
                  }
                  return (
                    <div key={item.answerCode}>
                      <button
                        style={{
                          backgroundImage: `url(${item.answerImageUrl})`,
                        }}
                        disabled={!canClick ? true : false}
                        className="answer-item"
                        onClick={() => {
                          this.clickNext(item, index);
                        }}
                      >
                        <div
                          className="animite-dom animate__animated"
                          ref={(ref) => {
                            this.animateRef = ref;
                          }}
                          style={{
                            backgroundImage: `url(${imgUrl})`,
                          }}
                        />

                        <p>{item.answerDesc}</p>
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectResData: state.giftIntelligent.selectResData,
    questionCode: state.giftIntelligent.questionCode,
  };
};
export default connect(mapStateToProps, { clickSelect, saveQuestionCode })(
  questionTwo
);
