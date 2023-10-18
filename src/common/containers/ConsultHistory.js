/*
 * @Author: Leo.Si
 * @Date: 2020-02-03 13:29:46
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-09-16 14:32:05
 * @function consultHistory 协商历史页面（目前仅提供给APP使用）
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { consultHistory } from "../actions/onlineReturn";
if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/consultHistory.scss");
}

class ConsultHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consultHistoryResults: "",
    };
  }
  componentDidMount() {
    document.getElementsByTagName("body")[0].style.backgroundColor = "#F5F5F5";
    this.props.consultHistory((callback) => {
      if (callback) {
        this.setState({
          consultHistoryResults: callback,
        });
      }
    });
  }
  renderDetails(data) {
    let renderData = "";
    for (let key in data) {
      renderData =
        renderData +
        `<div class='consult_history_datails'><p>${key}</p><p>${data[key]}</p></div>`;
    }
    return { __html: renderData };
  }
  render() {
    const { consultHistoryResults } = this.state;
    if (!consultHistoryResults || consultHistoryResults.length == 0) {
      return (
        <div className="online_return_list_data">
          <span className="online_return_list_data_no_tip">
            您目前没有相关信息
          </span>
        </div>
      );
    }
    return (
      <div className="consult_history_page">
        <div id="apptitle">协商历史</div>
        <ul className="consult_history_page_ul">
          {consultHistoryResults &&
            consultHistoryResults.length > 0 &&
            consultHistoryResults.map((item, index) => {
              const {
                negotiationTime,
                photo,
                nickName,
                detail,
                comment,
                role,
              } = item;
              let newDetails = (detail && JSON.parse(detail)) || "";
              return (
                <li key={`consult_history_page_ul_li_${index}`}>
                  <p className="consult_history_page_ul_negotiationTime">
                    {negotiationTime}
                  </p>
                  <div className="consult_history_page_ul_li_content">
                    {photo && (
                      <img
                        className="consult_history_page_ul_li_img"
                        src={photo}
                      />
                    )}
                    {nickName && (
                      <p className="consult_history_page_ul_li_nickName">
                        {nickName}
                      </p>
                    )}
                    {newDetails && (
                      <div
                        dangerouslySetInnerHTML={this.renderDetails(newDetails)}
                      />
                    )}
                    {comment && (
                      <div className="consult_history_page_ul_li_comment">
                        <span>
                          {role && role == "1" ? "客服备注" : "退款描述"}
                        </span>
                        <span>{comment}</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  consultHistory,
})(ConsultHistory);
