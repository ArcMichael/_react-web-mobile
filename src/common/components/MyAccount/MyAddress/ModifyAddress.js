/*
 * @Author: Leo.Si
 * @Date: 2019-08-23 15:13:50
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:54:49
 * @function 收货地址管理页面 新增收货地址
 */
import React from "react";
import { connect } from "react-redux";

const UIRender = require("./addAddressRegex.json");
class ModifyAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueObj: "",
      userName: "",
      mobilePhone: "",
      zipcode: "",
      addrDetail: "",
      isDefault: 0,
    };
    this.setDefault = this.setDefault.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
  }
  componentDidMount() {
    const { AllAddress, currentIndex } = this.props;
    this.setState({
      valueObj: {
        userName: AllAddress[currentIndex].userName || "",
        mobilePhone: AllAddress[currentIndex].mobilePhone || "",
        telephone: AllAddress[currentIndex].telephone || "",
        addrProvince: AllAddress[currentIndex].addrProvince || "",
        addrCity: AllAddress[currentIndex].addrCity || "",
        addrDistrict: AllAddress[currentIndex].addrDistrict || "",
        zipcode: AllAddress[currentIndex].zipcode || "",
        addrDetail: AllAddress[currentIndex].addrDetail || "",
        isDefault: AllAddress[currentIndex].isDefault,
        orderType: 1,
        addrId: AllAddress[currentIndex].addrId,
      },
      userName: AllAddress[currentIndex].userName,
      mobilePhone: AllAddress[currentIndex].mobilePhone,
      zipcode: AllAddress[currentIndex].zipcode,
      addrDetail: AllAddress[currentIndex].addrDetail,
      isDefault: AllAddress[currentIndex].isDefault,
    });
  }
  getValue(params, e) {
    let { regex, size, alertMessage, key, name } = params;
    const { valueObj } = this.state;
    const { popupAlert } = this.props;
    let oldValue = e.target.value;
    let value = oldValue;
    if (regex) {
      //校验输入的字符类型,
      var regArr = ["a-zA-Z", "0-9", "\\s", "\\u4e00-\\u9fa5"];
      var checkRegx = "";
      for (let i = 0; i < regex.length; i++) {
        checkRegx = checkRegx + regArr[regex.charAt(i)];
      }
      checkRegx = eval("/[" + checkRegx + "]/");
      if (value) {
        if (name == "phone") {
          let data = value.split(""),
            newVal = [];
          data.forEach((item, ) => {
            if (checkRegx.test(item)) {
              newVal.push(item);
            }
          });
          value = newVal.join("");
        } else {
          for (let i = 0; i < value.length; i++) {
            if (!checkRegx.test(value[i])) {
              value = value.substring(0, i);
              break;
            }
          }
        }
      }
    }
    if (size) {
      //校验输入长度
      if (value && value.length > size && name != "phone") {
        if (alertMessage) {
          popupAlert(1, "PopupToast", {
            _text: alertMessage,
            _autoClose: true,
          });
          // alert(alertMessage);
        }
        value = value.substring(0, size);
      }
    }
    value == oldValue ? oldValue : value;
    let newObj = valueObj || {};
    newObj[key] = value;
    this.setState({
      valueObj: newObj,
      [key]: value,
    });
  }
  setDefault() {
    let { isDefault, valueObj } = this.state;
    let newObj = valueObj || {};
    newObj["isDefault"] = isDefault == 1 ? 0 : 1;
    this.setState({
      isDefault: isDefault == 1 ? 0 : 1,
      valueObj: newObj,
    });
  }
  // 删除当前收货地址
  deleteAddress() {
    const { AllAddress, currentIndex, _clickCallback } = this.props;
    _clickCallback && _clickCallback("deleteAddress", AllAddress[currentIndex].addrId);
  }
  render() {
    const {  _clickCallback, province_city_areas, AllAddress, currentIndex } = this.props;
    const { valueObj, userName, mobilePhone, zipcode, addrDetail, isDefault } = this.state;
    return (
      <div className="my_address_add">
        <div className="my_address_add-page-title">
          {
            <span
              className="my_address_add-page-title-back"
              onClick={_clickCallback.bind(this, "switchAddressShow", "allAddress")}
            >
              <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png" />
            </span>
          }
          <span className="my_address_add-page-title-con">编辑收货地址</span>
          <button
            className="my_address_add-page-title_increased"
            onClick={_clickCallback.bind(this, "editAddress", valueObj)}
          >
            保存
          </button>
        </div>
        <ul className="my_address_add_ul">
          {UIRender &&
            UIRender.map((item, index) => {
              const { label, placeholder, type, key } = item;
              let hasValue = {
                userName: userName,
                mobilePhone: mobilePhone,
                zipcode: zipcode,
                addrDetail: addrDetail,
                province:
                  (province_city_areas &&
                    `${province_city_areas.province}${province_city_areas.city}${province_city_areas.areas}`) ||
                  `${AllAddress[currentIndex].addrProvince}${AllAddress[currentIndex].addrCity}${AllAddress[currentIndex].addrDistrict}`,
              };
              return (
                <li key={`my_address_add_ul_li_${index}`}>
                  {label === "input" ? (
                    <input
                      placeholder={placeholder}
                      value={hasValue[key] || ""}
                      type={type}
                      onChange={this.getValue.bind(this, item)}
                    />
                  ) : (
                    <p onClick={_clickCallback.bind(this, "controlProvince", true)}>
                      {hasValue["province"]}
                      <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/right-arrow-xi.png" />
                    </p>
                  )}
                </li>
              );
            })}
        </ul>
        <div className="my_address_add_default">
          <p>设为默认地址</p>
          <img
            onClick={this.setDefault}
            className={isDefault == 1 ? "sure_img" : "default_img"}
            src={`https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/${
              isDefault == 1 ? "switch-OFF.png" : "checkout_sprite.png"
            }`}
          />
        </div>
        <div className="my_address_editbox" onClick={this.deleteAddress}>
          <span className="">删除收货地址</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { province_city_areas, AllAddress, currentIndex } = myAccount;
  return {
    province_city_areas,
    AllAddress,
    currentIndex,
  };
};
export default connect(mapStateToProps, {})(ModifyAddress);
