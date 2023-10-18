/*
 * @Author: Leo.Si 
 * @Date: 2019-08-28 16:11:49 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-08-28 18:56:52
 * @function 用户选卡
 */
import React from 'react'
export default class ChooseCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            maskShow: false,
            cardNum: ''
        }

    }
    // 渲染卡列表
    renderCardList(cardList) {
        const cardImage = {
            "PINK": "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/pink-card-CRM-black-no-light.png",
            "WHITE": "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/white-card-CRM-black-shadow.png",
            "BLACK": "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/CRM-black-card-no-light.png",
            "GOLDEN": "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/Gold-Card-New.png"
        }
        return cardList &&
            cardList.length > 0 &&
            cardList.map((item, index) => {
                const { type, id, points } = item
                return <li key={`card_list_${index}`} onClick={this.mask.bind(this, true, item)}>
                    <img src={cardImage[type]} />
                    <span>卡号：{id}</span>
                    <span>积分：{points}</span>
                </li>
            })
    }
    // 显示选中卡片的提示
    mask(status, item) {
        this.setState({
            cardNum: item && item.id,
            maskShow: status
        })
    }
    render() {
        const { maskShow, cardNum } = this.state
        const { _cardlist,_clickCallback,_profile,_userMobile } = this.props
        return (
            <div className='authentication_con'>
                <p className='authentication_con_title'>选择一张会员卡</p>
                <p className='card_list_con_message'>请选择以下会员卡将网上商城的积分积到该卡上。</p>
                {_cardlist && <ul className='card_list_con'>{this.renderCardList.bind(this, _cardlist)()}</ul>}
                <p className='card_list_tie_other' onClick={_clickCallback.bind(this, 'switchPage', 'tieCard')}>+绑定其他已有会员卡</p>
                <span className='card_list_line' />
                <p className="authentication_con_tip">
                    <span>如您忘记留资信息或已弃用留资手机号，请致</span>
                    <span>电会员热线：<i>400-670-0055</i></span>
                </p>
                {maskShow ? <div className='card_list_mask'>
                    <div>
                        <span>验证成功!确定绑定会员卡<i>{cardNum}</i>吗?</span>
                        <span onClick={this.mask.bind(this, false)} >取消</span>
                        <span onClick={_clickCallback.bind(this,'changePersonalInfo',{
                            'queryBody': {
                                "cardNum": cardNum,
                                "mobile": _userMobile,
                                "loginId":_profile && _profile.loginId
                            }
                        })}>确定</span>
                    </div>
                </div> : null}
            </div>
        )
    }
}
