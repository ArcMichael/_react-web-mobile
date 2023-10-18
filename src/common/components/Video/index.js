/*
 * @Author: siqiang
 * @Date: 2019-03-22 10:42:54
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 11:29:57
 * @Function 视屏组件封装
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: null,
    };
    this.myRef = React.createRef();
    this.control = this.control.bind(this);
  }

  componentDidMount() {}

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  // 根据当前视频的状态处理 是要播放视频还是暂停
  control() {
    const target = this.myRef.current;
    const status = target.paused;
    if (status) {
      target.play();
    } else {
      target.pause();
    }
  }

  render() {
    const { src, poster = "", width, height } = this.props;
    // 没有传递src 返回空
    if (!src) return "";
    const { hasError } = this.state;
    if (hasError) {
      return <h1>组件出错了</h1>;
    }
    return (
      <div className="videoBox">
        <video
          poster={poster}
          ref={this.myRef}
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-playsinline="true"
          webkit-playsinline="true"
          playsInline="true"
          src={src}
          width={width}
          height={height}
          controls
        >
          设备不支持
        </video>
      </div>
    );
  }
}

Video.propTypes = {
  // 视频地址
  src: PropTypes.string.isRequired,
  // 封面
  poster: PropTypes.string,
  // 视频的宽度
  width: PropTypes.string,
  // 视频的高度
  height: PropTypes.string,
};
export default Video;
