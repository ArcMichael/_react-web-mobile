import React, { Component } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import Dynamic from "@/Utils/Dynamic";
import Success from "../../components/RewardsBoutiqueStore/component/PointExchange/exchangeSuccess";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}

const dynamic = new Dynamic();
export default class ExchangeSuccess extends Component {
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
