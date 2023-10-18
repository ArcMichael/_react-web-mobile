/*
 * @Author: Leo.Si
 * @Date: 2019-09-19 20:25:26
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-09-13 17:12:48
 * @function OnlineReturn  用户申请退货详情编辑页面 具体信息
 */
import React from "react";
import ImageUpload from "../../../ImageUpload/index";
export default class OnlineReturnDetailsEditModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps._returnDetailsData != this.props._returnDetailsData &&
      nextProps._returnDetailsData
    ) {
      this.setState({
        value: nextProps._returnDetailsData.applyComment,
      });
    }
  }
  handleChange(e) {
    const { _clickCallback } = this.props;
    let value = e.target.value;
    if (value && value.length > 300) {
      value = value.substring(0, 300);
    }
    this.setState(
      {
        value: value
      },
      () => {
        _clickCallback && _clickCallback("getComment", value, true);
      }
    );
  }
  render() {
    const { _clickCallback, _returnDetailsData } = this.props;
    const { value } = this.state;
    return (
      !!_returnDetailsData && (
        <div className="online_return_page_explain">
          <div className="online_return_info">
            <p className="online_return_page_detail_title">退货说明</p>
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
            </div>
          </div>
          <div className="online_return_info">
            <p className="online_return_page_detail_title">退货补充说明</p>
            <ImageUpload
              _clickCallback={_clickCallback}
              _isImageSrc={_returnDetailsData.applyImage}
              _isSample={false}
              _key="returnReasonSample"
            />
          </div>
          <div
            className="online_return_detail_submit nobgc"
            onClick={
              _clickCallback &&
              _clickCallback.bind(this, "onlineReturnDetailsEdit")
            }
          >
            提交
          </div>
          {/* <button
            className="online_return_page_edit_btn"
            onClick={
              _clickCallback &&
              _clickCallback.bind(this, "onlineReturnDetailsEdit")
            }
          >
            确认修改
          </button> */}
        </div>
      )
    );
  }
}
