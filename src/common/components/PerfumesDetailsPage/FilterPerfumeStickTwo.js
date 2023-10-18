/*
 * @Author: Martin.song
 * @LastEditors: Martin.song
 * @Descripttion: 
 * @version: 0.2
 * @Date: 2021-03-23 16:05:32
 * @LastEditTime: 2021-03-23 17:38:43
 */
/**
 * Created by summer
 * 香水定制第二步
 */

import React from "react";
import { connect } from "react-redux";
import FilterPerfumeHeader from "./FilterPerfumeHeader";
import FilterPerfumeText from "./FilterPerfumeText";
import ComponentPdpSpecialTop from "./PdpSpecialTop";
class FilterPerfumeStickTwo extends React.Component {
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

  render() {
    let showWhichPage = this.props.pdpFilterPage;
    let StepTwoInfo = this.props.PdpFilterTwo;
    let renderData = this.props.PDP_IS_OPEN_FILTER_ORIGIN;
    return (
      <div
        className={showWhichPage && showWhichPage == "two" ? "filterPerfumeStick-container-two" : "disappear"}
        style={{ background: StepTwoInfo && StepTwoInfo.bColorCode }}
      >
        <ComponentPdpSpecialTop
          key="ComponentPdpSpecialTop"
          _changeStyle="filter-color-title"
          _keyWordStyle="_keyWordStyle"
        />
        <FilterPerfumeHeader _data={renderData && renderData} />
        <div className="main-pic">
          <img src={StepTwoInfo && StepTwoInfo.image1} />
        </div>
        <FilterPerfumeText _data={StepTwoInfo && StepTwoInfo} _oneData={renderData} _step={"two"} />
        <div className="sub-pic" style={{ background: StepTwoInfo && StepTwoInfo.bColorCode }}>
          <img src={StepTwoInfo && StepTwoInfo.image3} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = s => {
  const { product } = s;
  const { pdpFilterPage, PdpFilterTwo, PDP_IS_OPEN_FILTER_ORIGIN } = product;
  return {
    pdpFilterPage,
    PdpFilterTwo,
    PDP_IS_OPEN_FILTER_ORIGIN,
  };
};

export default connect(mapStateToProps, {})(FilterPerfumeStickTwo);
