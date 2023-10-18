import React from "react";

/**
 * 自定义checkbox，传入状态和初始值
 *  statue：cur选中、disable不可用
 * propGation:是否阻止冒泡：yes阻止
 *  callback:回调函数、传回参数为对象包括是否选中isCheck:yes选中、no未选中、val:初始值
 */
class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.executeCallback = this.executeCallback.bind(this);
  }
  componentDidMount() {}
  executeCallback(e) {
    let { callback, para } = this.props;
    if (e.currentTarget.className.indexOf("disable") != -1) {
      return;
    }
    callback ? callback(para) : "";
  }
  render() {
    let { statue, injectClass, disabled } = this.props;
    statue = statue && statue == "1" ? "cur" : "";
    let initClass = injectClass
      ? "common-checkbox " + injectClass
      : "common-checkbox";

    return (
      <div
        className={initClass + " " + statue + (disabled ? "disabled" : "")}
        ref="checkbox"
        onClick={this.executeCallback}
      >
        <input type="checkbox" className="checkbox" />
        <em className="statue" />
      </div>
    );
  }
}
export default CheckBox;
