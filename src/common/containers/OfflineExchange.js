import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
}
export default class OfflineContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        OfflineExchange
        {/* <OfflineExchange /> */}
      </div>
    );
  }
}
// const mapStateToProps = s => {
//   return {};
// };
// export default connect(mapStateToProps, {})(RewardsBoutiqueContainer);
