import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import ABTesting from "../Atoms/Link/ABTesting";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import Sensor from "../../Utils/sensor/index";

const CONFIGTABBAR = require("./configData.json");

class CommonTabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientChange: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    const { clientChange } = this.state; // TODO: 请移除无用state
    console.log(clientChange);
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll() {
    const scale = window.innerWidth / window.screen.width;
    const isScale = window.screen.height - window.innerHeight / scale < 100;
    this.setState({ clientChange: isScale });
  }
  handleClick(item, resource) {
    GoogleAnalytics.push({
      event: "ButtonClick",
      eventName: "快捷导航-" + item.defaultText,
      buttonPosition: resource || item.defaultText,
    });
    GoogleAnalytics.pushV2({
      event: "menuClick",
      menuName: item.defaultText,
    });
    if (item.sensor) {
      return;
    }
    Sensor.go("clickBanner_App_Mob", {
      $lib_detail: "M_NewMobile##getSensorData##CommonTabBar.js##9",
      banner_type: "tag",
      banner_content: item.defaultText,
      banner_belong_area: "bottombar",
      banner_to_url: item.link,
      banner_to_page_type: "Function-page",
      belong_team: item.belongTeam,
    });
  }
  render() {
    const { _keySign, _resource } = this.props;
    return (
      <ul className={`common_tab_bar_module`}>
        {CONFIGTABBAR &&
          CONFIGTABBAR.map((item, index) => {
            const newReg = new RegExp(item.regRexTest);
            return (
              <li
                key={
                  _keySign ? `${_keySign}-${index}` : `common-tab-bar-${index}`
                }
              >
                <ABTesting
                  _Https="https"
                  _Href={item.link}
                  _ClickCallback={this.handleClick.bind(this, item, _resource)}
                  _GA={{
                    version: "2",
                    options: {
                      event: "campaignSpotClick",
                      blockName: "bottom bar",
                      campaignCode:
                        item.link.split(/intcmp=|prodlink=|kwrec=/)[1] &&
                        item.link
                          .split(/intcmp=|prodlink=|kwrec=/)[1]
                          .split("&")[0],
                      spotName: item.defaultText,
                    },
                  }}
                >
                  <img
                    src={
                      isBrowser() &&
                      window.__INITIAL_ENV__ &&
                      window.__INITIAL_ENV__.Location &&
                      window.__INITIAL_ENV__.Location.pathname &&
                      newReg.test(window.__INITIAL_ENV__.Location.pathname)
                        ? item.activeIcon
                        : item.defaultIcon
                    }
                  />
                  <span
                    className={
                      isBrowser() &&
                      window.__INITIAL_ENV__ &&
                      window.__INITIAL_ENV__.Location &&
                      window.__INITIAL_ENV__.Location.pathname &&
                      newReg.test(window.__INITIAL_ENV__.Location.pathname)
                        ? "active"
                        : ""
                    }
                  >
                    {item.defaultText}
                  </span>
                </ABTesting>
              </li>
            );
          })}
      </ul>
    );
  }
}

const mapStateToProps = (s) => {
  const { view } = s;
  const { SCROLL_TOP } = view;
  return {
    SCROLL_TOP,
  };
};
export default connect(mapStateToProps, {})(CommonTabBar);
