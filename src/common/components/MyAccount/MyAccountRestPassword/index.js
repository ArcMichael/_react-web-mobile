/*
 * @Author: Leo.Si
 * @Date: 2019-08-27 15:39:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-08-Tu 02:10:43
 * @function 用户设置用户密码  验证身份、选卡、更改密码、设置密码
 */
import React from "react";
import Authentication from "./Authentication";
import SetPassword from "./SetPassword";
import ModifyPassword from "./ModifyPassword";
import ChooseCard from "./ChooseCard";
import TieCard from "./TieCard";
const showType = {
  authentication: Authentication,
  setPassword: SetPassword,
  modifyPassword: ModifyPassword,
  chooseCard: ChooseCard,
  tieCard: TieCard,
};
const AddressModule = ({
  _profile,
  _status,
  _cardlist,
  _userMobile,
  _clickCallback,
}) => {
  let newStatus = "";

  if (!_status) return null;
  if (_profile.email && _profile.email.toLowerCase().includes("@sephora.")) {
    newStatus = "modifyPassword";
  }
  let ComponentDetail = showType[newStatus || _status];

  return (
    <ComponentDetail
      _userMobile={_userMobile}
      _profile={_profile}
      _cardlist={_cardlist}
      _clickCallback={_clickCallback}
    />
  );
};
export default AddressModule;
