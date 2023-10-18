/*
 *
 * Producer -- Alvin
 * Time -- 2018/1/9
 * Function -- Atom component for Loading version 2.0.0
 *
 */
import React from 'react'
import { getStyle } from '../../../lib/Tools'

/**
 * 本组件props.
 * @param {String} _className 传入的_className
 * @param {String} _width 按钮宽度
 * @param {String} _height 按钮高度
 */

const DEFAULTPROPS = {
  _className: '',
  _width: '100%',
  _height: 88,
}

class LoadingAnimation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animationLeft: 0,
    }
  }
  componentDidMount() {
    // 动画效果居中
    this.setState({
      animationLeft: parseInt(getStyle(this.animationBtn, 'width')) / 2 || 354,
    })
  }
  render() {
    const { _className, _width, _height } = this.props
    const { animationLeft } = this.state
    const styleObj = {
      width: _width,
      height: (_height / 100) + 'rem',
    }


    const styleLeft = {
      left: animationLeft,
    }

    return (
      <div className={'_atom_loading_animation ' + _className} style={styleObj} ref={(animation) => {this.animationBtn = animation}} >
        <div className='_atom_loading_animation_first' style={styleLeft} />
        <div className='_atom_loading_animation_second' style={styleLeft} />
        <div className='_atom_loading_animation_third' style={styleLeft} />
      </div>
    )
  }
}

LoadingAnimation.defaultProps = DEFAULTPROPS

export default LoadingAnimation
