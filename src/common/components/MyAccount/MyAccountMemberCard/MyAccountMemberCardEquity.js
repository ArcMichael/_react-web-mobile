/*
 * @Author: Leo.Si
 * @Date: 2019-08-20 14:02:22
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-02-01 18:27:20
 * @function 会员权益页面 具体权益信息
 */
import React from "react";
import DataLink from "../../Atoms/DataLink";
const MyAccountMemberCardEquity = ({ _data, _nowIndex, callback }) => (
  <ul className="myAccount_integral_member_card_equity">
    {_data &&
      _data.equityImageList &&
      _data.equityImageList.length > 0 &&
      _data.equityImageList.map((item, index) => {
        let { isTitle, titleText, titleLink, className, titleLinkCon, imageUrl, text, belong } = item;
        if (isTitle) {
          return (
            <li className={className} key={`myAccount_integral_member_card_equity_${index}`}>
              <p>{titleText}</p>
              <DataLink
                _Href={titleLink}
                _Omniture=""
                _Title=""
                _Content=""
                _Https="https"
                _Sensor={{
                  eventKey: "myAccountClick",
                  value: {
                    $lib_detail: "M_NewMobile##getSensorData##MyAccountMemberCardEquity.js##27",
                    button_name: "会员权益-查看会员权益详情",
                  },
                }}
              >
                {titleLinkCon}
              </DataLink>
            </li>
          );
        } else {
          return (
            <button
              // disabled={index <= belong[_nowIndex] ? "" : "disabled"}
              onClick={() => {
                callback(item, index);
              }}
              className={`myAccount_integral_member_card_equity_li  ${className} ${
                index <= belong[_nowIndex] ? "active_equity_li" : ""
              }`}
              key={`myAccount_integral_member_card_equity_${index}`}
            >
              <div>
                <img className={`myAccount_integral_member_card_equity_${index}`} src={imageUrl} />
              </div>
              <span>{text}</span>
            </button>
          );
        }
      })}
  </ul>
);
export default MyAccountMemberCardEquity;
