/*
 * @Author: summer
 * @Date: 2021-06-Th 04:49:24
 * @Last Modified by:   summer
 * @Last Modified time: 2021-06-Th 04:49:24
 * 护肤--肤食
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions/category";
import * as commonVenders from "../../actions/commonVenders";
import { getCookie } from "../../Utils/utils/cookie";
import getRunEnv from "../../../isomorphisms/getRunEnv";

class CategoryMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: "",
      obj: null,
    };
  }

  componentDidMount() {
    // Emarsys
    const { obj } = this.props;
    const pathname = window.location.pathname;
    getCookie().then((cookie) => {
      if (cookie("UID")) {
        if (obj.checked) {
          const firstCatalog = obj.nameCN;
          this.props.commonVenders.pushEmarsys(["category", firstCatalog]);
          this.props.commonVenders.pushEmarsys([
            "setCustomerId",
            cookie("UID"),
          ]);
        }
      } else if (obj.checked) {
        const firstCatalog = obj.nameCN;
        this.props.commonVenders.pushEmarsys(["category", firstCatalog]);
      }
      if (!/^\/category\/.+\/$/.test(pathname)) {
        obj.checked = false;
      }
      let classCur = "";
      if (obj.checked) {
        classCur = "cur";
      }
      this.setState({ classCur });
    });
  }

  componentDidUpdate() {
    const { pathname, obj } = this.state; // TODO: 请移除无用state summer
    console.log(pathname, obj);
  }

  render() {
    const { obj, callback, _index } = this.props;
    let Href = "";
    const { classCur } = this.state;
    const env = getRunEnv();
    let host = "https://m.sephora.cn";
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    } else if (env === "qa2") {
      host = "https://testm.sephora.cn";
    }
    Href = `${host}/category/${obj.id}/`;
    return (
      <h1 className={classCur}>
        <a href={Href} onClick={() => callback(Href, obj.nameCN, _index)}>
          {obj.nameCN}
        </a>
      </h1>
    );
  }
}

export default connect(
  (state) => ({
    category: state.categoryOne,
  }),
  (dispatch) => ({
    actions: bindActionCreators(actions, dispatch),
    commonVenders: bindActionCreators(commonVenders, dispatch),
  })
)(CategoryMenuList);
