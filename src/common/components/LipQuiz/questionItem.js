import React from "react";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import QuizResult from "./quizResult";
import { urlGetParams } from "../../lib/url";
import {
  questionNaire,
  questionSkuList,
  objfun,
  selectedObj,
} from "../../actions/lipquiz";
import * as device from "../../lib/device";
const dynamic = new Dynamic();
class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOver: false,
      answerSelectedList: [],
      currentCode: urlGetParams(window.location, "questionCode"),
      pageNo: 1,
      num: "",
      timenum: 0,
    };
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }
  componentDidMount() {
    const { num, timenum, startX, endX } = this.state; // TODO: 请移除无用state
    console.log(num, timenum, startX, endX);
    this.props.questionNaire(
      { questionCode: this.state.currentCode },
      (callback) => {
        if (callback) {
          let resData = callback;
          resData.pageDto.records.map((v) => (v.active = false));
          this.setState({
            QuestionAnswerDto: resData,
            AnswerDtos: resData.pageDto.records,
            preCode: resData.preQuestionCode,
            nextCode: resData.nextQuestionCode,
          });
        }
      }
    );
  }
  selectClick(index) {
    let AnswerDtos = this.state.AnswerDtos;
    let answerIds = AnswerDtos.filter((v) => v.active == true);
    if (this.state.QuestionAnswerDto.maxSelected) {
      if (answerIds.length < this.state.QuestionAnswerDto.maxSelected) {
        AnswerDtos[index].active = !AnswerDtos[index].active;
        this.setState({
          AnswerDtos,
        });
      } else {
        if (AnswerDtos[index].active) {
          AnswerDtos[index].active = false;
          this.setState({
            AnswerDtos,
          });
        }
      }
    } else {
      AnswerDtos[index].active = !AnswerDtos[index].active;
      this.setState({
        AnswerDtos,
      });
    }
  }
  clickPre() {
    let answerSelectedDtoList = this.state.answerSelectedList;
    let answerCodes = [];
    this.state.AnswerDtos.map((v) => {
      if (v.active) {
        answerCodes.push(v.answerCode);
      }
    });
    this.setState({
      currentCode: this.state.preCode,
    });
    this.props.questionNaire(
      {
        questionCode: this.state.preCode,
        answerDtos: answerSelectedDtoList,
        pageNo: 1,
      },
      (callback) => {
        if (callback) {
          let resData = callback;
          let checkList = {};
          resData.pageDto.records.map((v) => (v.active = false));
          answerSelectedDtoList.map((v) => {
            if (v.questionCode == this.state.preCode) {
              checkList = v;
            }
          });
          resData.pageDto.records.map((v) => {
            if (checkList.answerCodes.indexOf(v.answerCode) > -1) {
              v.active = true;
            }
          });
          this.setState({
            QuestionAnswerDto: resData,
            AnswerDtos: resData.pageDto.records,
            preCode: resData.preQuestionCode,
            nextCode: resData.nextQuestionCode,
          });
        }
      }
    );
  }
  clickNext() {
    let answerSelectedDtoList = this.state.answerSelectedList;
    let answerCodes = [];
    this.state.AnswerDtos.map((v) => {
      if (v.active) {
        answerCodes.push(v.answerCode);
      }
    });
    if (answerCodes.length <= 0) return alert("请选择答案");
    answerSelectedDtoList.push({
      answerCodes,
      questionCode: this.state.currentCode,
    });
    let Obj = answerSelectedDtoList.reduce((total, cur) => {
      let hasValue = total.findIndex((current) => {
        return current.questionCode === cur.questionCode;
      });
      hasValue === -1 && total.push(cur);
      hasValue !== -1 &&
        (total[hasValue].answerCodes = Array.from(
          new Set([...cur.answerCodes])
        ));
      return total;
    }, []);
    this.setState({
      currentCode: this.state.nextCode,
      answerSelectedList: Obj,
    });
    this.props.questionNaire(
      { questionCode: this.state.nextCode, answerDtos: Obj, pageNo: 1 },
      (callback) => {
        if (callback) {
          let resData = callback;
          resData.pageDto.records.map((v) => (v.active = false));
          this.setState({
            QuestionAnswerDto: resData,
            AnswerDtos: resData.pageDto.records,
            preCode: resData.preQuestionCode,
            nextCode: resData.nextQuestionCode,
          });
        }
      }
    );
  }
  touchStart(e) {
    let touch = e.touches[0]; //获取第一个触点
    //记录触点初始位置
    this.setState({
      startX: touch.pageX, //页面触点X坐标
      startY: touch.pageY, //页面触点Y坐标
    });
  }
  touchMove(e) {
    let touch = e.touches[0]; //获取第一个触点
    //记录触点初始位置
    this.setState({
      endX: touch.pageX, //页面触点X坐标
      endY: touch.pageY, //页面触点Y坐标
    });
    let abs = Math.abs(this.state.endY - this.state.startY);
    let QuestionAnswerDto = this.state.QuestionAnswerDto;
    if (abs > 10) {
      let pageNo = this.state.pageNo;
      if (
        QuestionAnswerDto &&
        QuestionAnswerDto.pageDto &&
        QuestionAnswerDto.pageDto.currentPage *
          QuestionAnswerDto.pageDto.pageSize >=
          QuestionAnswerDto.pageDto.totalRecordsCount
      )
        return;

      this.props.questionNaire(
        {
          questionCode: this.state.currentCode,
          answerDtos: this.state.answerSelectedList,
          pageNo: pageNo + 1,
        },
        (callback) => {
          if (callback) {
            let resData = callback;
            this.setState({
              QuestionAnswerDto: resData,
              AnswerDtos: [
                ...QuestionAnswerDto.pageDto.records,
                ...resData.pageDto.records,
              ],
            });
          }
        }
      );
    }
  }
  touchEnd() {
    if (Math.abs(this.state.endY) > 50) {
    }
  }
  clickResult() {
    let answerSelectedDtoList = this.state.answerSelectedList;
    let answerCodes = [];
    this.state.AnswerDtos.map((v) => {
      if (v.active) {
        answerCodes.push(v.answerCode);
      }
    });
    if (answerCodes.length <= 0) return alert("请选择答案");
    answerSelectedDtoList.push({
      answerCodes,
      questionCode: this.state.currentCode,
    });
    this.setState({
      currentCode: this.state.nextCode,
    });
    this.props.questionSkuList(
      { answerDtos: answerSelectedDtoList },
      (callback) => {
        this.props.selectedObj(answerSelectedDtoList);
        if (callback) {
          if (device.isApp()) {
            // 虚拟试妆按钮调用APP端接口
            if (callback.results && callback.results.records.length > 0) {
              let dataSku = callback.results.records.map((item) => {
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
                    that.props.objfun(callback.results);
                  }
                },
              };
              dynamic.sepBridge().then((sep) => {
                sep.vaSkuFinder && sep.vaSkuFinder(config);
              });
              setTimeout(() => {
                if (that.state.timenum !== 1) {
                  that.props.objfun(callback.results);
                }
              }, 1000);
            } else {
              this.props.objfun(callback.results);
            }
          } else {
            this.props.objfun(callback.results);
          }
          this.setState({ isOver: true });
        }
      }
    );
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
  render() {
    const { QuestionAnswerDto, AnswerDtos, isOver } = this.state;
    if (QuestionAnswerDto && QuestionAnswerDto.preQuestionCode) {
      this.state.isPre = true;
    } else {
      this.state.isPre = false;
    }
    if (QuestionAnswerDto && QuestionAnswerDto.nextQuestionCode) {
      this.state.isNext = true;
    } else {
      this.state.isNext = false;
    }
    let name = "";
    let resultLi =
      AnswerDtos &&
      AnswerDtos.map((item, index) => {
        if (AnswerDtos && AnswerDtos.length > 6) {
          name = "answer_item_short";
        } else {
          name = "answer_item_long";
        }
        return (
          <li
            className={`${name} ${item.active == true ? "active" : ""}`}
            key={index}
            index={index}
            onClick={this.selectClick.bind(this, index, item.answerId)}
          >
            {item.answerDesc}
          </li>
        );
      });
    return (
      <div>
        {isOver ? (
          <QuizResult />
        ) : (
          <div className="start_main_page">
            <div className="main_page">
              <div className="subject_num">
                {QuestionAnswerDto && QuestionAnswerDto.currentQuestionNo}
                <span>
                  /{QuestionAnswerDto && QuestionAnswerDto.totalQuestionNo}
                </span>
              </div>
              <div className="subject_title">
                {QuestionAnswerDto && QuestionAnswerDto.title}
              </div>
              <ul
                className="select_ul"
                onTouchStart={this.touchStart}
                onTouchMove={this.touchMove}
                onTouchEnd={this.touchEnd}
              >
                {resultLi}
              </ul>
              <div className="arrow_num">
                {this.state.isPre ? (
                  <div
                    key="index_prw"
                    className="pre_num"
                    onClick={this.clickPre.bind(this)}
                  >
                    <em className="icon-arrow" />上一题
                  </div>
                ) : null}
                {this.state.isNext ? (
                  <div
                    key="index_next"
                    className="next_num"
                    onClick={this.clickNext.bind(this)}
                  >
                    下一题
                    <em className="icon-arrow" />
                  </div>
                ) : (
                  <div
                    key="index_next"
                    className="next_num"
                    onClick={this.clickResult.bind(this)}
                  >
                    查看结果
                    <em className="icon-arrow" />
                  </div>
                )}
              </div>
              <div className="bottom_txt">
                LIP <span>FINDER</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = () => {};
export default connect(mapStateToProps, {
  questionNaire,
  questionSkuList,
  objfun,
  selectedObj,
})(QuestionItem);
