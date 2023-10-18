/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/10
 * Function -- Common module for Button
 *
 */
import React from 'react'
import PropTypes from 'prop-types'

import BaseButton from './BaseButton'
import ValidationButton from './ValidationButton'
import LoadingAnimation from './LoadingAnimation'
import GraphicButton from './GraphicButton'

const BUTTONS = {
  BaseButton,
  ValidationButton,
  LoadingAnimation,
  GraphicButton,
}

const DEFAULTPROPS = {
  _type: 'BaseButton',
}

const PROPTYPES = {
  _type: PropTypes.string,
}

const Button = (props) => {
  const { _type } = props
  const ButtonComponent = BUTTONS[_type]
  return <ButtonComponent {...props} />
}

Button.defaultProps = DEFAULTPROPS
Button.propTypes = PROPTYPES

export default Button
