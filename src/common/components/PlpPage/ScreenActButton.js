import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getFilterActStatus } from "../../actions/plpPage";

class ScreenActButton extends React.Component {
  state = {
    isShow: false,
  };
  getFilterStatus() {
    const { filterActButtonParam, getFilterActStatus } = this.props;
    let param = {
      url: "/v1/search-service/product/list/activity-filter-status",
      type: "GET",
      onlyKey: "filterActButton",
    };
    param.url =
      param.url +
      "?" +
      Object.keys(filterActButtonParam)
        .map(item => item + "=" + filterActButtonParam[item])
        .join("&") +
      "&channel=MOBILE";
    getFilterActStatus(param).then(json => {
      if (json === true) {
        this.setState({
          isShow: true,
        });
      }
    });
  }
  componentDidMount() {
    this.getFilterStatus.call(this);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.filterActButtonParam !== this.props.filterActButtonParam && nextProps.filterActButtonParam) {
      this.getFilterStatus.call(this);
    }
  }

  render() {
    const { useScreenActData, clickFunc } = this.props;
    const { isShow } = this.state;
    if (!isShow) {
      return null;
    }
    let buttonText1 = "点击筛选",
      buttonText2 = "活动",
      buttonText3 = "商品";
    if (useScreenActData) buttonText1 = "已筛选";
    return (
      <div className={`screen-activity-button ${useScreenActData ? "active" : ""}`} onClick={clickFunc}>
        {buttonText1}
        <span>{buttonText2}</span>
        {buttonText3}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  globalReference: state.globalReference,
});
const mapDispatchToProps = dispatch => ({
  getFilterActStatus: bindActionCreators(getFilterActStatus, dispatch),
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(ScreenActButton);
