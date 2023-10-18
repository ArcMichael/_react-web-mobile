/*
 * @Author: Leo.Si 
 * @Date: 2020-03-18 15:45:31 
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2020-11-13 11:03:42
 * @function 手机验证码登陆---当前用户已绑定且有一张卡
 */
import React from 'react'
import { connect } from 'react-redux'
import BaseInput from '../../AtomsInput/Input/BaseInput'
import Button from '../../AtomsInput/Button'
import { setLoginPassword } from '../../../actions/login'
class LoginStoreMemberHaveCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputStylePassword: '',//用户输入的密码动画效果控制
            password: '',//用户输入的密码
            inputStyleCheckPassword: '',//用户输入的确认密码动画效果控制
            checkPassword: '',//用户输入的确认密码
            btnStatus: 0,//注册按钮默认的初始状态
        }
        this.handClick = this.handClick.bind(this)
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
        const { password, checkPassword } = this.state;

        let IsPassword = (password && password.length > 0) ? true : false
        let IsChecklPassword = (checkPassword && checkPassword.length > 0) ? true : false
        this.setState({
            btnStatus: (IsPassword && IsChecklPassword) ? 1 : 0
        })
    }
    // 开启线上账户
    handClick() {
        this.setState({ btnStatus: 2 });
        const { password, checkPassword } = this.state
        const { setLoginPassword } = this.props
        setLoginPassword({
            password,
            checkPassword
        }, callback => {
            callback && this.setState({ btnStatus: 0 });
        })
    }
    render() {
        const { password, checkPassword, btnStatus } = this.state
        const { _clickCallback, STORE_MEMBER_DATA, STORE_TIP } = this.props
        return (
            <div className='login_page_enter'>
                <h3>手机验证码登录</h3>
                <a className="storeMember" onClick={_clickCallback.bind(this, 'switchPage', 'loginEnter')}>密码登录</a>
                <div className="login_module_store_member_content_cardNum">
                    <img src='https://ssl1.sephorastatic.cn/soa/nmobile/img/mail-forgot.png' />
                    <p>{`${STORE_TIP}${STORE_MEMBER_DATA && STORE_MEMBER_DATA.cardInfoDtos && STORE_MEMBER_DATA.cardInfoDtos[0] && STORE_MEMBER_DATA.cardInfoDtos[0].id}`}</p>
                </div>
                <p className="login_module_store_member_content_tip">您还差一步享受兑换积分等福利，设置密码开启线上账户。</p>
                <div className={'Model ' + this.state.inputStylePassword} onClick={this.setValue.bind(this, 'inputStylePassword', null, 'modelAnimation')}>
                    <p>设置登录密码</p>
                    <BaseInput _value={password} _type='password' _getValue={this.setValue.bind(this, 'password', this.checkValue)} />
                </div>
                <div className={'Model ' + this.state.inputStyleCheckPassword} onClick={this.setValue.bind(this, 'inputStyleCheckPassword', null, 'modelAnimation')}>
                    <p>确认密码</p>
                    <BaseInput _value={checkPassword} _type='password' _getValue={this.setValue.bind(this, 'checkPassword', this.checkValue)} />
                </div>
                <p className='login_page_tip'>8-16位大小写字母、数字和特殊符号的组合</p>
                <div className='login_page_con_btn'>
                    <Button _text="开启线上账户" _status={btnStatus} _clickCallback={this.handClick} _bottomShortLine={false} />
                </div>

            </div>
        )
    }
}
const mapStateToProps = state => {
    let { login } = state
    let { STORE_MEMBER_DATA, STORE_TIP } = login
    return {
        STORE_MEMBER_DATA,
        STORE_TIP
    }
};
export default connect(mapStateToProps, {
    setLoginPassword
})(LoginStoreMemberHaveCard);