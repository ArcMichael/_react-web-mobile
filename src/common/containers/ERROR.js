import React from "react";
import OiaWrap from "../components/OiaWrap";

if (__DEV__) require("../../public/style/error.scss");

class ERROR extends React.Component {
  render() {
    return <div className="site">&quot;404&quot;</div>;
  }
}

export default OiaWrap(ERROR);
