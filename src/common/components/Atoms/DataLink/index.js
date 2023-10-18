/*
 * @Author: zoneTian
 * @Date: 2019-08-17 15:03:06
 * @Last Modified by: jonas.zheng
 * @Last Modified time: 2021-05-17 14:58:53
 */
import React from "react";
import Sensor from "../../../Utils/sensor";
import GoogleAnalytics from "../../../Utils/GoogleAnalytics";
import PropTypes from "prop-types";
import BaseALabel from "../Link/BaseALabel";

/**
 * @typedef {React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>} AnchorProps
 */

/**
 * @extends {BaseALabel<{
   _Content?:AnchorProps['children'];      显示的内容
   _ClassName?:AnchorProps['className'];   class名
   _Target?: AnchorProps['target'];        打开方式
   _Style?:AnchorProps['style'];           样式
   _Rel?:AnchorProps['ref'];               获取真实的dom组件
   _Title?: AnchorProps['title'];          未加载时显示 
   _Alt?: string;                          鼠标划过显示
   _Key?:AnchorProps['key'];               react组件唯一key值
   children?:AnchorProps['children'];     
   _GA?:{ [K:string]:any; };               ga布码
   _Sensor?:{
    eventKey:string;
    value?:any;
   };           sensor布码
   _ClickCallback?: () => void;            点击回调函数
   }>}
*/
class DataLink extends BaseALabel {
  constructor(props) {
    super(props);
  }
  handleClick(e) {
    const { _ClickCallback, _Content, _Sensor, _GA } = this.props;
    const { hrefLink } = this.state;
    if (_Sensor && _Sensor.eventKey && _Sensor.eventKey === "clickBanner_App_Mob") {
      Sensor &&
        Sensor.go(
          _Sensor.eventKey,
          Object.assign(
            {
              banner_to_url: hrefLink,
              banner_to_page_type: hrefLink,
              campaign_code: hrefLink,
              banner_content: _Content || null,
            },
            _Sensor.value,
          ),
        );
    } else if (_Sensor && _Sensor.eventKey) {
      Sensor.go(_Sensor.eventKey, _Sensor.value);
    }
    if (GoogleAnalytics && _GA && typeof _GA === "object") {
      if (_GA.version && _GA.version == "2") {
        GoogleAnalytics.pushV2(_GA.options);
      }
      GoogleAnalytics.push(_GA);
    }
    _ClickCallback && _ClickCallback(e);
  }
  render() {
    const { _Content, _ClassName, _Target, _Style, _Rel, _Title, _Alt, _Key, children } = this.props;
    const { hrefLink } = this.state;
    return (
      <a
        style={_Style}
        key={_Key}
        onClick={this.handleClick.bind(this)}
        target={_Target}
        title={_Title}
        alt={_Alt}
        className={_ClassName}
        href={hrefLink}
        rel={_Rel}
      >
        {children || _Content || ""}
      </a>
    );
  }
}
DataLink.defaultProps = {
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
  _GA: {},
};
DataLink.propTypes = {
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
  _GA: PropTypes.object,
  _Sensor: PropTypes.shape({
    eventKey: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
  }),
};

export default DataLink;
