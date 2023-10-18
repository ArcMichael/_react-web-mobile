/*
 * @Author: Leo.Si
 * @Date: 2020-07-10 10:12:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-10-Fr 11:38:33
 * @function 实现简单倒计时功能
 */
import React, { Component } from "react";
class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      day_hour: 0,
    };
  }
  render() {
    // precision 1 天/时/分/秒
    // precision 2 时/分/秒
    const { precision } = this.props;
    const { day, hour, day_hour, minute, second } = this.state;
    if (second === 0) return null;
    return precision === 1 ? (
      <span>
        <em>{day}</em>
        <em>{day_hour}</em> <span style={{color:'#000'}}>:</span> <em>{minute}</em> <span style={{color:'#000'}}>:</span> <em>{second}</em>
      </span>
    ) : (
      <span>
        <em>{hour}</em> <span style={{color:'#000'}}>:</span> <em>{minute}</em> <span style={{color:'#000'}}>:</span> <em>{second}</em>
      </span>
    );
  }

  componentDidMount() {
    const { endTime } = this.props;
    this.countFun(endTime);
  }

  //卸载组件取消倒计时
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  countFun = (end) => {
    let maxtime = end && end / 1000;
    let timer = null;
    let _this = this;

    if (maxtime >= 0) {
      let day =
        parseInt(maxtime / 86400) > 0 ? parseInt(maxtime / 86400) : "";
      let remainHours = maxtime % (24 * 3600);
      let hour = Math.floor(remainHours / 3600 + day * 24);
      let remainMinutes = remainHours % 3600;
      let minute = Math.floor(remainMinutes / 60);
      let remainSecounds = remainMinutes % 60;
      let second = Math.floor(remainSecounds);
      _this.setState({
        day: day,
        hour: hour < 10 ? "0" + hour : hour,
        minute: minute < 10 ? "0" + minute : minute,
        second: second < 10 ? "0" + second : second,
        day_hour:
          hour - day * 24 < 10 ? "0" + (hour - day * 24) : hour - day * 24,
      });
      --maxtime;
    } else {
      window.location.reload();
    }

    setTimeout(function f() {
      if (maxtime >= 0) {
        let day =
          parseInt(maxtime / 86400) > 0 ? parseInt(maxtime / 86400) : "";
        let remainHours = maxtime % (24 * 3600);
        let hour = Math.floor(remainHours / 3600 + day * 24);
        let remainMinutes = remainHours % 3600;
        let minute = Math.floor(remainMinutes / 60);
        let remainSecounds = remainMinutes % 60;
        let second = Math.floor(remainSecounds);
        _this.setState({
          day: day,
          hour: hour < 10 ? "0" + hour : hour,
          minute: minute < 10 ? "0" + minute : minute,
          second: second < 10 ? "0" + second : second,
          day_hour:
            hour - day * 24 < 10 ? "0" + (hour - day * 24) : hour - day * 24,
        });
        --maxtime;
      } else {
        window.location.reload();

        clearTimeout(timer);
      }
      timer = setTimeout(f, 1000);
    }, 1000);
  };
}
export default CountDown;
