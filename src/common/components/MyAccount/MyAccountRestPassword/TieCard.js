/*
 * @Author: Leo.Si 
 * @Date: 2019-08-27 15:45:10 
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:41:30
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
    checkValue() {}
    submit(){
        const { card, email } = this.state
        const {  _clickCallback, _profile, _userMobile } = this.props
        if(!card || !email) return alert('请先输入卡号或者邮箱！')
        _clickCallback && _clickCallback('changePersonalInfo', {
            'queryBody': {
                "cardNum": card,
                "mobile": _userMobile,
                "loginId": _profile && _profile.loginId,
                "cardEmail": email
            }
        })
    }
    render() {
        const { card, email } = this.state
        const {  _clickCallback,  } = this.props
        return (
            <div className='authentication_con'>
                <p className='authentication_con_title'>绑定其他会员卡</p>
                <p className='card_list_con_message'>亲爱的会员，为了您能够正常享受会员权益，请绑定会员卡后退出重新登录，祝您购物愉快！</p>
                <div className={'Model ' + this.state.inputStyleCard} onClick={this.setValue.bind(this, 'inputStyleCard', null, 'modelAnimation')}>
                    <p>卡号</p>
                    <BaseInput _value={card} _getValue={this.setValue.bind(this, 'card', this.checkValue)} />
                </div>
                <div className={'Model ' + this.state.inputStyleEmail} onClick={this.setValue.bind(this, 'inputStyleEmail', null, 'modelAnimation')}>
                    <p>邮箱</p>
                    <BaseInput  _value={email} _getValue={this.setValue.bind(this, 'email', this.checkValue)} />
                </div>
                <button className='card_list_confirm' onClick={this.submit}>确定</button>
                <button className='card_list_cancle' onClick={_clickCallback.bind(this, 'switchPage', 'chooseCard')}>取消</button>
            </div>
        )
    }
}
