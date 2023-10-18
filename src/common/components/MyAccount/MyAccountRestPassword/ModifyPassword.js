/*
 * @Author: Leo.Si
 * @Date: 2019-08-27 15:45:10
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-08-09 04:29:42
 * @function 修改密码
 */
import React from "react";
import BaseInput from "../../AtomsInput/Input/BaseInput";
import Button from "../../AtomsInput/Button";
export default class ModifyPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputStyleOld: "",
      oldPassWord: "",
      inputStyleNew: "",
      newPassWord: "",
      inputStyleNewSure: "",
      newPassWordSure: "",
      confirmStatus: 0,
    };
    this.submit = this.submit.bind(this);
  }
  //设置input的属性值
  setValue(name, callback, nowValue) {
    this.setState(
      {
        [name]: nowValue,
      },
      () => {
        callback && callback.call(this);
      }
    );
  }

  // 校验输入框的值
  checkValue() {
    const { oldPassWord, newPassWord, newPassWordSure } = this.state;
    this.setState({
      confirmStatus: oldPassWord && newPassWord && newPassWordSure ? 1 : 0,
    });
  }

  // 点击提交按钮
  submit() {
    const { oldPassWord, newPassWord, newPassWordSure } = this.state;
    const { _clickCallback } = this.props;
    this.setState({
      confirmStatus: 2,
    });
    _clickCallback &&
      _clickCallback(
        "modifyPassword",
        {
          oldPassWord,
          newPassWord,
          newPassWordSure,
        },
        (callback) => {
          if (!callback)
            this.setState({
              confirmStatus: 0,
            });
        }
      );
  }
  render() {
    const { confirmStatus, oldPassWord, newPassWord, newPassWordSure } =
      this.state;
    const { _profile } = this.props;
    return (
      <div className="authentication_con">
        <p className="authentication_con_title">修改登录密码</p>
        <div
          className={"Model " + this.state.inputStyleOld}
          onClick={this.setValue.bind(
            this,
            "inputStyleOld",
            null,
            "modelAnimation"
          )}
        >
          <p>输入旧密码</p>
          <BaseInput
            _type="password"
            _value={oldPassWord}
            _getValue={this.setValue.bind(this, "oldPassWord", this.checkValue)}
          />
        </div>
        <div
          className={"Model " + this.state.inputStyleNew}
          onClick={this.setValue.bind(
            this,
            "inputStyleNew",
            null,
            "modelAnimation"
          )}
        >
          <p>设置新密码</p>
          <BaseInput
            _type="password"
            _value={newPassWord}
            _getValue={this.setValue.bind(this, "newPassWord", this.checkValue)}
          />
        </div>
        <div
          className={"Model " + this.state.inputStyleNewSure}
          onClick={this.setValue.bind(
            this,
            "inputStyleNewSure",
            null,
            "modelAnimation"
          )}
        >
          <p>确认新密码</p>
          <BaseInput
            _type="password"
            _value={newPassWordSure}
            _getValue={this.setValue.bind(
              this,
              "newPassWordSure",
              this.checkValue
            )}
          />
        </div>
        <Button
          _type="BaseButton"
          _className="retention-info-confirm"
          _text="提交"
          _status={confirmStatus}
          _clickCallback={this.submit}
        />
        <p className="authentication_con_tip">
          <span>
            您可以用手机号
            {_profile &&
              _profile.mobile &&
              _profile.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
            进行登录，为了
          </span>
          <span>为了你的账户安全请设置密码。</span>
        </p>
      </div>
    );
  }
}
