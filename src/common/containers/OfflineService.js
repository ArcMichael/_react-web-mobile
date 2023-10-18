/*
 * @Author: leo.si
 * @Date: 2019-06-17 16:04:53
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-10-10 11:32:20
 * @function 线下服务
 */
import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import CommonPageTitle from "../components/CommonPageTitle/index";
import * as device from "../lib/device";
import { getOfflineService } from "../actions/currentLimiting";
import LazyloadImage from "@/components/LazyloadImage";

if (__DEV__ && isBrowser()) {
  require("../../public/style/default.scss");
  require("../../public/style/OfflineService.scss");
}
class OfflineService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineService: null,
    };
  }
  componentDidMount() {
    this.props.getOfflineService((callback) => {
      this.setState({
        offlineService: callback || null,
      });
    });
  }
  render() {
    const { offlineService } = this.state;
    const { seo } = this.props;
    return (
      <div>
        <div id="apptitle">{seo && seo.results && seo.results.title}</div>
        {isBrowser() && !device.isApp() ? (
          <CommonPageTitle _isBack={true} _title="线下服务" />
        ) : null}
        <ul className="offline-page-ul">
          {offlineService &&
            offlineService.map((item, index) => (
              <li key={`offline-page-ul-li-${index}`}>
                <a href={item && item.jumpUrl}>
                  {/* <img src={item && item.imagePath} /> */}
                  <LazyloadImage
                     imgProps={{
                       src: item && item.imagePath,
                     }}
                    />
                </a>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (s) => {
  return {
    seo: s.seo,
  };
};
export default connect(mapStateToProps, {
  getOfflineService,
})(OfflineService);
