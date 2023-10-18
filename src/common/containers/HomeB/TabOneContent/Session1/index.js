import React, { Component } from "react";
import { connect } from "react-redux";
import Carousel from "@/containers/HomeB/components/Carousel";
import settings from "@/containers/HomeB/settings";

/**
 * @typedef {import("@/store/configureStore").RootState} RootState
 */

/**
 * @typedef {Pick<RootState,'homepage'>} Session1Props
 */

/**
 * @extends {React.Component<Session1Props>}
 */
export class Session1 extends Component {
  render() {
    const {
      homepage: { session1 },
    } = this.props;

    const { hero } = session1 || {};

    const height = "6.72rem";

    return (
      <div className="Session1" style={{ height: height, margin: "0 -0.24rem", overflow: "hidden" }}>
        <Carousel height={height} dataSource={(hero || []).slice(0, settings.limits.heroBanner)} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  homepage: state.homepage,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Session1);
