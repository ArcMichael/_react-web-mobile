import React from "react";
import Dynamic from "@/Utils/Dynamic";
import isBrowser from "@/Utils/utils/isBrowser";
import IntergalDonate from "../components/IntergalDonate/index";

const dynamic = new Dynamic();
if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/intergalDonate.scss");
}
export default class IntergalDonateContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    dynamic.sepBridge().then((sep) => {
      sep.hideCloseButton && sep.hideCloseButton();
    });
  }
  render() {
    return (
      <div>
        <IntergalDonate />
      </div>
    );
  }
}
// const mapStateToProps = s => {
//   return {};
// };
// export default connect(mapStateToProps, {})(RewardsBoutiqueContainer);
