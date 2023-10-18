import React, { Component } from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import OiaWrap from "@/components/OiaWrap";
import { withRouter } from "react-router";
import { GetSingleCookie } from "../../lib/Tools";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/exchange.scss");
}

class rewardsBoutiqueGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentComponentDeepLink: null,
    };
  }
  componentDidMount() {
    if (isBrowser() && !GetSingleCookie(document.cookie, "Token")) {
      window.location.href = `/login?historyLocation=${encodeURIComponent(
        window.location.pathname.replace("/", "").replace("?", "&"),
      )}${window.location.search.replace("?", "&")}`;
    }
    require.ensure([], () => {
      const CurrentComponentDeepLink = require("../../components/DeepLink/index").default;
      this.setState({
        CurrentComponentDeepLink,
      });
    });
  }
  render() {
    const { CurrentComponentDeepLink } = this.state;
    return (
      <div className="reward_guide_page">
        {CurrentComponentDeepLink && <CurrentComponentDeepLink channel={"rewardsBoutique"} />}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: state.cart,
  homepage: state.homepage,
  globalReference: state.globalReference,
});

const mapDispatchToProps = {};
export default OiaWrap(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(rewardsBoutiqueGuide)),
);
