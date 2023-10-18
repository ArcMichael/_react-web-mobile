import React from "react";
import { connect } from "react-redux";

class DonateMutation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      normalIndex: 0,
      integral: 0,
      value: 0,
      // isDonate: false,
      available: true,
    };
  }

  componentDidMount() {
    const { integral } = this.state; // TODO: 请移除无用state
    console.log(integral);
    const { content } = this.props;
    if (content.length > 0) {
      this.changeTag(content[0], 0);
    }
  }
  cancelModal = () => {
    const { isDonate, cancelModale } = this.props;
    if (isDonate) {
      cancelModale();
    }
  };
  showDonate() {
    const { showDonate } = this.props;
    showDonate();
  }
  //   获取不同的捐赠状态
  changeTag(item, index) {
    if (item) {
      this.setState({
        normalIndex: index,
        integral: item.integral,
        value: item.value,
        available: item.available,
        item,
      });
    }
  }
  render() {
    const { value, normalIndex, available, item } = this.state;

    // remainPoint 剩余积分
    const { content, donateHandler, remainPoint, isDonate, buttonShow } =
      this.props;
    return (
      <div className="donateBtnContainer">
        <div className="modalContainer" />
        {!isDonate && remainPoint && (
          <div className="normal">
            <a
              onClick={() => {
                this.showDonate();
              }}
            >
              立即捐赠
            </a>
          </div>
        )}
        {!isDonate && !remainPoint && (
          <div className="full">
            <a>感谢您的参与，今日爱心捐赠已满</a>
          </div>
        )}
        {}
        {isDonate && (
          <div
            className="donate"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="closeBtn" onClick={this.cancelModal}>
              {" "}
              <span>
                {" "}
                <img
                  className="closeIcon"
                  src="https://ssl1.sephorastatic.cn/soa/nmobile/img/close_icon.png"
                  alt=""
                />
              </span>
            </div>
            <div className="description">
              <img
                className="titleIcon"
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/charitylogo.png"
                alt=""
              />
              <div className="descriptionTxt">
                <p className="title">积分公益捐</p>
                <p className="comm">
                  爱心接力，美力传递；助力丝芙兰微笑公益行动，守护兔唇宝宝的微笑
                </p>
                <p className="tip">
                  可为该项目带来捐款{value}元，点击“确认捐赠”即完成积分捐赠
                </p>
                {/* 捐赠{integral}积分可为该项目带来{value}元 */}
              </div>
            </div>
            <div className="intergalSelect">
              <p className="title">选择</p>
              <ul className="intergalUl">
                {content &&
                  content.map((item, index) => {
                    return (
                      <span>
                        {item.available && (
                          <li
                            key={index + "_" + item.integral + "_" + item.value}
                            className={`${
                              index === normalIndex
                                ? "normalSelected"
                                : "normalUnselected"
                            }`}
                          >
                            <a
                              onClick={() => {
                                this.changeTag(item, index);
                              }}
                            >
                              {item.integral}
                              {item.unit}
                            </a>
                          </li>
                        )}
                        {/* 积分不足 */}
                        {!item.available && (
                          <li
                            key={index + "_" + item.integral + "_" + item.value}
                            className={`${
                              index === normalIndex
                                ? "disableSelected"
                                : "disableUnselected"
                            }`}
                          >
                            <a
                              onClick={() => {
                                this.changeTag(item, index);
                              }}
                            >
                              {item.integral}
                              {item.unit}
                            </a>
                          </li>
                        )}
                      </span>
                    );
                  })}
              </ul>
            </div>
            <div className="donateBtn">
              {available && buttonShow && (
                <a
                  onClick={() => {
                    donateHandler(item);
                  }}
                >
                  确认捐赠
                </a>
              )}
              {available && !buttonShow && (
                <a style={{ background: "#999", borderColor: "#999" }}>
                  确认捐赠
                </a>
              )}
              {!available && <a className="disable">积分不足</a>}
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {})(DonateMutation);
