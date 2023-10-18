/*
 * @Author: summer
 * @Date: 2021-03-Fr 02:02:24
 * @Last Modified by:   summer
 * @Last Modified time: 2021-03-Fr 02:02:24
 */

import React from "react";
import { connect } from "react-redux";
import {
  getMiuMiuDetail,
  showLipPerfumePage,
  getMiuMiuStepTwoDetail,
  getMiuMiuStepThreeDetail,
} from "../../actions/PerfumesDetailsPage";
import * as regexp from "../../lib/regexp";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/filterPerfumeStick.scss");
}
class FilterPerfumeStick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let { getMiuMiuDetail, showLipPerfumePage, getMiuMiuStepTwoDetail, getMiuMiuStepThreeDetail } =
      this.props;
    let step, spuId, odorsku, lidsku, bodysku;
    step = regexp.searchStep(window.location);
    spuId = regexp.searchProductId(window.location);
    odorsku = regexp.searchOdorSku(window.location);
    lidsku = regexp.searchLidSku(window.location);
    bodysku = regexp.searchBodySku(window.location);
    getMiuMiuDetail(spuId, odorsku);
    getMiuMiuStepTwoDetail(spuId, odorsku);
    getMiuMiuStepThreeDetail(spuId, odorsku, lidsku, bodysku);
    showLipPerfumePage(step);

    require.ensure([], () => {
      const ComponentFilterPerfumeStickOne =
        require("../../components/PerfumesDetailsPage/FilterPerfumeStickOne").default;
      const ComponentFilterPerfumeStickTwo =
        require("../../components/PerfumesDetailsPage/FilterPerfumeStickTwo").default;
      const ComponentFilterPerfumeStickThree =
        require("../../components/PerfumesDetailsPage/FilterPerfumeStickThree").default;
      const ComponentFilterPerfumeStickFour =
        require("../../components/PerfumesDetailsPage/FilterPerfumeStickFour").default;

      this.setState({
        currentComponentFilterPerfumeStickOne: (
          <ComponentFilterPerfumeStickOne key="ComponentFilterPerfumeStickOne" />
        ),
        currentComponentFilterPerfumeStickTwo: (
          <ComponentFilterPerfumeStickTwo key="ComponentFilterPerfumeStickTwo" />
        ),
        currentComponentFilterPerfumeStickThree: (
          <ComponentFilterPerfumeStickThree key="ComponentFilterPerfumeStickThree" />
        ),
        currentComponentFilterPerfumeStickFour: (
          <ComponentFilterPerfumeStickFour key="ComponentFilterPerfumeStickFour" />
        ),
      });
    });
  }

  render() {
    const { pdpFilterPage, PdpFilterTwo, PdpFilterThree, PdpFilterComb } = this.props;
    let bgc;
    switch (pdpFilterPage) {
      // case 'one':
      //   bgc = PDP_IS_OPEN_FILTER_ORIGIN&&PDP_IS_OPEN_FILTER_ORIGIN.bColorCode;
      //   break;
      case "two":
        bgc = PdpFilterTwo && PdpFilterTwo.bColorCode;
        break;
      case "three":
        bgc = PdpFilterThree && PdpFilterThree.bColorCode;
        break;
      case "four":
        bgc = PdpFilterComb && PdpFilterComb.bColorCode;
        break;
      // default:
      //   bgc = PDP_IS_OPEN_FILTER_ORIGIN&&PDP_IS_OPEN_FILTER_ORIGIN.bColorCode;
      //   break;
    }
    return (
      <div className="FilterPerfumeStick-container" style={{ backgroundColor: bgc }}>
        {/* <CommonTop /> */}
        {this.state.currentComponentFilterPerfumeStickOne}
        {this.state.currentComponentFilterPerfumeStickTwo}
        {this.state.currentComponentFilterPerfumeStickThree}
        {this.state.currentComponentFilterPerfumeStickFour}
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  const { product } = s;
  const { pdpFilterPage, PDP_IS_OPEN_FILTER_ORIGIN, PdpFilterTwo, PdpFilterThree, PdpFilterComb } =
    product;
  return {
    pdpFilterPage,
    PDP_IS_OPEN_FILTER_ORIGIN,
    PdpFilterTwo,
    PdpFilterThree,
    PdpFilterComb,
  };
};

export default connect(mapStateToProps, {
  getMiuMiuDetail,
  showLipPerfumePage,
  getMiuMiuStepTwoDetail,
  getMiuMiuStepThreeDetail,
})(FilterPerfumeStick);
