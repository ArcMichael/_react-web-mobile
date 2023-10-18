/**
 * MQiu
 * create 2019 3 8
 * 第一次加载迷你图
 * 第二次从内存中下载图片
 * 第三次替换迷你图
 */

import React from "react";
import PreloadImage from "./PreloadImage";
import LazyloadImage from "@/components/LazyloadImage";

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
    const { _mini, _origin, _className } = this.props;
    const { memoryLoaderState } = this.state;
    return _origin && _mini ? (
      <LazyloadImage
          
      imgProps={{
        className:_className,
        src:memoryLoaderState ? _origin : _mini
      }}
     />
    ) : null;

    // return <img className={_className} src={memoryLoaderState ? _origin : _mini} />
  }
}

export default AnyImagesRender;
