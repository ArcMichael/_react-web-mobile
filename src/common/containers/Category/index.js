import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CategorySearch from "@/components/Category/CategorySearch";
import BottomMenus from "@/components/BottomMenus";
import Categoryproduct from "@/components/Category/Categoryproduct";
import Categoryproductmenu from "@/components/Category/Categoryproductmenu";
import Commontop from "@/components/CommonTop/index";
import browserHistory from "@/store/browserHistory";
import { wxBack } from "../../Utils";
import * as actions from "../../actions/category";
import GoogleAnalytics from "../../Utils/GoogleAnalytics";
import isBrowser from "@/Utils/utils/isBrowser";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/index.scss");
  require("../../../public/style/category.scss");
}
class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
    };
  }

 
  componentDidMount() {
    sessionStorage.setItem("rout",window.location.pathname)
    if (browserHistory.getCurrentLocation().query.wxredirect) {
      wxBack(
        window.navigator.userAgent,
        decodeURIComponent(browserHistory.getCurrentLocation().query.wxredirect),
      );
    }
    const { actions, CategoryConts } = this.props;
    // CategoryConts 护肤--肤食
    actions.menuChange(1);

    let name;
    if (CategoryConts.results && CategoryConts.results.length > 0) {
      CategoryConts.results.map((el) => {
        if (el.checked) {
          name = el.nameCN;
        }
      });
    }

    this.setState({
      name: `商品列表:${name}`,
    });
    GoogleAnalytics.push({
      event: "Navigation",
      navigationLevel: name,
      navigationDetail: name,
    });
  }

  render() {
    return (
      <div className="category">
        <Commontop />
        <CategorySearch pageType="Navigation-page" typed="searchlist" key="1" proClass="fixModel" />
        <Categoryproductmenu />
        <Categoryproduct key="2" name={this.state.name} />
        <BottomMenus />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    category: state.categoryOne,
    CategoryConts: state.CategoryConts,
  }),
  (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
  }),
)(Category);
