/*
 * @Author: HuangDaBao
 * @Date: 2021-12-11 10:52:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-22 16:49:06
 * @function login page
 */
import React, { useState } from "react";

interface BaseInputState {
  _setValue: Function;
  _placeholder?: string;
  _autocomplete?: string;
  _type?: string;
  _getCode?: Function;
  _endCount?: number;
  _filter?: RegExp;
  setSourceFous?: Function;
  _class?: string;
  _telCheck?: boolean;
}

const BaseInput: React.FunctionComponent<BaseInputState> = (props) => {
  let {
    _setValue,
    _placeholder,
    _autocomplete,
    _type,
    _getCode,
    _endCount,
    _filter,
    _class,
    _telCheck,
    setSourceFous,
  } = props;
  const [passwordHide, setPasswordHide] = useState(false);
  const [onFous, setOnFous] = useState(false);
  const [value, setValue] = useState("");

  let right = "0.4rem";
  if (_type === "tel") {
  }
  if (_type == "code") {
    right = "1.9rem";
  } else if (_type == "password") {
    right = "0.92rem";
  }
  let maxLength = 99;
  if (_type === "tel") {
    maxLength = 11;
  } else if (_type === "code") {
    maxLength = 6;
  } else if (_type === "password") {
    maxLength = 16;
  }
  return (
    <div className={`${_class ? _class : ""} get-code`}>
      <input
        type={!passwordHide && _type === "password" ? "password" : "text"}
        onChange={(e) => {
          let valueText = e.target.value; //去除首尾的空格  .trim()
          // valueText = valueText.replace(/\s*/g, ""); //去除字符串内所有的空格
          if (_filter) {
            valueText = _filter.test(e.target.value) ? valueText : value;
          }
          _setValue(valueText);
          setValue(valueText);
        }}
        style={{ imeMode: "disabled" }}
        value={value}
        placeholder={_placeholder}
        onFocus={() => {
          setOnFous(true);
          _type === "password" && setSourceFous && setSourceFous(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setOnFous(false);
          }, 100);
          setSourceFous && setSourceFous(false);
        }}
        autoComplete={_autocomplete}
        maxLength={maxLength}
      />
      {value && onFous && (
        <img
          style={{ right: right }}
          className="icon-clear-img"
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/login_clear.png"
          onClick={() => {
            _setValue("");
            setValue("");
          }}
        />
      )}

      {value && _type === "password" && (
        <img
          className="clearText"
          src={
            passwordHide
              ? "https://sslstage1.sephorastatic.cn/soa/mobile/images/login_eyes.png"
              : "https://sslstage1.sephorastatic.cn/soa/mobile/images/login_see.png"
          }
          onClick={() => setPasswordHide(!passwordHide)}
        />
      )}

      {_type === "code" && (
        <>
          <em />
          {_endCount ? (
            <span>重发({_endCount})</span>
          ) : (
            <span className={`${_telCheck ? "telActive" : ""}`} onClick={_getCode}>
              获取验证码
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default BaseInput;
