import React, { Component } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import Success from "../../components/RewardsBoutiqueStore/component/PointExchange/postmailSuccess";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}
import Dynamic from "@/Utils/Dynamic";

const dynamic = new Dynamic();
export default class PostmailSuccess extends Component {
  componentDidMount() {
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
  }

  render() {
    return (
      <div>
        <Success />
      </div>
    );
  }
}
