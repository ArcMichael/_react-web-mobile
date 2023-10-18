import React, { Component } from 'react';
import { getTrackingHref } from '@/lib/Tools';

/**
 * @typedef {{ href?:string; trackingCode?:string; } & HTMLDivElement} CardProps
 */

/**
 * @extends {React.Component<CardProps>}
 */
export default class Card extends Component {
  render() {
    const { href, onClick, className, style, children, trackingCode, ...restProps } = this.props;
    return (
      <div
        className={`homeb-card ${className || ''}`}
        style={{
          ...style,
        }}
        onClick={() => {
          if (href && typeof window !== 'undefined') {
            window.location.href = getTrackingHref({ _Href: href, _Omniture: trackingCode || '' });
          }
          if (onClick) onClick();
        }}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}
