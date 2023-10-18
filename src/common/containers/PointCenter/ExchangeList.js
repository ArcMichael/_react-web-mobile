import React, { Component } from "react";
import Dynamic from "@/Utils/Dynamic";
import isBrowser from "@/Utils/utils/isBrowser";

const dynamic = new Dynamic();
import List from "../../components/RewardsBoutiqueStore/component/PointExchange/list";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}

export default class ExchangeList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
  }

  render() {
    return (
      <div>
        <List />
      </div>
    );
  }
}
