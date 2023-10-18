import React, { Component } from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import Detail from "../../components/RewardsBoutiqueStore/component/PointExchange/detail";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}
import Dynamic from "@/Utils/Dynamic";

const dynamic = new Dynamic();
export default class ExchangeDetail extends Component {
  componentDidMount() {
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
  }
  render() {
    return (
      <div>
        <Detail />
      </div>
    );
  }
}
