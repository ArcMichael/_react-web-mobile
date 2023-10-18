/*
 * @Author: Leo.Si
 * @Date: 2020-03-18 15:45:31
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:45:54
 * @function 手机验证码登陆---当前用户未绑定且有多张卡
 */
import React from "react";
import { connect } from "react-redux";
import { setLoginPassword } from "../../../actions/login";
class LoginStoreMemberChooseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maskShow: false,
      cardNum: "",
      cardType: "",
    };
  }
  componentDidMount() {
    const { cardType } = this.state; // TODO: 请移除无用state
    console.log(cardType);
  }
  // 渲染卡列表
  renderCardList(cardList) {
    const cardImage = {
      PINK: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/pink-card-CRM-black-no-light.png",
      WHITE:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/white-card-CRM-black-shadow.png",
      BLACK:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/CRM-black-card-no-light.png",
      GOLDEN:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/Gold-Card-New.png",
    };
    return (
      cardList &&
      cardList.length > 0 &&
      cardList.map((item, index) => {
        const { type, id, points } = item;
        return (
          <li
            key={`card_list_${index}`}
            onClick={this.mask.bind(this, true, item)}
          >
            <img src={cardImage[type]} />
            <span>卡号：{id}</span>
            <span>积分：{points}</span>
          </li>
        );
      })
    );
  }
  // 显示选中卡片的提示
  mask(status, item) {
    const { _clickCallback, _cardlist } = this.props;
    if (_cardlist && _cardlist.length == 1)
      return (
        _clickCallback && _clickCallback.bind(this, "registerSuccessLink")()
      );
    this.setState({
      cardNum: item && item.id,
      maskShow: status,
      cardType: item && item.type,
    });
  }

  render() {
    const { maskShow, cardNum } = this.state;
    const {
      _clickCallback,
      STORE_MEMBER_DATA,
      STORE_PINK_CARD,
      STORE_LOGIN_ID,
    } = this.props;
    return (
      <div className="login_page_enter">
        <h3>手机验证码登录</h3>
        <a
          className="storeMember"
          onClick={_clickCallback.bind(this, "switchPage", "loginEnter")}
        >
          密码登录
        </a>
        <div className="login_module_store_member_content_cardNum">
          <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mail-forgot.png" />
          <p>
            {STORE_PINK_CARD
              ? "检查到您没有丝芙兰会员卡"
              : "检查到您有多张会员卡，请选择会员卡"}
          </p>
        </div>
        {STORE_PINK_CARD ? (
          ""
        ) : (
          <p className="login_module_store_member_content_cardNum_tip">
            选择一张会员卡
          </p>
        )}
        <p className="login_module_store_member_content_tip">
          {STORE_PINK_CARD
            ? "选择粉卡或者绑定其他会员卡"
            : "您的账户已关联多张会员卡，请选择一张用于累计您在丝芙兰网上商城所得积分的会员卡。"}
        </p>
        {STORE_MEMBER_DATA && STORE_MEMBER_DATA.cardInfoDtos && (
          <ul className="card_list_con">
            {this.renderCardList.bind(this, STORE_MEMBER_DATA.cardInfoDtos)()}
          </ul>
        )}
        <p
          className="card_list_tie_other"
          onClick={_clickCallback.bind(
            this,
            "switchPage",
            "loginStoreMemberTieCard"
          )}
        >
          +绑定其他已有会员卡
        </p>
        {maskShow ? (
          <div className="card_list_mask">
            <div>
              <span>
                验证成功!确定绑定会员卡<i>{cardNum}</i>吗?
              </span>
              <span onClick={this.mask.bind(this, false)}>取消</span>
              <span
                onClick={
                  _clickCallback &&
                  _clickCallback.bind(this, "setLoginBindCard", {
                    chooseCardNo: cardNum,
                    loginId: STORE_LOGIN_ID,
                  })
                }
              >
                确定
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let { login } = state;
  let { STORE_MEMBER_DATA, STORE_PINK_CARD, STORE_LOGIN_ID } = login;
  return {
    STORE_MEMBER_DATA,
    STORE_PINK_CARD,
    STORE_LOGIN_ID,
  };
};
export default connect(mapStateToProps, {
  setLoginPassword,
})(LoginStoreMemberChooseCard);
