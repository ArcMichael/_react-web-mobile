import React, { Component } from "react";
import BrandTwoClassCont from "./BrandTwoClassCont";
import BrandTwoMore from "./BrandTwoMore";

class BrandTwoClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TWOCLASSMORES: false,
    };
    this.toogleTwoClass = this.toogleTwoClass.bind(this);
  }

  toogleTwoClass() {
    const { TWOCLASSMORES } = this.state;
    this.setState({
      TWOCLASSMORES: !TWOCLASSMORES,
    });
  }

  render() {
    const { TWOCLASSMORES } = this.state;
    let { brandresult } = this.props,
      twoclassList = [],
      twoShow = "none",
      copyArry = [],
      twoClass = "brand_twoclass",
      twoClassShow = "brand_twoclass_show";
    if (brandresult && brandresult.categoryTree) {
      brandresult.categoryTree.map((el) => {
        copyArry = JSON.parse(JSON.stringify(el.childFacetCategories));
        copyArry.map((object, k) => {
          if (object.categoryId == brandresult.rootCategoryId) {
            copyArry.splice(k, 1);
            copyArry.unshift(object);
          }
        });
        copyArry.unshift({
          categoryId: el.categoryId,
          categoryName: "全部",
        });
        if (brandresult.rootCategoryId == el.categoryId) {
          twoShow = "block";
          twoclassList = copyArry.map((obj, num) => {
            return <BrandTwoClassCont obj={obj} key={num} categoryid={brandresult.rootCategoryId} />;
          });
        } else {
          copyArry.map((obj) => {
            if (obj.categoryId == brandresult.rootCategoryId) {
              twoclassList = copyArry.map((con, i) => {
                return <BrandTwoClassCont obj={con} key={i} categoryid={brandresult.rootCategoryId} />;
              });
              twoShow = "block";
            }
          });
        }
      });
    }
    if (TWOCLASSMORES) {
      twoClass = "brand_twoclass cur";
      twoClassShow = "brand_twoclass_show_cur";
    }
    return (
      <div>
        <div className="brand_twoclass_hd" style={{ display: twoShow }}>
          <div className={twoClass}>
            <div className={twoClassShow}>{twoclassList}</div>
            <BrandTwoMore TWOCLASSMORES={TWOCLASSMORES} toogleTwoClass={this.toogleTwoClass} />
          </div>
        </div>
        <div
          className="brand_twoclass_fix"
          style={TWOCLASSMORES ? { display: "block" } : { display: "none" }}
          onClick={this.toogleTwoClass}
         />
      </div>
    );
  }
}

export default BrandTwoClass;
