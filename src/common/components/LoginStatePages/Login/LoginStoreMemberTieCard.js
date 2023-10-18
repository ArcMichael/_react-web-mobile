/*
 * @Author: Leo.Si 
 * @Date: 2020-03-18 15:45:31 
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:55:28
 * @function 手机验证码登陆---当前用户绑定其他会员卡
 */
import React from 'react'
import { connect } from 'react-redux'
import BaseInput from '../../AtomsInput/Input/BaseInput'
import Button from '../../AtomsInput/Button'
import { setLoginPassword } from '../../../actions/login'
class LoginStoreMemberTieCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputStyleCard: '',
            card: '',
            inputStyleEmail: '',
            email: '',
            btnStatus: 0
        }
        this.submit = this.submit.bind(this)
    }
    //设置input的属性值
    setValue(name, callback, nowValue) {
        this.setState({
            [name]: nowValue
        }, () => {
            callback && callback.call(this);
        });
    }

    // 校验输入框的值
    checkValue() {
        const { card, email } = this.state
        let IsCard = (card && card.length > 0) ? true : false
        let IsEmail = (email && email.length > 0) ? true : false
        this.setState({
            btnStatus: (IsCard && IsEmail) ? 1 : 0
        })

    }
    submit() {
        const { card, email } = this.state
        const { _clickCallback, STORE_LOGIN_ID } = this.props
        if (!card || !email) return alert('请先输入卡号或者邮箱！')
        let _mailReg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
        if (_mailReg.test(email)) {
            _clickCallback && _clickCallback('setLoginBindCard', {
                "loginId": STORE_LOGIN_ID,
                "cardNo": card,
                "validEmail": email
            })
        }
    }
    render() {
        const { card, email, btnStatus } = this.state
        const { _clickCallback, STORE_PINK_CARD,  } = this.props
        return (
            <div className='login_page_enter'>
                <h3>手机验证码登录</h3>
                <a className="storeMember" onClick={_clickCallback.bind(this, 'switchPage', 'loginEnter')}>密码登录</a>
                <div className="login_module_store_member_content_cardNum">
                    <img src='https://ssl1.sephorastatic.cn/soa/nmobile/img/mail-forgot.png' />
                    <p>
                        {
                            STORE_PINK_CARD ? '检查到您没有丝芙兰会员卡' : '检查到您有多张会员卡，请选择会员卡'
                        }
                    </p>
                </div>
                <p className="login_module_store_member_content_cardNum_tip">绑定其他会员卡</p>
                <p className="login_module_store_member_content_tip">请输入您的会员卡号以及关联该会员卡的手机号或邮箱进行验证绑卡。</p>
                <div className={'Model ' + this.state.inputStyleCard} onClick={this.setValue.bind(this, 'inputStyleCard', null, 'modelAnimation')}>
                    <p>卡号</p>
                    <BaseInput _value={card} _getValue={this.setValue.bind(this, 'card', this.checkValue)} />
                </div>
                <div className={'Model ' + this.state.inputStyleEmail} onClick={this.setValue.bind(this, 'inputStyleEmail', null, 'modelAnimation')}>
                    <p>邮箱/手机</p>
                    <BaseInput _value={email} _getValue={this.setValue.bind(this, 'email', this.checkValue)} />
                </div>
                <Button _text="确定" _status={btnStatus} _className='card_list_confirm_login' _bottomShortLine={false} _clickCallback={this.submit} />
                <p className="login_module_store_member_content_phone">如您忘记会员卡关联的手机号或邮箱信息，请致电会员热线咨询<br /><i> 400 670 0055</i> </p>

            </div>
        )
    }
}
const mapStateToProps = state => {
    let { login } = state
    let { STORE_MEMBER_DATA, STORE_PINK_CARD, STORE_LOGIN_ID } = login
    return {
        STORE_MEMBER_DATA,
        STORE_PINK_CARD,
        STORE_LOGIN_ID
    }
};
export default connect(mapStateToProps, {
    setLoginPassword
})(LoginStoreMemberTieCard);