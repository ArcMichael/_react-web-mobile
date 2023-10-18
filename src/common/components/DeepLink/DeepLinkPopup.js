import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAppVersion } from "../../actions/deepLinkPopup";
import Sensor from "../../Utils/sensor";
import getRunEnv from "../../../isomorphisms/getRunEnv";

class DeepLinkPopup extends React.Component {
  constructor(props) {
    super(props);
    this.jumpHandle = this.jumpHandle.bind(this);
    this.openApp = this.openApp.bind(this);
    this.state = {
      version: "",
    };
  }

  componentDidMount() {
    this.props.getAppVersion((version) => {
      this.setState({ version });
    });
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflow = "visible";
  }

  jumpHandle(link) {
    this.props.closeHandle(() => {
      window.location.href = link;
    });
  }

  openApp() {
    Sensor.go("popup_downloadApp", {
      button_location: "下载丝芙兰APP",
      current_url: window.location.href,
      action_id:"1000001_962",
      page_id:"MB_1000001",
      $element_content:"下载丝芙兰APP",
      button_name: "下载丝芙兰APP"
 
    });
    this.props.closeHandle(() => {
      this.props.openApp();
    });
  }

  render() {
    const { isShowPopup } = this.props;
    const { version } = this.state;
    return (
      <div className={`downloadAppPopup ${isShowPopup ? "cur" : ""}`}>
        <div className="downloadAppPopup-container">
          <div className="downloadAppPopup-title">
            <p>访问丝芙兰APP</p>
            <p>体验更多精彩功能</p>
          </div>
          <div className="downloadAppPopup-info">
            <div>开发者：丝芙兰（上海）化妆品销售有限公司</div>
            <div>版本：{version}</div>
            <div>
              应用涉及及权限：
              <a
                onClick={() =>
                  this.jumpHandle(
                    `https://${
                      getRunEnv() === "stage" ? "sslstage4" : "ssl4"
                    }.sephorastatic.cn/legal/sephora_authorization.html`
                  )
                }
              >
                {"点击查看>"}
              </a>
            </div>
            <div>
              隐私权限：
              <a
                onClick={() =>
                  this.jumpHandle(
                    "https://ssl4.sephorastatic.cn/legal/app_privacy_policy.html"
                  )
                }
              >
                {"点击查看>"}
              </a>
            </div>
          </div>
          <div className="downloadAppPopup-bottom">
            <div
              className="downloadAppPopup-cancel"
              onClick={() => this.props.closeHandle()}
            >
              继续逛逛
            </div>
            <div className="downloadAppPopup-download" onClick={this.openApp}>
              下载丝芙兰APP
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    getAppVersion: bindActionCreators(getAppVersion, dispatch),
    dispatch,
  })
)(DeepLinkPopup);
