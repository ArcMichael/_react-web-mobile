import React, { Component } from "react";
import TabPanel from "./TabPanel";

/**
 * @typedef {{
 *  active:number;
 *  onTabChange:(active:string, title:string, index:string) => void;
 *  style?:React.CSSProperties
 *  tabStyle?:React.CSSProperties;
 *  tabHeight?:number;
 * }} TabsProps
 */

/**
 * @typedef {import('./TabPanel').TabPanelProps} TabPanelProps
 */

/**
 * @extends {React.Component<TabsProps>}
 */
export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.getTabItem = this.getTabItem.bind(this);
    this.getTabPanel = this.getTabPanel.bind(this);
  }
  /** @type {HTMLUListElement} - description */
  tabUl = null;
  componentDidMount() {}

  getTabItem() {
    const { children, active, onTabChange } = this.props;
    return React.Children.map(children, (item, i) => {
      /** @type {TabPanelProps} - description */
      const itemProps = item.props;
      return (
        <li
          key={`${i}`}
          className={active === item.key ? "tab-item-active" : ""}
          data-scarabitem="category"
          onClick={() => {
            onTabChange(item.key, itemProps.title, i);
          }}
          style={{
            ...itemProps.tabStyle,
          }}
        >
          {itemProps.title}
          {active === item.key ? <span /> : null}
        </li>
      );
    });
  }

  getTabPanel() {
    const { children, active } = this.props;
    return React.Children.map(children, (item) => {
      if (item.key === active) {
        return <div key={item.key}>{item}</div>;
      }
      return <div key={item.key} />;
    });
  }

  render() {
    const { style, tabStyle } = this.props;
    return (
      <div className="tab-wrap" style={{ ...style }}>
        <ul
          ref={(ref) => {
            this.tabUl = ref;
          }}
          style={{
            ...tabStyle,
          }}
        >
          {this.getTabItem()}
          <li className="contentClear" />
        </ul>
        <div>{this.getTabPanel()}</div>
      </div>
    );
  }
}

Tabs.TabPanel = TabPanel;
