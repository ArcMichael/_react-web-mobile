
import React from 'react'
import PropTypes from 'prop-types'
import PopupForEmail from './PopupForEmail';

let comps = {
  PopupForEmail,
}

const BelowPopup = ({
    _title,
    _closeHandle,
    component,
    ...props
}) => {
  const Comp = comps[component];

  return  Comp&& <div className='belowpopup_body' onTouchMove={(e)=>e.preventDefault()}>
          <div className='belowpopup_body_container'>
            <div className='belowpopup_body_title'>
              {_title}
              <div className='belowpopup_body_close_icon' onClick={_closeHandle} />
            </div>
            <Comp {...props} />
          </div>
        </div>}

BelowPopup.defaultProps = {
  _title:'',
}
BelowPopup.propTypes = {
  _title: PropTypes.string,
  _closeHandle:PropTypes.func
}
export default BelowPopup
