/*
 * @Author: Leo.Si 
 * @Date: 2019-08-21 19:38:47 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-09-03 15:17:53
 */


import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DataLink from '../Atoms/DataLink'
import { popupAlert } from '../../actions/popup'

class PopupAlertMyaccount extends React.Component {
  constructor(props) {
    super(props)
    this.clickSure = this.clickSure.bind(this)
  }
  componentDidMount() {

  }

  /*
   * 点击确认关闭
   */
  clickSure() {
    const { popupAlert } = this.props
    popupAlert(0, 'PopupAlertMyaccount')
  }

  render() {
    const { _text, _confirmText, _className, _zIndex } = this.props

    return (
      <div className='popup-confirm-popup-module' style={{ zIndex: _zIndex }} >
        <div className={'popup-alert-myaccount ' + _className} style={{ zIndex: _zIndex }}>
          <p>{_text}</p>
          <DataLink _Href='' _Omniture='' _Title='' _Content='' _Https='https' _ClassName='popup-alert-myaccount-confirm'
            _Sensor={{
              'eventKey': 'myAccountClick',
              'value': {
                $lib_detail: 'M_NewMobile##getSensorData##PopupAlertMyaccount.js##43',
                button_name: '确认跳转到小程序申领中心'
              },
            }}
            _ClickCallback={this.clickSure}
          >
            {_confirmText}
          </DataLink >
        </div>
      </div>
    )
  }
}

PopupAlertMyaccount.defaultProps = {
  _text: '',
  _className: '',
  _zIndex: 200,
  _confirmText: '确认'
}

PopupAlertMyaccount.propTypes = {
  _text: PropTypes.string,
}

const mapStateToPrps = (state) => {
  const { popup_component } = state
  let POPUP_ALERT_PARAMETERS = {}
  if (popup_component) {
    POPUP_ALERT_PARAMETERS = popup_component.POPUP_ALERT_PARAMETERS
  }
  return Object.assign({}, POPUP_ALERT_PARAMETERS)
}

export default connect(mapStateToPrps, {
  popupAlert,
})(PopupAlertMyaccount)
