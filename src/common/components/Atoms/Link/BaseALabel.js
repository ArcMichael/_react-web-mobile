import getConfigs from "isomorphisms/getConfigs";
import React from "react";
import { getTrackingHref } from "../../../lib/Tools";
import { urlPathGoThrough } from "./urlRegExp";

const configs = getConfigs();

export default class BaseALabel extends React.PureComponent {
  constructor(props) {
    super(props);
    let hrefLink = "";
    if (this.props._Href) {
      if (
        this.props._Https === "https" &&
        !urlPathGoThrough(this.props._Href)
      ) {
        hrefLink = configs.abtest + this.props._Href;
      } else {
        this.props._Href;
      }
    } else {
      hrefLink = "";
    }

    this.state = {
      hrefLink: hrefLink,
    };
  }

  componentDidMount() {
    const { _Href, _Omniture, _Https } = this.props;
    const { hrefLink } = this.state; // TODO: 请移除无用state
    console.log(hrefLink);
    if (_Href && urlPathGoThrough(_Href)) {
      this.setState({
        hrefLink: _Href,
      });
    } else {
      this.setOM({ _Href, _Omniture, _Https });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps._Href !== this.props._Href) {
      const { _Href, _Omniture, _Https } = nextProps;
      if (_Href && urlPathGoThrough(_Href)) {
        this.setState({
          hrefLink: _Href,
        });
      } else {
        this.setOM({ _Href, _Omniture, _Https });
      }
    }
  }

  setOM({ _Omniture, _Href, _Https }) {
    const href = getTrackingHref({ _Omniture, _Href, _Https });
    this.setState({
      hrefLink: href,
    });
  }
}
