import React from "react";
import isBrowser from "@/Utils/utils/isBrowser";
import { connect } from "react-redux";
import getAd from "@/lib/blls/getAd";
import { getRankingList } from "../../actions/ranking";
import { urlGetParams } from "../../lib/url";
import ScrollContainer from "../../components/ScrollContainer/index";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/standings.scss");
}
let isAjax = false;
class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }
  componentDidMount() {
    const { getRankingList } = this.props;
    let rankingId = urlGetParams(window.location, "id");
    require.ensure([], () => {
      this.setState({
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        RankingList: require("./components/RankingList").default,
        PopupAlert: require("../../components/PopupAlert").default,
      });
    });
    getRankingList(rankingId, 1, (res) => {
      this.setState({
        data: res,
      });
    });
    getAd("app:best_selling_link",res => {
      if (
        res &&
        res.results &&
        res.results[0] &&
        res.results[0].contentDetails
      ) {
        const link = res.results[0].contentDetails[0].link;
        this.setState({ link });
      }
    })
  }
  gotoLink() {
    const { link } = this.state;
    if (link) {
        window.location.href = link;
      
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    //当页面滑动到底部时请求下一页列表的数据
    let { data } = this.state;
    let rankingId = urlGetParams(window.location, "id");
    let page = data.pageNum;
    if (
      nextProps.isBottom !== this.props.isBottom &&
      nextProps.isBottom &&
      !isAjax
    ) {
      if (data.lastPage) return;
      isAjax = true;
      this.props.getRankingList(rankingId, page ? page + 1 : 1, (res) => {
        isAjax = false;
        if (!res) return;
        let newData = Object.assign({}, res);
        if (data.content && data.content.length) {
          newData.content && newData.content.unshift(...data.content);
        }
        if (data.topSkus && data.topSkus.length) {
          newData.topSkus = data.topSkus;
        }
        this.setState({
          data: newData,
        });
      });
    }
  }
  render() {
    const { CurrentComponentCommonTop, RankingList, PopupAlert, data,link } =
      this.state;
    return (
      <div className="ranking-list-container">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {RankingList && data && <RankingList _data={this.state.data} />}
        {PopupAlert && <PopupAlert />}
        {link&&<img onClick={() => this.gotoLink()}  className="standing_more_icon" src="https://sslstage1.sephorastatic.cn/soa/mobile/images/standing_more_icon.png"/>}
      </div>
    );
  }
}

export default connect(
  () => {
    return {};
  },
  { getRankingList }
)(ScrollContainer(Ranking));
