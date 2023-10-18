import React, { Component } from 'react';
import Text from '@/components/Text';
import { getTrackingHref } from '@/lib/Tools';

const { Title } = Text;

/**
 * @typedef {{
 *  title:string;
 *  link?:string;
 *  trackingCode?:string;
 *  icon?:React.ReactNode;
 *  titleProps?:import('@/components/Text/Title').TitleProps
 * } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} ChannelTitleProps
 */

/**
 * @extends {React.Component<ChannelTitleProps>}
 */
export default class ChannelTitle extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  static defaultProps = {
    titleProps: {},
  };
  handleClick() {
    if (onClick) onClick();
    const { link, trackingCode, onClick } = this.props;
    if (link) {
      window.location.href = getTrackingHref({ _Href: link, _Omniture: trackingCode || '' });
    }
  }

  render() {
    const { title, style, icon, className, titleProps, link, trackingCode, onClick, ...restProps } = this.props;
    const { className: titleClassName, style: titleStyle, ...restTitleProps } = titleProps;
    return (
      <div
        className={`channel-title ${className || ''}`}
        style={{
          ...style,
        }}
        onClick={this.handleClick}
        {...restProps}
      >
        <Title className={titleClassName} ellipsis style={{ margin: '0', ...titleStyle }} {...restTitleProps}>
          {title}
        </Title>
        {icon}
      </div>
    );
  }
}
