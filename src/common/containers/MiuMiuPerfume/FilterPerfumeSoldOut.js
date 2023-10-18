/*
 * @Author: summer
 * @Date: 2021-03-Fr 02:02:24
 * @Last Modified by:   summer
 * @Last Modified time: 2021-03-Fr 02:02:24
 */

import React from "react";
import { connect } from "react-redux";
import FilterPerfumeHeader from "../../components/PerfumesDetailsPage/FilterPerfumeHeader";
import isBrowser from "@/Utils/utils/isBrowser";
import PdpSpecialTop from "../../components/PerfumesDetailsPage/PdpSpecialTop";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/filterPerfumeStick.scss");
}
class FilterPerfumeSoldOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let data = {
      logo: "https://ssl1.sephorastatic.cn/html/miumiu/MiuMiu_Logo_2x.png",
      subtitle: "缪缪霓裳时装香水系列",
      slogan: "打造你的时装香",
    };
    return (
      <div className="FilterPerfumeStick-container" style={{ backgroundColor: "#f9e6df" }}>
        <PdpSpecialTop goBack={-2} color={"#f9e6df"} />
        <div className="FilterPerfumeSoldOut">
          <FilterPerfumeHeader _data={data} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {})(FilterPerfumeSoldOut);
