/**
 * MQiu
 * create 2019 3 11
 * 第一次加载迷你图
 * 第二次从内存中下载图片
 * 第三次替换迷你图
 * 基于background
 */

import React from "react";
import PreloadImage from "./PreloadImage";

class AnyImagesRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memoryLoaderState: false,
    };
  }

  componentDidMount() {
    const _preloadImage = new PreloadImage();
    const { _origin } = this.props;
    this.setState({ ...this.props }, () => {
      _preloadImage
        .render(_origin)
        .then((memoryLoaderState) => this.setState({ memoryLoaderState }))
        .catch((err) => console.log(err));
    });
  }

  render() {
    const { _mini, _origin, _style } = this.props;
    const { memoryLoaderState } = this.state;

    const style = {
      ..._style,
      backgroundImage: `url(${memoryLoaderState ? _origin : _mini})`,
    };

    // return <img src={memoryLoaderState ? _origin : _mini} />
    return <div style={style} />;
  }
}

export default AnyImagesRender;
