/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/9
 * Function -- Atom component for button
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import LoadingAnimation from './LoadingAnimation'

/**
 * 本组件props.
 * @param {String} _className 传入的_className
 * @param {String} _width 按钮宽度
 * @param {String} _height 按钮高度
 * @param {String} _text 按钮内容
 * @param {Number} _status 0:默认状态置灰，不支持点击; 1:激活状态，支持点击 ; 2:loading动画，不支持点击
 * @param {String} _bottomShortLine 按钮正下方短横线，默认存在
 */

const DEFAULTPROPS = {
  _className: '',
  _width: '100%',
  _height: 88,
  _text: '',
  _status: 0,
  _bottomShortLine: true,
  _noRem: false,
}

const PROPTYPES = {
  _text: PropTypes.string.isRequired,
  _bottomShortLine: PropTypes.bool,
  _status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}
// 有个需求 需要按钮置灰仍可点击
const handleClick = (_clickCallback, _status) => {
  _status === 1 && _clickCallback && _clickCallback()
}

const BaseButton = ({
  _className,
  _width,
  _height,
  _text,
  _status,
  _bottomShortLine,
  _clickCallback,
  _noRem,
  _isChecked
}) => {
  const styleObj = {
    width: _width,
    height: _noRem ? _height : (_height / 100) + 'rem',
    lineHeight: _noRem ? _height + 'px' : (_height / 100) + 'rem',
  }
  return (
    <div className={_className}>
      <div
        className={['button-base-gray', 'button-base-black', 'button-base-load'][_status] + ' button-base '}
        style={styleObj}
        onClick={handleClick.bind(this, _clickCallback, _status, _isChecked)}
      >
        {_status === 2 ? <LoadingAnimation /> : _text}
      </div>
      {_bottomShortLine &&
        <div className='button-base-bottom'>
          <em className='button-base-short-line' />
        </div>
      }
    </div>
  )
}

BaseButton.defaultProps = DEFAULTPROPS
BaseButton.propTypes = PROPTYPES

export default BaseButton
