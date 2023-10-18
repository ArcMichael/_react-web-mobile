/**
 * Created by summer
 * 香水定制第三步
 */

import React from "react";
import { connect } from "react-redux";
import { selectPerfumeLid } from "../../actions/PerfumesDetailsPage";
import FilterPerfumeHeader from "./FilterPerfumeHeader";
import FilterPerfumeText from "./FilterPerfumeText";
import * as regexp from "../../lib/regexp";
import ComponentPdpSpecialTop from "./PdpSpecialTop";

class FilterPerfumeStickThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  clickSelectLid(type, _data) {
    if (_data.hasInv) {
      const sku = _data.skuId;
      const currentsearch = window.location.search;
      if (type == "lid") {
        const lidsku = /lidsku=/;
        const condition = /lidsku=[0-9]*/;
        if (currentsearch) {
          if (lidsku.test(currentsearch)) {
            history.replaceState(
              `&lidsku=${sku}`,
              "",
              currentsearch.replace(condition, `lidsku=${sku}`),
            );
          } else {
            history.replaceState(`&lidsku=${sku}`, "", `${currentsearch}&lidsku=${sku}`);
          }
        } else {
          history.replaceState(`&lidsku=${sku}`, "", `&lidsku=${sku}`);
        }
        let bodysku = regexp.searchBodySku(window.location);
        if (bodysku) {
          this.props.selectPerfumeLid(type, sku, bodysku);
        } else {
          this.props.PdpFilterThree.partTwoDtos.map((v) => {
            if (v.selected) bodysku = v.skuId;
          });
          this.props.selectPerfumeLid(type, sku, bodysku);
        }
      } else {
        const bodysku = /bodysku=/;
        const condition = /bodysku=[0-9]*/;
        if (currentsearch) {
          if (bodysku.test(currentsearch)) {
            history.replaceState(
              `&bodysku=${sku}`,
              "",
              currentsearch.replace(condition, `bodysku=${sku}`),
            );
          } else {
            history.replaceState(`&bodysku=${sku}`, "", `${currentsearch}&bodysku=${sku}`);
          }
        } else {
          history.replaceState(`&bodysku=${sku}`, "", `&bodysku=${sku}`);
        }
        const lidsku = regexp.searchLidSku(window.location);
        this.props.selectPerfumeLid(type, lidsku, sku);
      }
    }
  }

  render() {
    const showWhichPage = this.props.pdpFilterPage;
    const StepThreeInfo = this.props.PdpFilterThree;
    const renderData = this.props.PDP_IS_OPEN_FILTER_ORIGIN;
    return (
      <div
        style={{ background: StepThreeInfo && StepThreeInfo.bColorCode }}
        className={
          showWhichPage && showWhichPage == "three"
            ? "filterPerfumeStick-container-three"
            : "disappear"
        }
      >
        <ComponentPdpSpecialTop
          key="ComponentPdpSpecialTop"
          _changeStyle="filter-color-title"
          _keyWordStyle="_keyWordStyle"
        />
        <FilterPerfumeHeader _data={renderData && renderData} />
        <div className="bottle-cap-box">
          {StepThreeInfo &&
            StepThreeInfo.partOneDtos &&
            StepThreeInfo.partOneDtos.map((item, index) => (
              <div
                key={`cap_${index}`}
                className={[
                  "cap-item",
                  item.hasInv ? "" : "no-inventory",
                  item.selected ? "select-cap" : "",
                ].join(" ")}
                onClick={this.clickSelectLid.bind(this, "lid", item)}
              >
                <img src={item.listImage} />
                {item.hasInv ? null : <p>已售罄</p>}
              </div>
            ))}
        </div>
        <FilterPerfumeText _data={StepThreeInfo && StepThreeInfo} _step="three" />
        <div className="bottle-body-box">
          {StepThreeInfo &&
            StepThreeInfo.partTwoDtos &&
            StepThreeInfo.partTwoDtos.map((item, index) => (
              <div
                key={`cap_${index}`}
                className={[
                  "cap-item",
                  item.hasInv ? "" : "no-inventory",
                  item.selected ? "select-cap" : "",
                ].join(" ")}
                onClick={this.clickSelectLid.bind(this, "body", item)}
              >
                <img src={item.listImage} />
                {item.hasInv ? null : <p>已售罄</p>}
              </div>
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  const { product } = s;
  const { pdpFilterPage, PdpFilterThree, PDP_IS_OPEN_FILTER_ORIGIN } = product;
  return {
    pdpFilterPage,
    PdpFilterThree,
    PDP_IS_OPEN_FILTER_ORIGIN,
  };
};

export default connect(mapStateToProps, {
  selectPerfumeLid,
})(FilterPerfumeStickThree);
