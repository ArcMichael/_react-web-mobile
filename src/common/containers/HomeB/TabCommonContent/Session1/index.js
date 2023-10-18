import React, { Component } from "react";
import Carousel from "@/containers/HomeB/components/Carousel";
import settings from "@/containers/HomeB/settings";
import { connect } from "react-redux";

/**
 * @typedef {import('@/containers/HomeB/TabCommonContent/index').TabKeyType} TabKeyType
 */

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 *    type:TabKeyType
 *    homepage:RootState['homepage'];
 *    dispatch: import('redux').Dispatch;
 * }} Session1Props
 */

/**
 * @extends {React.Component<Session1Props>}
 */
class Session1 extends Component {
  render() {
    const { type, homepage } = this.props;

    const session1 = homepage[`tabDatas.${type.toUpperCase()}.session1`];

    const hero = session1 && session1.hero;

    const height = "6.72rem";

    return (
      <div className="Session1" style={{ height: height, overflow: "hidden", margin: "0 -0.24rem" }}>
        <Carousel
          height={height}
          type={type}
          dataSource={(hero || []).slice(0, settings.limits.tabHeroBanner)}
         />
      </div>
    );
  }
}

/**
 * @param {import('@/store/configureStore').RootState} state
 */
const mapStateToProps = state => {
  return {
    homepage: state.homepage,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Session1);
