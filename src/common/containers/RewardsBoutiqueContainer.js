import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import RewardsBoutiqueStore from "../components/RewardsBoutiqueStore/index";
if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/RewardsBoutiqueStore.scss");
}
export default class RewardsBoutiqueContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <RewardsBoutiqueStore />
      </div>
    );
  }
}
