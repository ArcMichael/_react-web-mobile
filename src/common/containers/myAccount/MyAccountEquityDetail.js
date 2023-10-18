/*
 * @Author: Leo.Si
 * @Date: 2019-08-20 16:32:11
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:10:58
 * @function 会员权益 具体信息文字描述
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountEquityDetail.scss");
}
const EquityDetail = require("../../components/MyAccount/MyAccountMemberCard/EquityDetail.json");
class MyAccountEquityDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
      });
    });
  }
  render() {
    const { CommonPageTitle, CurrentComponentCommonTop } = this.state;
    return (
      <div className="myAccount_integral_member_equity">
        {CommonPageTitle && <CommonPageTitle _isBack={true} _title="会员权益" />}
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <ul className="myAccount_integral_member_equity_con">
          {EquityDetail &&
            EquityDetail.length > 0 &&
            EquityDetail.map((item, index) => {
              let { title, className, specificText, fullWidth } = item;
              return (
                <li
                  key={`MyAccountEquityDetail-${index}`}
                  className={`${fullWidth ? "full_li" : ""}`}
                >
                  <p className={className}>{title}</p>
                  <ul>
                    {specificText &&
                      specificText.length > 0 &&
                      specificText.map((list, i) => {
                        let { className, text, isA } = list;
                        if (isA) {
                          return (
                            <p key={`MyAccountEquityDetail-${index}-${i}`} className={className}>
                              <a href="tel:4006700055">{text}</a>
                            </p>
                          );
                        } else {
                          return (
                            <p key={`MyAccountEquityDetail-${index}-${i}`} className={className}>
                              {text}
                            </p>
                          );
                        }
                      })}
                  </ul>
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
export default connect(mapStateToProps, {})(MyAccountEquityDetail);
