/*
 * @Author: Leo.Si
 * @Date: 2019-08-23 10:00:15
 * @Last Modified by: summer
 * @Last Modified time: 2021-05-Sa 02:34:19
 * @function 收货地址管理页面
 */
import React from "react";
import AllAddressList from "./AllAddressList";
import AddAddress from "./AddAddress";
import ModifyAddress from "./ModifyAddress";
import NoAddress from "./NoAddress";

const showType = {
  allAddress: AllAddressList,
  addAddress: AddAddress,
  modifyAddress: ModifyAddress,
  noAddress: NoAddress,
};
const AddressModule = ({ _data, _status, _clickCallback, _type, popupAlert }) => {
  let ComponentDetail = showType[_status];
  return <ComponentDetail popupAlert={popupAlert} _data={_data} _clickCallback={_clickCallback} _type={_type} />;
};
export default AddressModule;
