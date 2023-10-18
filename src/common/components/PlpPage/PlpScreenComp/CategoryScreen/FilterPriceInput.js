import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../../actions/plpPage";

class FilterPriceInput extends React.Component {
  change(val, type) {
    let { changeState, pushLevel, _index } = this.props;
    changeState(val, type);
    let newPushLevel = [].concat(pushLevel);
    newPushLevel[_index].forEach(element => {
      element.change = false;
    });
    changeState(newPushLevel, "pushLevel");
  }

  render() {
    const { maxFilterPrice, minFilterPrice } = this.props;
    return (
      <div>
        <input
          type="number"
          value={minFilterPrice}
          onChange={e => this.change(e.target.value, "minFilterPrice")}
          placeholder="最低价"
        />
        <span className="gang" />
        <input
          type="number"
          value={maxFilterPrice}
          onChange={e => this.change(e.target.value, "maxFilterPrice")}
          placeholder="最高价"
        />
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(FilterPriceInput);
