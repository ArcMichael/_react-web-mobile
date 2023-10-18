import React, { Component } from "react";
import CertificateIndex from "../../components/RewardsBoutiqueStore/component/PointExchange/certificate";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}
import Dynamic from "@/Utils/Dynamic";

const dynamic = new Dynamic();
export default class Certificate extends Component {
  componentDidMount() {
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
  }
  render() {
    return (
      <div>
        <CertificateIndex />
      </div>
    );
  }
}
