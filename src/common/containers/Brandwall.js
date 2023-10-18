/*
 * @Author: zone Tian
 * @Date: 2020-02-03 14:54:11
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:37:24
 */
import React from "react";
import { connect } from "react-redux";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import isBrowser from "@/Utils/utils/isBrowser";
import CurrentComponentCommonTop from "../components/CommonTop";
import BrandComponent from "../components/BrandWall";
import { TrackEnterResource } from "../lib/Tools";
import OiaWrap from "../components/OiaWrap";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/brandWall.scss");
}

class BrandWall extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollmenu = this.scrollmenu.bind(this);
    this.scrollcur = this.scrollcur.bind(this);

    this.state = {
      CommonPageTitle: null,
      dataOffset: [],
      curId: 0,
    };
  }

  componentDidMount() {
    const { dataOffset } = this.state; // TODO: 请移除无用state
    console.log(dataOffset);
    TrackEnterResource();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../components/CommonPageTitle").default,
      });
    });
    bodyScrollTop.set(0);
    const oDiv = document.getElementsByClassName("brand_menu")[0];
    oDiv.addEventListener("touchmove", this.scrollmenu, {
      passive: false,
      bubble: false,
    });
    window.addEventListener("scroll", this.scrollcur, {
      passive: false,
      bubble: false,
    });

    const objclient = document.getElementsByClassName("brand_List");
    const menuList = document.getElementsByClassName("brand_menu_list");
    const dataoffset = [];
    for (let i = 0; i < objclient.length; i++) {
      dataoffset.push({
        name: "brandwall_sort_" + i,
        labname: "brandwall_" + i,
        clientYtop: objclient[i].getBoundingClientRect().top,
        clientYbot: objclient[i].getBoundingClientRect().bottom,
        menuListTop: menuList[i].getBoundingClientRect().top,
        menuListbottom: menuList[i].getBoundingClientRect().bottom,
      });
    }
    if (!this.state.dataoffset) {
      this.setState({
        dataoffset,
      });
    }
  }

  componentWillUnmount() {
    const oDiv = document.getElementsByClassName("brandwall_menu")[0];
    oDiv.removeEventListener("touchmove");
    window.removeEventListener("scroll");
  }

  scrollmenu(event) {
    event.preventDefault();
    const { dataoffset } = this.state;
    const e = event;
    for (let a = 0; a < dataoffset.length; a++) {
      if (
        e.touches[0].clientY >= dataoffset[a].menuListTop &&
        e.touches[0].clientY <= dataoffset[a].menuListbottom
      ) {
        this.setState({
          curId: a,
        });
        let scrollHeight = document.documentElement.scrollHeight;
        let clientHeight = document.documentElement.clientHeight;
        if (scrollHeight - bodyScrollTop.get() - clientHeight < 100) {
          // 当前已在底部,滚动高度超过页面时阻止滚动，兼容ios
          if (scrollHeight - dataoffset[a].clientYtop - clientHeight < 100) {
            return;
          }
        }
        bodyScrollTop.set(dataoffset[a].clientYtop);
      }
    }
  }

  scrollcur(event) {
    event.stopPropagation();
    const { dataoffset } = this.state;
    if (dataoffset && dataoffset.length > 0) {
      for (let a = 0; a < dataoffset.length; a++) {
        if (
          bodyScrollTop.get() >= dataoffset[a].clientYtop - 88 &&
          bodyScrollTop.get() <= dataoffset[a].clientYbot
        ) {
          this.setState({
            curId: a,
          });
        }
      }
    }
  }

  Scorll(i) {
    let scrollHeight = document.documentElement.scrollHeight;
    let clientHeight = document.documentElement.clientHeight;
    const { dataoffset } = this.state;
    this.setState({
      curId: i,
    });
    if (scrollHeight - bodyScrollTop.get() - clientHeight < 100) {
      // 当前已在底部
      if (scrollHeight - dataoffset[i].clientYtop - clientHeight < 100) {
        return;
      }
    }
    bodyScrollTop.set(dataoffset[i].clientYtop - 44);
  }

  render() {
    const { CommonPageTitle, dataoffset, curId } = this.state;
    return (
      <div className="brandWall">
        <CurrentComponentCommonTop />
        {CommonPageTitle && (
          <CommonPageTitle
            _isBack
            _style={{ position: "fixed", zIndex: "4" }}
            _title={"所有品牌"}
          />
        )}
        <BrandComponent
          {...this.props}
          Scorll={(i) => this.Scorll(i)}
          dataoffset={dataoffset}
          curId={curId}
        />
      </div>
    );
  }
}

const mapStateToProps = (s) => {
  return {
    BrandAll: (s.BrandAll && s.BrandAll.results) || [],
    HotBrandAllcon: (s.HotBrandAllcon && s.HotBrandAllcon.results) || [],
  };
};
export default OiaWrap(connect(mapStateToProps, {})(BrandWall));
