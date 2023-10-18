import React from "react";
import { connect } from "react-redux";
import Dynamic from "@/Utils/Dynamic";
import { pushBack } from "../../lib/url";
import * as device from "../../lib/device";

const dynamic = new Dynamic();
class PdpSpecialTop extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {};
  }
  componentDidMount() {}
  callback(e) {
    e.stopPropagation();
    let { backUrl, callback, goBack } = this.props;
    if (device.isApp()) {
      dynamic.sepBridge().then((sep) => {
        sep.closeWeb && sep.closeWeb();
      });
    } else {
      if (callback) {
        callback();
      } else {
        if (backUrl) {
          window.location.href = backUrl;
        } else {
          pushBack("", goBack);
        }
      }
    }
  }

  render() {
    let { title, _changeStyle, keyWord, color } = this.props;
    let paddingTop;
    if (typeof window !== "undefined") {
      paddingTop = device.isApp() ? "0.88rem" : "0";
    }
    return (
      <div className="PdpSpecialTop" style={{ backgroundColor: color, paddingTop: paddingTop }}>
        <a className="btn-back" onClick={this.callback} />
        <label className={_changeStyle}>
          {title}
          {keyWord}
        </label>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  () => ({}),
)(PdpSpecialTop);
