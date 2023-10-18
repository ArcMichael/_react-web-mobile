import React from "react";
import { connect } from "react-redux";
import lottie from "lottie-web";
import getRunEnv from "isomorphisms/getRunEnv";
import { urlGetParams } from "../../lib/url";
import { giftsQuestion } from "../../actions/giftIntelligentRecommendation";
import { popupAlert } from "../../actions/popup";
import PopupAlert from "../PopupAlert/index";
import * as device from "../../lib/device";
import Sensor from "../../Utils/sensor";
import CdnImage from "../CdnImage";
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
      QuestionAnswerDto: {},
    };
  }
  componentDidMount() {
    let questionCode = this.state.currentCode;
    const { pageNo, num, timenum } = this.state; // TODO: 请移除无用state
    console.log(pageNo, num, timenum);
    this.props.giftsQuestion({ questionCode }, (callback) => {
      if (callback) {
        let resData = callback;
        resData.pageDto.records.map((v) => (v.selected = false));
        this.setState({
          QuestionAnswerDto: resData,
          AnswerDtos: resData.pageDto.records,
          preCode: resData.preQuestionCode,
          nextCode: resData.nextQuestionCode,
        });
      }
    });
  }
  componentWillUnmount() {
    this.anim && this.anim.destroy();
  }
  selectClick(index, value) {
    let { popupAlert } = this.props;
    let { AnswerDtos, answerSelectedList, currentCode, QuestionAnswerDto } =
      this.state;
    let answerIds = AnswerDtos.filter((v) => v.selected == true);
    if (QuestionAnswerDto.maxSelected > 1) {
      //多选
      if (answerIds.length < QuestionAnswerDto.maxSelected) {
        AnswerDtos[index].selected = !AnswerDtos[index].selected;
        this.setState({
          AnswerDtos,
        });
      } else {
        if (AnswerDtos[index].selected) {
          AnswerDtos[index].selected = false;
          this.setState({
            AnswerDtos,
          });
        } else {
          popupAlert(1, "PopupToast", {
            _autoClose: true,
            _text: `最多选${QuestionAnswerDto.maxSelected}个哦`,
          });
        }
      }
    } else {
      AnswerDtos.map((v) => {
        if (value.answerCode == v.answerCode) {
          v.selected = true;
        } else {
          v.selected = false;
        }
      });
      this.setState({ AnswerDtos });
    }

    if (!QuestionAnswerDto.nextQuestionCode) {
      Sensor.go("giftSelectionClick", {
        button_name: "是否点击任一预算金额按钮",
        commodity_sku: "",
        OP_code: "",
        if_clickBudget: value.answerDesc,
      });
      this.setState({ isOver: true });
      AnswerDtos.map((v) => {
        if (value.answerCode == v.answerCode) {
          v.selected = true;
          answerSelectedList.push({
            answerCodes: [`${v.answerCode}`],
            questionCode: currentCode,
          });
        } else {
          v.selected = false;
        }
      });
      let container = document.getElementById("lottie"),
        itembox = document.querySelector(".gift_intelligent_box");
      itembox.style.background = "transparent";
      itembox.style.boxShadow = "none";
      container.style.zIndex = "1";
      this.anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/dist/images/jumping_giftbox.json",
      });

      localStorage.setItem("selectInfo", JSON.stringify(answerSelectedList));
      let host = "https://m.sephora.cn",
        env = getRunEnv();
      if (env === "stage") {
        host = "https://stagem.sephora.cn";
      } else if (env === "ebf") {
        host = "https://ebfm.sephora.cn";
      }
      this.anim.addEventListener("loopComplete", () => {
        console.log(device.device_inMiniProgramsEnvironment());
        if (device.device_inMiniProgramsEnvironment()) {
          wx.miniProgram.redirectTo({
            url: `/sp/web?vm=1&nto=1&url=${encodeURIComponent(
              `${host}/v2/html/gift_intelligent_result${window.location.search}`
            )}`,
          });
          this.anim && this.anim.destroy();
        } else {
          window.location.href = `/v2/html/gift_intelligent_result${window.location.search}`;
        }
      });
    }
  }
  clickPre() {
    let answerSelectedDtoList = this.state.answerSelectedList;
    let answerCodes = [];
    this.state.AnswerDtos.map((v) => {
      if (v.selected) {
        answerCodes.push(v.answerCode);
      }
    });
    this.setState({
      currentCode: this.state.preCode,
    });
    this.props.giftsQuestion(
      {
        questionCode: this.state.preCode,
        answerDtos: answerSelectedDtoList,
        pageNo: 1,
      },
      (callback) => {
        if (callback) {
          let resData = callback;
          let checkList = {};
          resData.pageDto.records.map((v) => (v.selected = false));
          answerSelectedDtoList.map((v) => {
            if (v.questionCode == this.state.preCode) {
              checkList = v;
            }
          });
          resData.pageDto.records.map((v) => {
            if (checkList.answerCodes.indexOf(v.answerCode) > -1) {
              v.selected = true;
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
    let { popupAlert } = this.props;
    let answerSelectedDtoList = this.state.answerSelectedList;
    let answerCodes = [];
    this.state.AnswerDtos.map((v) => {
      if (v.selected) {
        answerCodes.push(v.answerCode);
      }
    });
    if (answerCodes.length <= 0)
      return popupAlert(1, "PopupToast", {
        _autoClose: true,
        _text: `请选择答案`,
      });
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
    this.props.giftsQuestion(
      { questionCode: this.state.nextCode, answerDtos: Obj, pageNo: 1 },
      (callback) => {
        if (callback) {
          let resData = callback;
          resData.pageDto.records.map((v) => (v.selected = false));
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
        if (AnswerDtos && AnswerDtos.length == 3) {
          name = "answer_item_odd";
        } else {
          name = "answer_item_even";
        }
        return (
          <li
            key={index}
            index={index}
            onClick={this.selectClick.bind(this, index, item)}
          >
            <div>
              <img src={item.answerImageUrl} alt="" />
              {item.selected ? (
                <CdnImage
                  className="active"
                  src="/soa/nmobile/img/giftRecommend/selected_circle.png"
                  alt=""
                />
              ) : null}
              <span>{item.answerDesc}</span>
            </div>
          </li>
        );
      });

    return (
      <div>
        {!isOver && (
          <div className="main_page">
            <div className="subject_num">
              {QuestionAnswerDto && QuestionAnswerDto.currentQuestionNo}
              <span>
                /{QuestionAnswerDto && QuestionAnswerDto.totalQuestionNo}
              </span>
            </div>
            <div className="subject_title">
              <p>{QuestionAnswerDto && QuestionAnswerDto.title}</p>
              {QuestionAnswerDto && QuestionAnswerDto.maxSelected > 1 && (
                <div className="tip">
                  最多可选{QuestionAnswerDto.maxSelected}种
                </div>
              )}
            </div>
            <ul className={`${name} select_ul`}>{resultLi}</ul>
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
              ) : null}
            </div>
          </div>
        )}
        <div id="lottie" />
        <PopupAlert _zIndex={1001} />
      </div>
    );
  }
}

const mapStateToProps = () => {};
export default connect(mapStateToProps, { giftsQuestion, popupAlert })(
  QuestionItem
);
