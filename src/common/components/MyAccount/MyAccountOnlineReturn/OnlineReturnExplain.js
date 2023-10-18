/*
 * @Author: Leo.Si
 * @Date: 2019-09-16 14:38:36
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-22 16:39:14
 * @function online return 退货说明
 */
import React from "react";
import ImageUpload from "../../ImageUpload/index";
export default class OnlineReturnExplain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const { _clickCallback } = this.props;
    let value = e.target.value;
    if (value && value.length > 300) {
      value = value.substring(0, 300);
    }
    this.setState(
      {
        value: value,
      },
      () => {
        _clickCallback && _clickCallback("getComment", value, true);
      }
    );
  }

  render() {
    const { _clickCallback } = this.props;
    const { value } = this.state;
    return (
      <div className="online_return_page_explain">
        <div className="textarea_container">
          <textarea
            onChange={this.handleChange}
            value={value}
            placeholder="请控制描述在300字以内"
            className="online_return_explain_textarea"
            style={{height:"100px"}}

          />
          <span className="online_return_explain_limit">
            {value.length}/300
          </span>
        </div>

        <ImageUpload
          _clickCallback={_clickCallback}
          _isSample={false}
          _key="returnReasonSample"
        />
      </div>
    );
  }
}
