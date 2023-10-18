/*
 * @Author: leo.si
 * @Date: 2019-04-14 15:47:09
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-23 11:40:37
 * @function 限流页面
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import Button from "../components/AtomsInput/Button";
import { getCurrentlimitingWord, checkIsLimited } from "../actions/currentLimiting";
import CurrentLimitingForMiniprogram from "../Utils/currentLimit";
import { preLoadImg } from "../actions/nichefragrance";
import getConfigs from "../../isomorphisms/getConfigs";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/CurrentLimiting.scss");
}

const configs = getConfigs();

class Currentlimiting extends React.Component {
  constructor(props) {
    super(props);
    this.checkLimitedStatus = this.checkLimitedStatus.bind(this);
    this.state = {
      imgUrl: `${configs.static}/soa/nmobile/img/currentLimit/match-machine0.gif`,
      currentLimitingWordF: "",
      currentLimitingWordS: "",
      btnStatus: 0,
      currentClientHeight: "",
      count: 0,
      text: "等待刷新",
      countDown: 60,
    };
  }

  componentDidMount() {
    if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) {
      CurrentLimitingForMiniprogram.h5InvokeMiniprogram();
    }
    this.setState({
      currentClientHeight: window.document.documentElement.clientHeight,
    });
    this.props.getCurrentlimitingWord((callback) => {
      this.setState({
        currentLimitingWordF: callback && callback.firstWord,
        currentLimitingWordS: callback && callback.secondWord,
      });
    });
    this.setCountDown(60);
  }

  // 设置倒计时
  setCountDown(totalCount = 60) {
    let countDown = totalCount;
    this.timer = setInterval(() => {
      this.setState(
        {
          countDown: --countDown,
        },
        () => {
          countDown === 0 && clearInterval(this.timer);
          if (countDown === 0) {
            this.setState({
              btnStatus: 1,
              text: "刷新",
            });
          }
        },
      );
    }, 1000);
  }

  checkLimitedStatus() {
    // this.setState({ btnStatus: 2 })
    const { count } = this.state;
    this.props.checkIsLimited((callback) => {
      const nowCount = count + 1 > 3 ? 1 : count + 1;
      if (!callback)
        this.setState(
          {
            btnStatus: 0,
            count: nowCount,
            imgUrl: `${configs.static}/soa/nmobile/img/currentLimit/match-machine${nowCount}.gif`,
            text: "等待刷新",
            countDown: 60,
          },
          () => {
            this.setCountDown(60);
          },
        );
    });
  }

  render() {
    const {
      imgUrl,
      currentLimitingWordF,
      currentLimitingWordS,
      btnStatus,
      currentClientHeight,
      text,
      countDown,
    } = this.state;
    // const _divStyle = {
    //   height: currentClientHeight,
    //   backgroundImage: `url(${imgUrl}?${new Date().getTime()})`,
    //   backgroundRepeat: 'no-repeat',
    //   backgroundPosition: 'center',
    //   backgroundSize: '100%, 100%',
    // }
    if (!currentClientHeight) return <div />;
    return (
      // <div className='current_limiting_page' style={{ height: currentClientHeight }}>
      <div className="current_limiting_page">
        <div className="current_limiting_page_img_div" style={{ height: currentClientHeight }}>
          <img
            className="current_limiting_page_img"
            style={{ top: `${currentClientHeight * 0.3}px` }}
            src={`${imgUrl}?${countDown === 0 ? new Date().getTime() : ""}`}
          />
        </div>
        {/* <img className='current_limiting_page_img' src={imgUrl} style={{ height: currentClientHeight }} /> */}
        <p
          className="current_limiting_page_word_f"
          style={{ bottom: `${currentClientHeight * 0.365}px` }}
        >
          {currentLimitingWordF}
        </p>
        <p
          className="current_limiting_page_word_s"
          style={{ bottom: `${currentClientHeight * 0.3}px` }}
        >
          {currentLimitingWordS}
        </p>
        <div
          className="current_limiting_page_btn"
          style={{ bottom: `${currentClientHeight * 0.17}px` }}
        >
          <Button
            _text={`${text}${countDown === 0 ? "" : `(${countDown})`}`}
            _height="72"
            _status={btnStatus}
            _clickCallback={this.checkLimitedStatus}
            _bottomShortLine={false}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  getCurrentlimitingWord,
  checkIsLimited,
  preLoadImg,
})(Currentlimiting);
