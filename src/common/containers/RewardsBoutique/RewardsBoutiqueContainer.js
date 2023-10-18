import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import RewardsBoutiqueStore from "../../components/RewardsBoutiqueStore/index";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/RewardsBoutiqueStore.scss");
}

import Dynamic from "@/Utils/Dynamic";

const dynamic = new Dynamic();

export default class RewardsBoutiqueContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brandId: null,
    };
  }
  componentDidMount() {
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
    if (isBrowser()) {
      if (
        window.location.pathname &&
        window.location.pathname.indexOf("rewardsBrand") >= 0 &&
        window.location.pathname.split("/")[4]
      ) {
        this.setState({
          brandId: window.location.pathname.split("/")[4],
        });
      }
    }
  }

  render() {
    const { brandId } = this.state;
    return (
      <div>
        <RewardsBoutiqueStore brandId={brandId} />
      </div>
    );
  }
}
