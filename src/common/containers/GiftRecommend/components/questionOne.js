import React, { Component } from "react";
import { connect } from "react-redux";
import {
  giftQuestion,
  clickSelect,
  saveQuestionCode,
  saveAnswerDto,
} from "@/actions/giftIntelligentRecommendation";
import { urlGetParams } from "@/lib/url";
import Sensor from "@/Utils/sensor";
export class questionOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCode: urlGetParams(window.location, "questionCode"),
    };
  }
  clickNext(item, index) {
    Sensor.go("giftSelectionClick", {
      button_name: `${item.answerDesc}`,
      commodity_sku: "",
      OP_code: "",
      action_id: "1000801_002",
    });
    this.setState({ stretch: index });
    let { nextCode, currentCode } = this.state;
    let { clickSelect, _clickCb, saveQuestionCode } = this.props;
    saveQuestionCode(nextCode);
    setTimeout(() => {
      clickSelect(item, currentCode, nextCode, true, () => {
        _clickCb({
          // showQuestionOne: false,
          showQuestionTwo: true,
        });
        setTimeout(() => {
          _clickCb({ showQuestionOne: false });
        }, 1000);
      });
    }, 1000);
  }
  componentDidMount() {
    let questionCode = this.state.currentCode;
    this.props.giftQuestion({ questionCode }, (callback) => {
      if (callback) {
        let resData = callback;
        this.setState({
          AnswerDtos: resData.pageDto.records,
          nextCode: resData.nextQuestionCode,
        });
      }
    });
    this.props.saveAnswerDto([]);
  }
  render() {
    let { AnswerDtos, stretch } = this.state;
    return (
      <div className={"giftRecommend-container-one"}>
        {AnswerDtos &&
          AnswerDtos.map((item, index) => (
            <div
              key={index}
              className={`${item.answerCode == "Female" ? "top " : "bottom"
                } animate__animated`}
            >
              <div
                style={{ height: "100%" }}
                className={`${item.answerCode == "Female"
                    ? "animate__fadeInDown"
                    : "animate__fadeInUp"
                  } animate__animated`}
              >
                {item.answerCode == "Female" ? (
                  <img
                    className="riband female"
                    src="https://sslstage1.sephorastatic.cn/soa/mobile/images/riband_top.png"
                    alt=""
                  />
                ) : (
                  <img
                    className="riband male"
                    src="https://sslstage1.sephorastatic.cn/soa/mobile/images/riband_bottom.png"
                    alt=""
                  />
                )}
                <div
                  style={{ zIndex: 1 }}
                  onClick={() => this.clickNext(item, index)}
                  className={stretch == index ? " animate__stretch" : ""}
                >
                  {item.answerCode == "Female" ? (
                    <img
                      className="sex-icon female"
                      src="https://sslstage1.sephorastatic.cn/soa/mobile/images/for_her.png"
                      alt=""
                    />
                  ) : (
                    <img
                      className="sex-icon male"
                      src="https://sslstage1.sephorastatic.cn/soa/mobile/images/for_him.png"
                      alt=""
                    />
                  )}
                  <p
                    className={`${item.answerCode == "Female"
                        ? "color-black"
                        : "color-white"
                      }`}
                  >
                    {item.answerDesc}
                    {item.answerCode == "Female" ? (
                      <img
                        className="arrow-icon"
                        src="https://sslstage1.sephorastatic.cn/soa/mobile/images/arrow_black.png"
                        alt=""
                      />
                    ) : (
                      <img
                        className="arrow-icon"
                        src="https://sslstage1.sephorastatic.cn/soa/mobile/images/arrow_white.png"
                      />
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        <img
          className="mouse-icon"
          src={this.props.imgBase64}
          alt=""
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  state,
});

export default connect(mapStateToProps, {
  giftQuestion,
  clickSelect,
  saveQuestionCode,
  saveAnswerDto,
})(questionOne);
