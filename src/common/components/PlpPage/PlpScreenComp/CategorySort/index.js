import React from "react";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import Sensor from "@/Utils/sensor";
import CategorySortHeader from "./CategorySortHeader";
import CategorySortBody from "./CategorySortBody";

class CategorySort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSortHeader: true,
    };
    this.starts = this.starts.bind(this);
    this._up = this._up.bind(this);
    this._down = this._down.bind(this);
    this.wheelcon = this.wheelcon.bind(this);
  }

  componentDidMount() {
    Sensor.go("$pageview", {
      page_id: "MB_1000202",
      action_id: "1000202_000"
    });
    window.addEventListener("touchstart", this.starts);
  }

  componentWillUnmount() {
    window.removeEventListener("touchstart", this.starts);
    document.removeEventListener("scroll", this.wheelcon);
  }

  starts(e) {
    if (e.changedTouches[0]) {
      this.start = e.changedTouches[0].clientY;
    } else {
      this.start = bodyScrollTop.get();
    }
    document.addEventListener("scroll", this.wheelcon);
  }

  _up() {
    const { isShowSortHeader } = this.state;
    if (isShowSortHeader) {
      this.setState({
        isShowSortHeader: false,
      });
    }
  }

  _down() {
    const { isShowSortHeader } = this.state;
    if (!isShowSortHeader) {
      this.setState({
        isShowSortHeader: true,
      });
    }
  }

  wheelcon() {
    let that = this;
    if (bodyScrollTop.get() > 50) {
      if (that.start - bodyScrollTop.get() > 0) {
        that._down();
      } else {
        that._up();
      }
      this.start = bodyScrollTop.get();
    }
    if (bodyScrollTop.get() === 0) {
      that._down();
    }
  }

  render() {
    const { sort, products, categorysort, quickData } = this.props;
    const { isShowSortHeader } = this.state;
    return (
      <div className="categorysort_container">
        <CategorySortHeader
          isShowSortHeader={isShowSortHeader}
          sort={sort}
          products={products}
          categorysort={categorysort}
          quickData={quickData}
        />
        <CategorySortBody sort={sort} products={products} categorysort={categorysort} />
      </div>
    );
  }
}

export default CategorySort;
