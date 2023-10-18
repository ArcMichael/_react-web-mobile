import React, { Component } from "react";
import Mpcms from "@/lib/services/Mpcms";
import ActionHomepage from "@/actions/homepage";
import { connect } from "react-redux";
import Session1 from "./Session1";
import Session2 from "./Session2";
import Session3 from "./Session3";
import Session4 from "./Session4";
import Session5 from "./Session5";
import Session6 from "./Session6";
import { Provider, TabContextInitvalue } from "./context";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {keyof typeof TabDict} TabKeyType
 */

/**
 * @typedef {{
 *    homepage:RootState['homepage'];
 *    tabInfo:import('@/lib/services/Mpcms').TabInfo;
 *    dispatch: import('redux').Dispatch;
 * }} TabCommonContentProps
 */

/**
 *
 * @param {import('@/lib/services/Mpcms').TabInfo} info
 */
const getTabType = info => {
  return info && info.id ? info.id.toUpperCase() : "";
};

/**
 * @extends {React.Component<TabCommonContentProps>}
 */
class TabCommonContent extends Component {
  constructor(props) {
    super(props);
    this.getTabDatas = this.getTabDatas.bind(this);
  }
  state = {
    session1: {},
    session2: {},
  };
  componentDidMount() {
    this.getTabDatas();
    this.action = new ActionHomepage(this.props.dispatch);
  }

  getContextValue(session1, session2) {
    const value = { ...TabContextInitvalue, ...session1, ...session2 };
    return value;
  }

  getTabDatas() {
    const { tabInfo, homepage } = this.props;
    const type = getTabType(tabInfo);
    const session1 = homepage[`tabDatas.${type.toUpperCase()}.session1`];
    const session2 = homepage[`tabDatas.${type.toUpperCase()}.session1`];
    if (!session1) {
      Mpcms.getTabSessionFirst(type.toLowerCase()).then(res => {
        if (res.status === 0) {
          this.action.updateTabData({
            tabKey: type,
            session: 1,
            data: res.results,
          });
        }
      });
    }
    if (!session2) {
      Mpcms.getTabSessionSecond(type.toLowerCase()).then(res => {
        if (res.status === 0) {
          this.action.updateTabData({
            tabKey: type,
            session: 2,
            data: res.results,
          });
        }
      });
    }
  }

  render() {
    const { tabInfo } = this.props;
    const contextValue = this.getContextValue(this.state.session1, this.state.session2);
    const type = getTabType(tabInfo);

    return (
      <Provider value={contextValue}>
        <div className="TabCommonContent">
          {/* hero banner */}
          <Session1 type={type} />
          <Session2 type={type} />
          <Session3 type={type} />
          <Session4 type={type} />
          <Session5 type={type} />
          <Session6 tabInfo={tabInfo} />
        </div>
      </Provider>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabCommonContent);
