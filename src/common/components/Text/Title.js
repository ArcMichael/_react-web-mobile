import React, { Component } from 'react';
import { getTrackingHref } from '@/lib/Tools';

/**
 * @typedef {HTMLSpanElement & {
 *  ellipsis?:boolean | number;
 *  level?:1 | 2 | 3 | 4
 *  href?:string;
 *  trackingCode?:string;
 *  onClick?:(event:React.MouseEvent<HTMLHeadingElement, MouseEvent>) => void;
 *  }} TitleProps
 */

/**
 * @extends {React.Component<TitleProps>}
 */
export default class Title extends Component {
  constructor(props) {
    super(props);
    this.getRender = this.getRender.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * @param {React.MouseEvent<HTMLHeadingElement, MouseEvent>} event
   */
  handleClick(event) {
    const { href, onClick, trackingCode } = this.props;
    if (onClick) onClick(event);
    if (href) {
      window.location.href = getTrackingHref({ _Href: href, _Omniture: trackingCode || '' });
    }
  }

  getRender() {
    const { ellipsis, children, className, href, onClick, level = 4, style, trackingCode, ...restProps } = this.props;
    const WebkitLineClamp = typeof ellipsis === 'number' ? ellipsis : undefined;
    return React.createElement(
      `h${level}`,
      {
        className: `text ${ellipsis ? 'ellipsis' : ''} ${className || ''}`,
        onClick: this.handleClick,
        style: {
          WebkitLineClamp,
          ...style,
        },
        ...restProps,
      },
      children,
    );
  }

  render() {
    return this.getRender();
  }
}
