/**
 * Created by summer
 * 香水定制内容
 */
import React from "react";
import { connect } from "react-redux";

import { popupAlert } from "../../actions/popup";
import PopupAlert from "../PopupAlert/index";
import * as regexp from "../../lib/regexp";
import {
  showLipPerfumePage,
  getMiuMiuStepTwoDetail,
  getMiuMiuStepThreeDetail,
} from "../../actions/PerfumesDetailsPage";
import CdnImage from "../CdnImage";
class FilterPerfumeText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  goToNextStep(step, skuid) {
    let { getMiuMiuStepTwoDetail, getMiuMiuStepThreeDetail, _data, _oneData, popupAlert } =
      this.props;
    let spuId = regexp.searchProductId(window.location);
    if (step == "three") {
      if (!_oneData.totalInv) {
        window.location.href = "/v2/html/filterPerfumeSoldOut";
        return;
      } else {
        if (_data.hasInv) {
          getMiuMiuStepTwoDetail(spuId, skuid);
        } else {
          popupAlert(1, "PopupAlertDefault", {
            _text: "该款香水已售罄，请重新选择",
            _autoClose: true,
          });
          return;
        }
      }
      //第二步
    } else {
      if (!_data.stepTwoTotalInv) {
        window.location.href = "/v2/html/filterPerfumeSoldOut";
        return;
      }
      let odorsku = regexp.searchOdorSku(window.location);
      let lidsku = regexp.searchLidSku(window.location);
      let bodysku = regexp.searchBodySku(window.location);
      _data.partTwoDtos.map((v) => {
        if (v.selected) {
          bodysku = v.skuId;
          let currentsearch = window.location.search;
          let bodyreg = /bodysku=/;
          let condition = /bodysku=[0-9]*/;
          if (currentsearch) {
            if (bodyreg.test(currentsearch)) {
              history.replaceState(
                `&bodysku=${bodysku}`,
                "",
                currentsearch.replace(condition, "bodysku=" + bodysku),
              );
            } else {
              history.replaceState(
                `&bodysku=${bodysku}`,
                "",
                currentsearch + "&bodysku=" + bodysku,
              );
            }
          } else {
            history.replaceState(`&bodysku=${bodysku}`, "", "&bodysku=" + bodysku);
          }
        }
      });
      getMiuMiuStepThreeDetail(spuId, odorsku, lidsku, bodysku);
    }
    this.goToPreStep(step);
  }
  goToPreStep(val) {
    if (val) {
      let currentsearch = window.location.search;
      let step = /step=/;
      let condition = /step=[a-z]*/;
      if (currentsearch) {
        if (step.test(currentsearch)) {
          history.replaceState(`&step=${val}`, "", currentsearch.replace(condition, "step=" + val));
        } else {
          history.replaceState(`&step=${val}`, "", currentsearch + "&step=" + val);
        }
      } else {
        history.replaceState(`&step=${val}`, "", "&step=" + val);
      }
      this.props.showLipPerfumePage(val);
    }
  }
  render() {
    let { _data, _step } = this.props;
    let nextStep, preStep;
    switch (_step) {
      case "two":
        nextStep = "three";
        preStep = "one";
        break;
      case "three":
        nextStep = "four";
        preStep = "two";
        break;
      default:
        break;
    }
    let lidName, bodyName, bColorCode1, bColorCode2, combImage, lidPic, bodyPic;
    _data &&
      _data.partOneDtos &&
      _data.partOneDtos.map((v) => {
        if (v.selected) {
          lidName = v.skuName;
          bColorCode1 = v.bColorCode;
          lidPic = v.imagePartName;
        }
      });
    _data &&
      _data.partTwoDtos &&
      _data.partTwoDtos.map((v) => {
        if (v.selected) {
          bodyName = v.skuName;
          bColorCode2 = v.bColorCode;
          bodyPic = v.imagePartName;
        }
      });
    if (lidPic && bodyPic) {
      combImage = `${_data && _data.mainSkuImage}${lidPic}${bodyPic}`;
    }

    return (
      <div>
        {_step == "three" ? (
          <div className="filterPerfume-box">
            <div className="filterPerfume-pic-combination-box">
              <div className="filterPerfume-pic-combination-bg">
                <div
                  className="filterPerfume-pic-combination-bg-item1"
                  style={{ background: bColorCode1 }}
                 />
                {bColorCode1 || bColorCode2 ? (
                  <div
                    className="filterPerfume-pic-combination-bg-item2"
                    style={{ background: "#fff" }}
                   />
                ) : null}
                <div
                  className="filterPerfume-pic-combination-bg-item3"
                  style={{ background: bColorCode2 }}
                 />
                {combImage ? (
                  <img className="filterPerfume-pic-combination-pic" src={`${combImage}`} />
                ) : null}
              </div>
            </div>

            <div className="perfume-content">
              <CdnImage className="step-two" src={"/soa/nmobile/img/miumiu/STEP2.png"} />
              <p className="select-title">{_data && _data.stepTitle}</p>
              <p className="select-name">{_data && _data.spuName}</p>
              <div className="select-desc">
                <p>{lidName}</p>
                <p>{bodyName}</p>
              </div>

              <div className="desin-btn">
                <button
                  className="next-btn"
                  onClick={this.goToNextStep.bind(this, nextStep, _data && _data.skuId)}
                >
                  确定搭配
                  <CdnImage src="/soa/nmobile/img/miumiu/arrow.png" />
                </button>
                <div className="last-step" onClick={this.goToPreStep.bind(this, preStep)}>
                  上一步
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="filterPerfume-box">
            <img className="filterPerfume-pic" src={_data && _data.image2} />
            <div className="perfume-content">
              <p className="name-cn">{_data && _data.skuName}</p>
              <p className="name-type"> {_data && _data.skuSpecCn}</p>
              <p className="name-en">{_data && _data.slogan}</p>
              <div className="desin-btn">
                <button
                  className="next-btn"
                  onClick={this.goToNextStep.bind(this, nextStep, _data && _data.skuId)}
                >
                  为TA装扮
                  <CdnImage src="/soa/nmobile/img/miumiu/arrow.png" />
                </button>
                <div className="last-step" onClick={this.goToPreStep.bind(this, preStep)}>
                  上一步
                </div>
              </div>
            </div>
            <PopupAlert _zIndex={1001} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {
  showLipPerfumePage,
  getMiuMiuStepTwoDetail,
  getMiuMiuStepThreeDetail,
  popupAlert,
})(FilterPerfumeText);
