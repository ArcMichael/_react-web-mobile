/*
 * @Author: Leo.Si 
 * @Date: 2019-08-27 15:45:10 
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:48:19
 * @function 绑定其他卡
 */
import React from 'react'
import BaseInput from '../../AtomsInput/Input/BaseInput'
export default class TieCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputStyleCard: '',
            card: '',
            inputStyleEmail: '',
            email: ''
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
    checkValue() { }
    submit() {
        const { card, email } = this.state
        const {  _clickCallback, _info } = this.props
        if (!card || !email) return alert('请先输入卡号或者邮箱！')
        let _mailReg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
        if (_mailReg.test(email)) {
            _clickCallback && _clickCallback('cardBindOperation', {
                "cardNum": card,
                "loginId": _info && _info.loginId,
                "email": email
            })
        }else{
            alert('请输入正确的邮箱格式！')
        }
    }
    render() {
        const { card, email } = this.state
        const {  _clickCallback,  } = this.props
        return (
            <div className='authentication_con'>
                <p className='authentication_con_title'>注册成功</p>
                <p className='authentication_con_tip'>绑定其它会员卡</p>
                <p className='card_list_con_message'>请输入您的会员卡号以及关联该会员卡的手机号或邮箱进行验证绑卡</p>
                <div className={'Model ' + this.state.inputStyleCard} onClick={this.setValue.bind(this, 'inputStyleCard', null, 'modelAnimation')}>
                    <p>卡号</p>
                    <BaseInput _value={card} _getValue={this.setValue.bind(this, 'card', this.checkValue)} />
                </div>
                <div className={'Model ' + this.state.inputStyleEmail} onClick={this.setValue.bind(this, 'inputStyleEmail', null, 'modelAnimation')}>
                    <p>邮箱</p>
                    <BaseInput _value={email} _getValue={this.setValue.bind(this, 'email', this.checkValue)} />
                </div>
                <button className='card_list_confirm' onClick={this.submit}>确定</button>
                <button className='card_list_cancle' onClick={_clickCallback.bind(this, 'switchPage', 'chooseCard')}>取消</button>
                <p className="p-bottom">如您忘记会员卡关联的手机号或邮箱信息，请致电会员热线咨询<br /><span> 400 670 0055</span> </p>
            </div>
        )
    }
}
