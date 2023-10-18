import React from "react";
import PropTypes from "prop-types";
import BaseALabel from "./BaseALabel";
import Sensor from "../../../Utils/sensor";
import GoogleAnalytics from "../../../Utils/GoogleAnalytics";
class ABTesting extends BaseALabel {
  handleClick() {
    const { _ClickCallback, _Content, _Sensor, _GA } = this.props;
    const { hrefLink } = this.state;
    if (_Sensor && _Sensor.eventKey === "clickBanner_App_Mob") {
      Sensor.go(_Sensor.eventKey, {
        banner_to_url: hrefLink,
        banner_to_page_type: hrefLink,
        campaign_code: hrefLink,
        banner_content: _Content,
        ..._Sensor.value,
      });
    }
    if (GoogleAnalytics && _GA && typeof _GA === "object") {
      if (_GA.version && _GA.version == "2") {
        GoogleAnalytics.pushV2(_GA.options);
      }
    }
    _ClickCallback && _ClickCallback();
  }
  render() {
    const { _Content, _ClassName, _Target, _Style, _Omniture, _Rel, _Key, children } = this.props;
    const { hrefLink } = this.state;
    return (
      <a
        style={_Style}
        onClick={this.handleClick.bind(this)}
        target={_Target}
        key={_Key}
        className={_ClassName}
        href={hrefLink}
        data-omniture={_Omniture}
        rel={_Rel}
      >
        {children || _Content}
      </a>
    );
  }
}
ABTesting.defaultProps = {
  _Href: "#",
  _Content: "",
  _Https: "",
  _ClassName: "",
  _Target: "",
  _Style: {},
  _Omniture: "",
  _Rel: "",
  _Title: "",
  _Alt: "",
  _Key: "",
  _Sensor: {},
};
ABTesting.propTypes = {
  _Href: PropTypes.string,
  _Content: PropTypes.string,
  _Https: PropTypes.string,
  _ClassName: PropTypes.string,
  _Target: PropTypes.string,
  _Style: PropTypes.object,
  _Omniture: PropTypes.string,
  _Rel: PropTypes.string,
  _Title: PropTypes.string,
  _Alt: PropTypes.string,
  _Key: PropTypes.string,
  _ClickCallback: PropTypes.func,
};
export default ABTesting;
