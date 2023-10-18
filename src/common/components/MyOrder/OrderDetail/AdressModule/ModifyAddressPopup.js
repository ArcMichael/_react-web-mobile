import React from "react";
import PageTitle from "../../../CommonPageTitle";

const UIRender = require("../../../MyAccount/MyAddress/addAddressRegex.json");
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
    this.submitAddAddress = this.submitAddAddress.bind(this);
  }
  componentDidMount() {
    const { addressData } = this.props;
    let data = addressData.modifyData;
    if (data) {
      this.setState({
        valueObj: {
          userName: data.userName || "",
          mobilePhone: data.mobilePhone || "",
          telephone: data.telephone || "",
          addrProvince: data.addrProvince || "",
          addrCity: data.addrCity || "",
          addrDistrict: data.addrDistrict || "",
          zipcode: data.zipcode || "",
          addrDetail: data.addrDetail || "",
          isDefault: data.isDefault,
          orderType: 1,
          addrId: data.addrId,
        },
        userName: data.userName,
        mobilePhone: data.mobilePhone,
        zipcode: data.zipcode,
        addrDetail: data.addrDetail,
        isDefault: data.isDefault,
        telephone: data.telephone,
      });
    }
  }
  getValue(params, e) {
    let { regex, size, alertMessage, key, name } = params;
    const { popupAlert } = this.props;
    const { valueObj } = this.state;
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
          data.forEach((item) => {
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
  // 保存
  submitAddAddress(value) {
    const {
      province_city_areas,
      type,
      orderId,
      editAddress,
      popupAlert,
      mapAddressFuncToRun,
    } = this.props;
    if (!value)
      return popupAlert(1, "PopupToast", {
        _text: "请先填写信息! ",
        _autoClose: true,
      });
    const ajaxParams = {
      userName: value.userName || "",
      mobilePhone: value.mobilePhone || "",
      telephone: value.telephone || "",
      addrProvince:
        (province_city_areas && province_city_areas.province) ||
        value.addrProvince,
      addrCity:
        (province_city_areas && province_city_areas.city) || value.addrCity,
      addrDistrict:
        (province_city_areas && province_city_areas.areas) ||
        value.addrDistrict,
      zipcode: value.zipcode || "",
      addrDetail: value.addrDetail || "",
      isDefault: value.isDefault,
      orderType: type,
      addrId: value.addrId,
      orderId,
    };
    const alertMessage = {
      userName: "请输入收货人姓名！",
      mobilePhone: "请输入手机号码！",
      addrDetail: "请输入详细地址！",
      addrProvince: "请输入所在地区!",
    };
    for (const i in ajaxParams) {
      if (
        !ajaxParams[i] &&
        ["isDefault", "telephone", "zipcode", "addrDistrict"].indexOf(i) == -1
      ) {
        return popupAlert(1, "PopupToast", {
          _text: alertMessage[i],
          _autoClose: true,
        });
      } else {
        if (i === "mobilePhone" && ajaxParams["mobilePhone"].length > 11) {
          return popupAlert(1, "PopupToast", {
            _text: "手机号不能超过11位",
            _autoClose: true,
          });
        }
        if (i === "mobilePhone" && ajaxParams["mobilePhone"].length < 11) {
          return popupAlert(1, "PopupToast", {
            _text: "请输入正确的手机号码",
            _autoClose: true,
          });
        }
        if (
          i === "zipcode" &&
          ajaxParams["zipcode"] &&
          ajaxParams["zipcode"].length !== 6
        ) {
          return popupAlert(1, "PopupToast", {
            _text: "请输入正确的邮政编码！",
            _autoClose: true,
          });
        }
      }
    }
    mapAddressFuncToRun("saveProvince", "");
    editAddress(ajaxParams);
  }
  render() {
    const { setState, addressData, province_city_areas, mapAddressFuncToRun } =
      this.props;
    const {
      valueObj,
      userName,
      mobilePhone,
      zipcode,
      addrDetail,
      isDefault,
      telephone,
    } = this.state;
    return (
      <div className="my_address_add">
        <PageTitle
          _title="编辑收货地址"
          _callback={() => {
            setState({
              showAddress: "all",
              addressData: {
                ...addressData,
                modifyData: {},
              },
            });
            mapAddressFuncToRun("saveProvince", "");
          }}
          _customRight={
            <div
              id="my_address_add-page-title_increased"
              onClick={() => this.submitAddAddress(valueObj)}
            >
              保存
            </div>
          }
          _isBack
         />
        <ul className="my_address_add_ul">
          {UIRender &&
            UIRender.map((item, index) => {
              const { label, placeholder, type, key } = item;
              let hasValue = {
                userName: userName,
                mobilePhone: mobilePhone,
                zipcode: zipcode,
                addrDetail: addrDetail,
                telephone: telephone,
                province:
                  (province_city_areas &&
                    `${province_city_areas.province}${province_city_areas.city}${province_city_areas.areas}`) ||
                  `${addressData.modifyData.addrProvince}${addressData.modifyData.addrCity}${addressData.modifyData.addrDistrict}`,
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
                    <p
                      onClick={() =>
                        mapAddressFuncToRun("controlProvince", true)
                      }
                    >
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
      </div>
    );
  }
}

export default ModifyAddress;
