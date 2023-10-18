/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/12
 * Function -- Component popup for pink card
 *
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as popup from '../../../actions/popup'

import * as utilCookieUtil from '../../../Utils/cookieUtil'

class PopupPinkCard extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    // this.handleClose = this.handleClose.bind(this);
  }
  handleClick() {
    utilCookieUtil.SetSingleCookie2({ key: 'FirstTime', value: '0' })
    this.props.popup.popupComponent(0, null)
  }
  render() {
    const style = {
      width: '100%',
      height: '100%',
      position: 'fixed',
      background: '#000',
      opacity: 0.8,
      left: 0,
      top: 0,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }

    const imgFirst = {
      width: 536,
      height: 502,
      marginTop: 348,
      marginRight: 50,
    }

    const imgSecond = {
      width: 330,
      height: 80,
      marginTop: 57,
    }
    const imgThird = {
      width: 90,
      height: 90,
      position: 'absolute',
      top: 240,
      right: 87,
    }
    const textStyle = {
      display: 'block',
      color: '#fff',
      fontSize: 30,
      marginTop: 50,
    }

    return (
      <div _className='popup-ui-pinkcard' style={style}>
        <img src='https://ssl1.sephorastatic.cn/soa/mobile/images/pink-content.png' style={imgFirst} />
        <a style={imgSecond} href='/' onClick={this.handleClick.bind(this)}>
          <img src='https://ssl1.sephorastatic.cn/soa/mobile/images/goshop.png' />
        </a>
        <a style={textStyle} href='http://m.sephora.cn/campaign/jsp/vip_club_ios.html' onClick={this.handleClick.bind(this)}>
          <span>查看详情</span>
        </a>
        <a style={imgThird} onClick={this.handleClick}>
          <img src='https://ssl1.sephorastatic.cn/soa/mobile/images/cardcancle.png' />
        </a>

      </div>
    )
  }
}

export default connect(() => ({}), (dispatch) => ({
  popup: bindActionCreators(popup, dispatch),
}))(PopupPinkCard)
