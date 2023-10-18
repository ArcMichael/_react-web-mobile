/*
 * @Author: Martin.song
 * @LastEditors: Martin.song
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-12-21 16:12:12
 * @LastEditTime: 2021-02-23 16:07:31
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import Image from "../components/ImagesLazyLoad/index";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/RewardsBoutiqueStore.scss");
}
class Limit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <div className="error-page">
        <div className="error-page-404">
          <div className="error-image">
            <Image src="https://ssl1.sephorastatic.cn/soa/nmobile/img/updating_mob_750.jpg" />
            {/*<img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/updating_mob_750.jpg" />*/}
            <div />
          </div>
          {/* <p className="error-title">积分商城更新中</p> */}
          <p>敬请期待</p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {})(Limit);
