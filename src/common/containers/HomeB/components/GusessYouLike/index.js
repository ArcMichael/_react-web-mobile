import React from "react";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import ChannelTitle from "../ChannelTitle";
import Card from "../Card";
import Utils from "./utils";
import GuessYouLikeItem from "./GuessYouLikeItem";

/**
 * @typedef {import('./GuessYouLikeItem').DataSourceType} GuessYouLikeProductItem
 */

/**
 * @typedef {{
 *  logic:string;
 *  logicType:string;
 *  limit:number;
 * }} EmarsysRecommendParams
 *
 * @typedef {{
 *  emarsysRecommendParams:EmarsysRecommendParams;
 *  type:import('../../TabCommonContent').TabKeyType;
 *  tabId:string;
 *  isLogin:boolean;
 *  brand:string
 * }} GuessYouLikeProps
 */

/**
 * @typedef {{
 * guessYouLikeDatas:GuessYouLikeProductItem[];
 * }} GuessYouLikeState
 */

/**
 * @extends {React.Component<GuessYouLikeProps, GuessYouLikeState>}
 */
export default class GuessYouLike extends React.Component {
  constructor(props) {
    super(props);
    this.getGuessYouLikeDatas = this.getGuessYouLikeDatas.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.getGuessYouLikeItem = this.getGuessYouLikeItem.bind(this);
    this.state = {
      /** @type {GuessYouLikeProductItem[]} - description */
      guessYouLikeDatas: [],
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    if (typeof window !== "undefined") {
      const scrollTop = bodyScrollTop.get();
      if (scrollTop >= 0) {
        this.getGuessYouLikeDatas();
        window.removeEventListener("scroll", this.handleScroll);
      }
    }
  }

  getGuessYouLikeDatas() {
    const { isLogin, emarsysRecommendParams, type, tabId, brand, recommendParam } = this.props;

    if (isLogin) {
      let startIndex = 10;
      const newPostsPos = [];
      while (startIndex <= 59) {
        newPostsPos.push(startIndex, startIndex + 1);
        startIndex = startIndex + 6;
      }

      Utils.getGuessYoueLikeDatas({
        emarsysRecommendParams,
        type,
        postPosList: newPostsPos,
        brand,
        tabId,
        recommendParam,
      }).then((res) => {
        this.setState({
          guessYouLikeDatas: res,
        });
      });
    } else {
      Utils.getGuessYoueLikeDatas({
        emarsysRecommendParams,
        tabId,
        type,
        postPosList: [41],
        brand,
        recommendParam,
      }).then((res) => {
        this.setState({
          guessYouLikeDatas: res,
        });
      });
    }
  }

  getGuessYouLikeItem() {
    return this.state.guessYouLikeDatas.map((item, index) => {
      return (
        <GuessYouLikeItem
          key={`guess-you-like-${index}`}
          dataSource={item}
          type={item && item.__type__}
          index={index}
          pageType={this.props.type}
          onClick={() => {
            Utils.getSensorData({
              platform_type: "mobile",
              system_type: "",
              environment_type: "",
              vip_card: "",
              vip_card_type: "",
              action_id: "1000001_019",
              page_id: "MB_1000001",
              $title: "首页",
              page_type_detail: "",
              page_type: "",
              $url_path: "",
              $url_query: "",
              $url: "",
              current_url: "",
              banner_current_url: "home",
              banner_current_page_type: "home",

              searchContent: item.c_custom_0 + "|" + item.title + "|" + item.item,
              searchlink: `https://m.sephora.cn/product/${item.item}.html/?prodlink=NewHome|GuessYouLike|Position(${index})|${item.item}`,
              omniture: item.item,
              index,
              item,
              type: this.props.type,
              op_code: item.id,
              commodity_sku: item.c_custom_1,
              
            });
          }}
        />
      );
    });
  }

  render() {
    const { type } = this.props;

    /** @type {React.CSSProperties} - description */
    const channelTitleStyle = type
      ? {
        padding: "0 0.24rem",
        marginTop: "0.6rem",
        marginBottom: "0.32rem",
      }
      : {
        padding: "0 0.24rem",
        margin: "0.48rem 0 0.32rem",
      };
    return (
      <div
        id="GuessYouLike"
        className="homeb-gusess"
        style={{
          margin: "0 -0.24rem",
        }}
      >
        {Array.isArray(this.state.guessYouLikeDatas) && (
          <div
            className="home-guess-you-like"
            id="GuessYouLike"
            ref={(ref) => (this.guessYouLike = ref)}
          >
            <ChannelTitle title="推荐" style={channelTitleStyle} />
            <Card>
              <div className="guess-you-lik-wrap">{this.getGuessYouLikeItem()}</div>
            </Card>
          </div>
        )}
      </div>
    );
  }
}
