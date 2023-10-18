import React from "react";
import { connect } from "react-redux";
import Mpcms from "@/lib/services/Mpcms";
import ActionHomepage from "@/actions/homepage";
import loadable from "@loadable/component";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import Session1 from "./Session1";
import Session2 from "./Session2";
import { Consumer } from "../context";

const Session3 = loadable(() => import("./Session3"));
const Session4 = loadable(() => import("./Session4"));
const Session5 = loadable(() => import("./Session5"));
const GusessYouLike = loadable(() => import("../components/GusessYouLike"));

/**
 * @typedef
 * {{
 *  isLogin:boolean;
 *  guessyoutlikeParams:any;
 * }} TabOneContentProps
 * */

/**
 * @extends {React.Component<TabOneContentProps>}
 */
class TabOneContent extends React.Component {
  static SephoraPicksScroll = 200;

  constructor(props) {
    super(props);
    this.getSephoraPicks = this.getSephoraPicks.bind(this);
    this.getSession5Data = this.getSession5Data.bind(this);
    this.getSessionFirstData = this.getSessionFirstData.bind(this);
    this.state = {
      /** @type {import('@/lib/services/Mpcms').SephoraPickItem[]} - description */
      sephoraPicks: [],
      /** @type {import('./Session5').Session5Props['dataSource']} - description */
      beautyDataSource: {
        top: {},
        mids: [],
        bottoms: [],
      },
    };
  }

  componentDidMount() {
    let isInit = false;
    window.addEventListener("scroll", () => {
      if (bodyScrollTop.get() > 0 && !isInit) {
        isInit = true;
        this.getSession5Data();
        this.getSephoraPicks();
      }
    });

    const {
      homepage: { session1 },
      isLogin,
    } = this.props;
    if (!session1 || isLogin) {
      this.getSessionFirstData();
    }
    this.action = new ActionHomepage(this.props.dispatch);
  }

  /**
   *
   * @param {TabOneContentProps} nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isLogin && nextProps.isLogin !== this.props.isLogin) {
      this.getSessionFirstData();
    }
  }

  getSessionFirstData() {
    Mpcms.getSessionFirst().then((res) => {
      if (res.status === 0 && res.results) {
        this.action.updateHomeSession1(res.results);
      }
    });
  }

  getSephoraPicks() {
    Mpcms.getSessionSecond().then((res) => {
      if (res.status === 0 && res.results && res.results.sephoraPicks) {
        this.setState({
          sephoraPicks: res.results.sephoraPicks,
        });
      }
    });
  }
  getSession5Data() {
    console.log(22222);
    /** @type {import('./Session5').Session5Props['dataSource']} - description */
    let beautyDataSource = {
      top: {},
      mids: [],
      bottoms: [],
    };
    Mpcms.getSessionThird().then((thirdRes) => {
      if (
        thirdRes.status === 0 &&
        thirdRes.results &&
        thirdRes.results.beautyChannel
      ) {
        Mpcms.getCommonBannerByKey(
          Mpcms.BannerEnums.hometab.beautyChanel3
        ).then((res) => {
          if (res.status === 0 && Array.isArray(res.results)) {
            beautyDataSource.top = thirdRes.results.beautyChannel.large;
            beautyDataSource.mids = thirdRes.results.beautyChannel.medium;
            beautyDataSource.bottoms = res.results;
            this.setState({
              beautyDataSource: beautyDataSource,
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <Consumer>
        {({ scrollTop, afterGetIsLogin }) => {
          return (
            <div className="TabOneContent">
              {/* hero banner */}
              <Session1 />
              {/* banner下的5个 */}
              <Session2 />
              {/* 公告/品牌强 */}
              {scrollTop > 0 && <Session3 />}
              {/* picks */}
              {scrollTop > 0 && (
                <Session4 picks={this.state.sephoraPicks} />
              )}
              {/* 美力广场 */}
              {scrollTop > 0 && (
                <Session5 dataSource={this.state.beautyDataSource} />
              )}
              {afterGetIsLogin && scrollTop > 0 && (
                <GusessYouLike {...this.props.guessyoutlikeParams} />
              )}
            </div>
          );
        }}
      </Consumer>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect((state) => {
  return {
    homepage: state.homepage,
  };
}, mapDispatchToProps)(TabOneContent);
