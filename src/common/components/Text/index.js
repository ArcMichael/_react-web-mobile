import React, { Component } from 'react';
import Title from './Title';
import { getTrackingHref } from '@/lib/Tools';

/**
 * @typedef {HTMLSpanElement & {
 *  ellipsis?:boolean | number;
 *  href?:string;
 *  trackingCode?:string;
 *  }} TextProps
 */

/**
 * @extends {React.Component<TextProps>}
 */
export default class Text extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.getEllipsis = this.getEllipsis.bind(this);
  }
  /**
   * @param {React.MouseEvent<HTMLSpanElement, MouseEvent>} event
   */
  handleClick(event) {
    const { href, onClick, trackingCode } = this.props;
    if (href) {
      window.location.href = getTrackingHref({ _Href: href, _Omniture: trackingCode || '' });
    }
    if (onClick) onClick(event);
  }

  getEllipsis() {
    const { ellipsis } = this.props;
    let cls = '';
    if (ellipsis) {
      if (typeof ellipsis === 'boolean' || ellipsis === 1) {
        cls = 'ellipsis';
      }
      if (typeof ellipsis === 'number' && ellipsis > 1) {
        cls = 'ellipsis-multi';
      }
    }
    return cls;
  }

  render() {
    const { ellipsis, children, href, onClick, className, style, trackingCode, ...restProps } = this.props;
    const WebkitLineClamp = typeof ellipsis === 'number' ? ellipsis : undefined;

    const cls = this.getEllipsis();

    return (
      <span
        className={`text ${cls} ${className || ''}`}
        onClick={this.handleClick}
        style={{
          WebkitLineClamp,
          ...style,
        }}
        {...restProps}
      >
        {children}
      </span>
    );
  }
}

Text.Title = Title;
