import React, { Component } from "react";
import ActionHomepage from "@/actions/homepage";
import { connect } from "react-redux";
import GusessYouLike from "../../components/GusessYouLike";
import { Consumer } from "../../context";
import getADcontent from "../../libs/getADcontent";

/**
 * @typedef {import('@/store/configureStore').RootState} RootState
 */

/**
 * @typedef {{
 *    tabInfo:import('@/lib/services/Mpcms').TabInfo;
 *    homepage:RootState['homepage'];
 *    dispatch: import('redux').Dispatch;
 * }} Session5Props
 */

/**
 * @typedef {import('@/lib/services/Mpcms').ProductCommonDetail} ProductCommonDetail
 */

/**
 *
 * @param {import('@/lib/services/Mpcms').TabInfo} info
 */
const getTabType = info => {
  return info && info.id ? info.id.toUpperCase() : "";
};

let brand = []; // 广告位数组

/**
 * @extends {React.Component<Session5Props>}
 */
class Session6 extends Component {
  constructor(props) {
    super(props);
    this.getTitleAndProducts = this.getTitleAndProducts.bind(this);
  }

  /** @type {ActionHomepage} - description */
  action = null;

  componentDidMount() {
    this.action = new ActionHomepage(this.props.dispatch);
    brand.length === 0 &&
      getADcontent("mobile:tab:ex:brand_desc").then(res => {
        res.map(d => {
          brand.push(d.contentDetails[0].text);
        });
      });
  }

  getTitleAndProducts() {
    const { tabInfo } = this.props;
    const type = getTabType(tabInfo);

    const TabDict = {
      SK: "护肤",
      MU: "彩妆",
      FR: "香水",
      EX: "小众",
      ME: "男士",
      FC: "护肤",
    };

    let logic = TabDict[tabInfo.id.toUpperCase()] || "";
    let logicType = "CATEGORY";

    // if (tabInfo.id.toUpperCase() === "EX") {
    //   logic = null;
    //   logicType = null;
    // }
    return {
      logic,
      logicType,
      type: type,
    };
  }

  render() {
    const { logic, logicType, type } = this.getTitleAndProducts();
    const { tabInfo } = this.props;
    return (
      <div className="Session6">
        <Consumer>
          {v => {
            return (
              v.afterGetIsLogin && (
                <GusessYouLike
                  emarsysRecommendParams={{
                    limit: 50,
                    logic,
                    logicType,
                  }}
                  recommendParam={tabInfo.recommendParam}
                  brand={brand}
                  type={type}
                  tabId={tabInfo.id}
                  isLogin={v.isLogin}
                />
              )
            );
          }}
        </Consumer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Session6);
