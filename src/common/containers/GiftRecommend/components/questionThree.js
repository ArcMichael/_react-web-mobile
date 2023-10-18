import React, { Component } from "react";
import { connect } from "react-redux";
import {
  saveQuestionCode,
  clickSelect,
} from "@/actions/giftIntelligentRecommendation";
import Sensor from "@/Utils/sensor";
export class questionThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIdx: null,
      hidQuestion: false,
      canClick: true,
      leaveOut: false,
    };
  }
  clickNext(e, item, index) {
    this.setState({ canClick: false });
    Sensor.go("giftSelectionClick", {
      button_name: `${item.answerDesc}`,
      commodity_sku: "",
      OP_code: "",
      action_id: "1000801_002",
    });
    e.persist();
    let animiteImg = document.getElementsByClassName("lid");
    this.setState(
      {
        currentIdx: index,
        // hidQuestion: true
      },
      () => {
        let targetRects = animiteImg[index].getBoundingClientRect();
        let top = targetRects.top,
          left = targetRects.left;
        this.creatAnimate(animiteImg[index], left, top, () => {
          this.setState({ canClick: false });
          let {
            clickSelect,
            _clickCb,
            selectResData,
            questionCode,
            saveQuestionCode,
          } = this.props;
          let giftbox = document.getElementsByClassName("gift-box-item")[0];
          giftbox.className = "gift-box-item";
          let nextCode = selectResData.nextQuestionCode;
          saveQuestionCode(nextCode);
          clickSelect(item, questionCode, nextCode, true, () => {
            _clickCb({
              showQuestionOne: false,
              showQuestionTwo: false,
              showQuestionFour: true,
              showQuestionThree: false,
            });
          });
        });
      }
    );
  }
  creatAnimate(dom, left, top, cb) {
    let newdom = dom.cloneNode();
    newdom.id = "clone-lid";
    newdom.style.visibility = "visible";
    newdom.style.transform = " translate(" + (left - 50) + "px," + top + "px)";
    newdom.style.transition = "transform .5s linear";
    newdom.style.width = "6.72rem";
    newdom.style.height = "1.344rem";
    newdom.style.margin = "0 auto";
    document.body.appendChild(newdom);
    let lids = document.querySelectorAll(".answer-content p");
    let domRects = dom.getBoundingClientRect();
    // 改变其他盖子透明度
    let opcityNum = 1;
    lids.forEach((element) => {
      let elementRects = element.getBoundingClientRect();
      setInterval(() => {
        opcityNum -= 0.1;
        if (opcityNum > 0) {
          element.style.opacity = opcityNum;
        } else {
          clearInterval();
        }
      }, 50);
      element.style.transform = `translate(${
        elementRects.left - domRects.left
      }px,${domRects.top - elementRects.top}px`;
      element.style.transition = "transform .5s linear";
      setTimeout(() => {
        element.style.visibility = "hidden";
      }, 100);
    });
    // 添加动画属性
    setTimeout(() => {
      let target = document.getElementsByClassName("suspension-box")[0];
      let targetRects = target.getBoundingClientRect();
      let targetX = targetRects.left - left;
      let targetY = targetRects.top;
      newdom.style.transform = "translate(" + targetX + "px," + targetY + "px)";
    }, 200);
    newdom.addEventListener("webkitTransitionEnd", () => {
      // 当前题目出场,下一题进场
      this.setState({ leaveOut: true });
      let giftBox = document.querySelector(".gift-box-item");
      giftBox.style.transition = "transform .5s linear";
      let clonelid = document.getElementById("clone-lid");
      giftBox.appendChild(clonelid);
      giftBox.className += " animate__bounceOnce";
      setTimeout(() => {
        cb();
      }, 600);
    });
  }
  render() {
    let { selectResData } = this.props;
    let { currentIdx, hidQuestion, canClick, leaveOut } = this.state;
    return (
      <div className="giftRecommend-container-three  animate__fadeInRight">
        <div
          className={`${
            leaveOut ? "animate__fadeOutLeft" : "animate__fadeInRight"
          } `}
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
                return (
                  <div key={item.answerCode}>
                    <button
                      disabled={!canClick ? true : false}
                      className="answer-item"
                      onClick={(e) => {
                        this.clickNext(e, item, index);
                      }}
                    >
                      <img
                        className={`${
                          currentIdx == index ? "show-lid" : "disappear"
                        } lid`}
                        src={item.answerImageUrl}
                        alt=""
                      />
                      {!hidQuestion && (
                        <p
                          style={{
                            backgroundImage: `url(https://sslstage1.sephorastatic.cn/soa/mobile/images/character_bg.png)`,
                          }}
                        >
                          {item.answerDesc}
                        </p>
                      )}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
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

export default connect(mapStateToProps, {
  clickSelect,
  saveQuestionCode,
  // setSelectResData,
})(questionThree);
