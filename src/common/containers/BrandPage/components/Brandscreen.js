import React, { Component } from "react";
import Brandscreencon from "./Brandscreencon";

class Brandscreen extends Component {
  constructor(props) {
    super(props);
    this.brandsrcoll = this.brandsrcoll.bind(this);
    this.scrollnum = this.scrollnum.bind(this);
    this.scrollend = this.scrollend.bind(this);
    this.state = {
      curnum: 0,
    };
  }
  brandsrcoll(e) {
    let oDiv = document.getElementsByClassName("brand_screen")[0];
    oDiv.addEventListener("touchmove", this.scrollnum.bind(this, e.touches[0].pageX), false);
    oDiv.addEventListener("touchend", this.scrollend, false);
  }
  scrollnum(pagex, e) {
    let oDiv = document.getElementsByClassName("brand_screen")[0];
    let leftnum = e.touches[0].pageX - pagex + this.state.curnum;
    let maxwidth = 750 - oDiv.offsetWidth;
    if (leftnum >= 0) {
      leftnum = 0;
    } else if (leftnum <= maxwidth) {
      leftnum = maxwidth;
    }
    oDiv.style.left = leftnum + "px";
  }
  scrollend() {
    let oDiv = document.getElementsByClassName("brand_screen")[0];
    let leftnum = parseFloat(oDiv.style.left);
    this.setState({
      curnum: leftnum,
    });
  }
  render() {
    let brandcate = [];
    let { Brandpagecon } = this.props;
    let currentWid = "";
    let currentsetwid = "";
    if (Brandpagecon && Brandpagecon.categoryTree) {
      if (Brandpagecon.categoryTree.length < 3) {
        return false;
      }
      brandcate = Brandpagecon.categoryTree.map((el, index) => {
        return <Brandscreencon key={index} obj={el} num={index} />;
      });
      currentWid = Brandpagecon.categoryTree.length * 160 + 20;
      currentsetwid = currentWid >= 750 ? currentWid : 750;
    }

    return (
      <div className="brand_screen" style={{ width: currentsetwid }} onTouchStart={this.brandsrcoll}>
        {brandcate}
      </div>
    );
  }
}

export default Brandscreen;
