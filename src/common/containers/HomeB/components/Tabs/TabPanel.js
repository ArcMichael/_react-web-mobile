import React, { Component } from 'react';

/**
 * @typedef {{
 *  title:string;
 *  tabStyle?:HTMLLIElement;
 *  tabContentStyle?:HTMLDivElement
 * }} TabPanelProps
 */

/**
 * @extends {React.Component<TabPanelProps>}
 */
export default class TabPanel extends Component {
  render() {
    const { children, tabContentStyle } = this.props;
    return <div {...tabContentStyle}>{children}</div>;
  }
}
