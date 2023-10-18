/*
 * @Author: Leo.Si 
 * @Date: 2019-08-28 16:11:49 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-12-30 13:58:02
 * @function 注册用户选卡
 */
import React from 'react'
export default class ChooseCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            maskShow: false,
            cardNum: '',
            cardType: ''
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
        const { _clickCallback, _cardlist } = this.props
        if (_cardlist && _cardlist.length == 1) return _clickCallback && _clickCallback.bind(this, 'registerSuccessLink')()
        this.setState({
            cardNum: item && item.id,
            maskShow: status,
            cardType: item && item.type
        })
    }
    render() {
        const { maskShow, cardNum,cardType } = this.state
        const { _cardlist, _clickCallback, _info } = this.props
        return (
            <div className='authentication_con'>
                <p className='authentication_con_title'>注册成功</p>
                {
                    _cardlist && _cardlist.length > 1 ? <div /> : <p className='card_list_con_message'>感谢您成为丝芙兰会员，领取粉卡将购物积分累计到该卡上。</p>
                }

                {_cardlist && <ul className='card_list_con'>{this.renderCardList.bind(this, _cardlist)()}</ul>}
                <p className='card_list_tie_other' onClick={_clickCallback.bind(this, 'switchPage', 'tieCard')}>+绑定其他已有会员卡</p>
                {maskShow ? <div className='card_list_mask'>
                    <div>
                        <span>您是否绑定卡号为<i>{cardNum}</i>的会员卡?</span>
                        <span onClick={this.mask.bind(this, false)} >取消</span>
                        <span onClick={_clickCallback && _clickCallback.bind(this, 'cardBindOperation', {
                            "cardNum": cardNum,
                            "loginId": _info && _info.loginId,
                            'type':cardType
                        })}>确定</span>
                    </div>
                </div> : null}
            </div>
        )
    }
}
