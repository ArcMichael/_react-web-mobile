/*
 * @Author: Leo.Si
 * @Date: 2019-12-10 16:52:43
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2020-03-19 17:44:46
 * @function login page content
 */

import React from "react";
import LoginEnter from "./LoginEnter";
import LoginStoreMember from "./LoginStoreMember";
import LoginStoreMemberHaveCard from "./LoginStoreMemberHaveCard";
import LoginStoreMemberChooseCard from "./LoginStoreMemberChooseCard";
import LoginStoreMemberTieCard from "./LoginStoreMemberTieCard";
import LoginStoreMemberImproveInfo from "./LoginStoreMemberImproveInfo";

const showType = {
  loginEnter: LoginEnter,
  loginStoreMember: LoginStoreMember,
  loginStoreMemberHaveCard: LoginStoreMemberHaveCard,
  loginStoreMemberChooseCard: LoginStoreMemberChooseCard,
  loginStoreMemberTieCard: LoginStoreMemberTieCard,
  loginStoreMemberImproveInfo: LoginStoreMemberImproveInfo,
};
const LoginContent = ({ _status, _cardList, _info, _clickCallback }) => {
  if (!_status) return null;
  let ComponentDetail = showType[_status];
  return <ComponentDetail _info={_info} _clickCallback={_clickCallback} _cardlist={_cardList} />;
};
export default LoginContent;
