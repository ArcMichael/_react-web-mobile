/* eslint-disable import/extensions */
/* eslint-disable global-require */
import React, { Component } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import CdnImage from "@/components/CdnImage";
import LazyloadImage from "@/components/LazyloadImage";
import * as action from "../../../lib/BLL";
import { urlGetParams } from "../../../lib/url";

if (__DEV__ && isBrowser()) {
  require("../../../../public/style/default.scss");
  require("../../../../public/style/questionnaire.scss");
}

const ClinetHeight = window.innerHeight;
// 热搜词列表页
class ProblemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList:[],
      tabSpeed: true,
      speed:0,
      errorIndex: null
    };
    this.sumbit = this.sumbit.bind(this);
    this.bindHandleScroll = this.bindHandleScroll.bind(this);
  }

  componentDidMount(){
    action.getQuestionnaire(urlGetParams(window.location, "id"), (res) => {
      if(res.jQueryStatus.status === 200){
        this.setState({
          questionList: res.results.questionAnswerDtoList
        })
      }
    })
    window.addEventListener('scroll', this.bindHandleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.bindHandleScroll);
  }

  bindHandleScroll = () => {
    const tabSpeed = this.state.tabSpeed
    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if(scrollTop >= ClinetHeight && tabSpeed === true){
      this.setState({ tabSpeed: false })
    }else if(scrollTop < ClinetHeight && tabSpeed === false){
      this.setState({ tabSpeed: true })
    }
  }

  chooseItem(index,id){
    const questionList = this.state.questionList
    const item = questionList[index]
    if(item.type == 1){
      // 单选的情况，检查是否已经选择了
      questionList[index].answerDtoList.map((i,d) => {
        i.check = id === d ? true : false
      })
    }else {
      const uCheck = questionList[index].answerDtoList[id].check
      questionList[index].answerDtoList[id].check = uCheck ? false : true
    }
    // 进行校验答题进度
    let speed = 0;
    questionList.map(item => {
      if(item.answerDtoList.find(i => i.check === true)){
        ++speed;
      }
    })
    this.setState({
      questionList: questionList,
      speed,
      errorIndex: null
    })
  }

  sumbit(){
    const questionList = this.state.questionList
    // 检查是否存在没有选择的题目
    let emptyIndex = null;
    // 进行统计
    let score = 0, answerResult = '';
    questionList.map((item,index) => {
      answerResult =  answerResult + `${index+1}`
      item.answerDtoList.map((it) => {
        score = it.check ? score + it.score : score
        answerResult = it.check ? answerResult + `${it.answerCode}` : answerResult
      })
      if(emptyIndex == null ){
        emptyIndex = item.answerDtoList.find(i => i.check === true) ? emptyIndex : index
      }
      answerResult += ","
    })
    if(emptyIndex !== null){
      const Top = document.getElementsByClassName("lItem")[emptyIndex].offsetTop - 12
      document.body.scrollTop = Top
      document.documentElement.scrollTop = Top
      this.setState({
        errorIndex: emptyIndex
      })
      return
    }
    answerResult.substring(0,answerResult.length-1)
    let data = {
      id: urlGetParams(window.location, "id"),
      activityType: this.props.type,
      answerResult,
      score
    }
    action.setQuestionCommit(data, (res) => {
      if(res.jQueryStatus.status === 200 && res.results){
        // 完成答题
        this.props.setValue({step: 3})
      }
    })
  }

  render() {
    const { questionList, tabSpeed, errorIndex } = this.state
    if(!questionList.length){
      return null
    }
    const speed = parseInt((this.state.speed/questionList.length)*100)
    const speedrote = 180 - speed * 1.8
    const { detailImage, name } = this.props.homeInfo
    return (
      <div className="problemList">
        {
          detailImage && <div className="lHeader">
            <LazyloadImage imgProps={{ className: "bgHeader", src: detailImage }}/>
          </div>
        }
        {
          questionList.map((it,id) => {
            return (<div className="lItem" key={it.title}>
            {
              name && id == 0 && <p className="proTitle">{name}</p>
            }
            <p>
              {`${id+1 < 10 ? '0'+(id+1) : id+1 }`}
              <span>
                {it.title}({it.type === 1 ? "单选" : "多选"})
                <span className="mustText">*</span>
                { errorIndex != null && errorIndex === id && <div className="weida">未答</div>}
              </span>
            </p>
            <ul>
              {
                it.answerDtoList.map((i,d) => {
                  let imgCheck = "https://sslstage1.sephorastatic.cn/soa/nmobile/img/quest/empty.png"
                  if(i.check && it.type == 1){
                    imgCheck = "https://sslstage1.sephorastatic.cn/soa/nmobile/img/quest/select.png"
                  }else if(i.check && it.type == 2){
                    imgCheck = "https://sslstage1.sephorastatic.cn/soa/nmobile/img/quest/moreCheck.png"
                  }
                  return (
                    <li className={ i.check && "activeL" } key={i.answerContent} onClick={() => {this.chooseItem(id,d)}}>
                      { this.props.type == 2 && `${i.answerCode}  `}{i.answerContent}
                      { i.check && it.type == 1 && <img className= "click-btn" src={imgCheck}/> }
                      { i.check && it.type == 2 && <img className= "click-btn" src={imgCheck}/> }
                      { !i.check && <img className= "click-btn" src={imgCheck}/> }
                    </li>
                  )
                })
              }
            </ul>
          </div>)
          })
        }
        {
          tabSpeed && <div className="lSpeedBox">
            <p>
              答题进度
              <div>
                <span style={{width: `${speed}%`}} />
              </div>
            </p>
          </div>
        }
        {
          !tabSpeed && <div className="lCirBox">
            <div className="lCirBoxBor" style={{transform: `rotate(-${speedrote}deg)`}}>
              <CdnImage className="lCirBg" src="/soa/nmobile/img/quest/circular.png"/>
              {/* <LazyloadImage imgProps={{ className: "lCirBg", src: "http://dabao.jylland.cn/3x.png" }}/> */}
            </div>
            
          </div>
        }
        <div className="lSumbit" onClick={this.sumbit} style={{marginBottom:'0.4rem'}}>提交</div>
      </div>
    );
  }
}

export default ProblemList;