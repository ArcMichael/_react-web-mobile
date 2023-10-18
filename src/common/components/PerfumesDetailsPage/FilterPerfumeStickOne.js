/**
 * Created by summer
 * 香水定制第一步
 */

import React from "react";
import { connect } from "react-redux";
import {
  showLipPerfumePage,
  selectPerfumeOdor,
} from "../../actions/PerfumesDetailsPage";
import CdnImage from "../CdnImage";
import FilterPerfumeHeader from "./FilterPerfumeHeader";
import ComponentPdpSpecialTop from "./PdpSpecialTop";
class FilterPerfumeStickOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isApp: false,
    };
  }
  componentDidMount() {
    const { isApp } = this.state; // TODO: 请移除无用state
    console.log(isApp);
  }
  selectPerfumeStick(data) {
    // if (data.hasInv > 0) {
    let currentsearch = window.location.search;
    let odorsku = /odorsku=/;
    let condition = /odorsku=[0-9]*/;
    if (currentsearch) {
      if (odorsku.test(currentsearch)) {
        history.replaceState(
          `&odorsku=${data.skuId}`,
          "",
          currentsearch.replace(condition, "odorsku=" + data.skuId)
        );
      } else {
        history.replaceState(
          `&odorsku=${data.skuId}`,
          "",
          currentsearch + "&odorsku=" + data.skuId
        );
      }
    } else {
      history.replaceState(
        `&odorsku=${data.skuId}`,
        "",
        "&odorsku=" + data.skuId
      );
    }
    this.props.selectPerfumeOdor(data.skuId);
    this.goToNextStepTwo();
    // } else {
    // window.location.href = "/v2/html/filterPerfumeSoldOut";
    // }
  }

  goToNextStepTwo() {
    let currentsearch = window.location.search;
    let step = /step=/;
    let condition = /step=[a-z]*/;
    let val = "two";
    if (currentsearch) {
      if (step.test(currentsearch)) {
        history.replaceState(
          `&step=${val}`,
          "",
          currentsearch.replace(condition, "step=" + val)
        );
      } else {
        history.replaceState(
          `&step=${val}`,
          "",
          currentsearch + "&step=" + val
        );
      }
    } else {
      history.replaceState(`&step=${val}`, "", "&step=" + val);
    }
    this.props.showLipPerfumePage(val);
  }

  render() {
    let showWhichPage = this.props.pdpFilterPage;
    let renderData = this.props.PDP_IS_OPEN_FILTER_ORIGIN;
    let selectList = renderData && renderData.skuDetailDtos;
    return (
      <div
        className={
          showWhichPage && showWhichPage == "one"
            ? "filterPerfumeStick-container-one"
            : "disappear"
        }
      >
        <ComponentPdpSpecialTop
          key="ComponentPdpSpecialTop"
          _changeStyle="filter-color-title"
          _keyWordStyle="_keyWordStyle"
          color={"#f9e6df"}
        />
        <FilterPerfumeHeader _data={renderData && renderData} />
        <div className="one-container-title">
          <CdnImage src="/soa/nmobile/img/miumiu/STEP1.png" />
          <div>
            <span>{renderData && renderData.stepTitle}</span>
            <span>点击1张香水图片</span>
          </div>
        </div>
        <div className="one-box">
          {selectList &&
            selectList.map((data, i) => (
              <img
                className="step1-img"
                key={`select-img-${i}`}
                src={data.mImage}
                alt=""
                onClick={this.selectPerfumeStick.bind(this, data)}
              />
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  const { product } = s;
  const { pdpFilterPage, PDP_IS_OPEN_FILTER_ORIGIN } = product;
  return {
    pdpFilterPage,
    PDP_IS_OPEN_FILTER_ORIGIN,
  };
};

export default connect(mapStateToProps, {
  showLipPerfumePage,
  selectPerfumeOdor,
})(FilterPerfumeStickOne);
