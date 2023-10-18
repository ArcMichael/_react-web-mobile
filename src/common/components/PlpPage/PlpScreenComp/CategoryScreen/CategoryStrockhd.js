import React, { Component } from "react";
import browserHistory from "@/store/browserHistory";
import CategoryStrockList from "./CategoryStrockList";
import FilterPriceInput from "./FilterPriceInput";

class CategoryStrockhd extends Component {
  constructor(props) {
    super(props);
    this.nextshow = this.nextshow.bind(this);
    this.checkMore = this.checkMore.bind(this);
    this.state = {
      Brand: null,
    };
  }

  nextshow() {
    let { _index, selectLevel, changeState } = this.props;
    console.log("_index", _index, selectLevel);
    let newSelectLevel = selectLevel.map((el, index) => {
      if (index == _index) {
        el.change = !el.change;
        if (el.quantity) {
          // 品牌收起时，需初始化
          el.quantity = 24;
        }
      }
      return el;
    });
    changeState(newSelectLevel, "selectLevel");
  }

  componentDidMount() {
    this.setState({
      Brand: browserHistory.getCurrentLocation().pathname.split("/")[1],
    });
  }

  checkMore() {
    let { _index, selectLevel, changeState } = this.props;
    let newSelectLevel = selectLevel.map((el, index) => {
      if (index == _index) {
        el.quantity = el.quantity + 24;
      }
      return el;
    });
    changeState(newSelectLevel, "selectLevel");
  }

  render() {
    let {
      obj,
      _index,
      type,
      selectLevel,
      pushLevel,
      useInventory,
      products,
      changeState,
      maxFilterPrice,
      minFilterPrice,
    } = this.props;
    let stocklist = [];
    let nextshow = "block";
    let changecon = false;
    let checkcont = "";
    let dropdown = "";
    if (type == "strock") {
      nextshow = "none";
    }
    if (obj.seoIdentifier == "a") {
      if (this.state.Brand == "brand") {
        return false;
      }
      if (obj.items.length <= 9) {
        nextshow = "none";
      }
    }
    if (this.state.Brand == "brand") {
      if (obj.seoIdentifier == "a") {
        return false;
      }
    }

    if (obj.items) {
      stocklist = obj.items.map((el, index) => {
        if (selectLevel) {
          if (selectLevel.length) {
            if (!selectLevel[_index].change) {
              if (obj.seoIdentifier === "a" || type === "strock") {
                if (index > 8) {
                  // 品牌筛选默认展示9个,仅看有货一直展示
                  return;
                }
              } else {
                return;
              }
            } else {
              dropdown = "dropcur";
              if (obj.items.length > selectLevel[_index].quantity && obj.seoIdentifier === "a") {
                if (index + 1 > selectLevel[_index].quantity) return; // 超过可显示数量
                if (index + 1 === selectLevel[_index].quantity) {
                  return (
                    <label onClick={this.checkMore} className="checkmore" key="checkmore">
                      <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/search_results_more.png" alt="" />
                      <span>查看更多</span>
                    </label>
                  );
                }
              }
            }
          }
        }

        return (
          <CategoryStrockList
            key={index}
            classtype={type}
            seotype={obj.seoIdentifier}
            changenum={pushLevel[_index]}
            type={_index}
            obj={el}
            _index={index}
            products={products}
            changeState={changeState}
            useInventory={useInventory}
            pushLevel={pushLevel}
            maxFilterPrice={maxFilterPrice}
            minFilterPrice={minFilterPrice}
          />
        );
      });
    }
    if (type == "strock") {
      if (useInventory) {
        checkcont = "仅看有货";
      }
    } else if (obj.seoIdentifier != "c") {
      if (pushLevel.length) {
        pushLevel[_index].map((el) => {
          if (el.change) {
            if (changecon) {
              checkcont += "、";
            } else {
              changecon = true;
            }
            checkcont += el.name;
          }
        });
      }
    }
    return (
      <div>
        <div className="category_strockhd">
          <span>
            <label>{obj.name === "价格" ? "价格区间" : obj.name}</label>
            {checkcont ? <span>（</span> : ""}
            <span>{checkcont}</span>
          </span>
          {checkcont ? <span>）</span> : ""}
          <em style={{ display: nextshow }} className={dropdown} onClick={this.nextshow} />
        </div>
        <div className="category_strocklist">
          {obj.seoIdentifier === "c" ? (
            <FilterPriceInput
              products={products}
              pushLevel={pushLevel}
              useInventory={useInventory}
              changeState={changeState}
              maxFilterPrice={maxFilterPrice}
              minFilterPrice={minFilterPrice}
              _index={_index}
            />
          ) : null}
          {stocklist}
        </div>
      </div>
    );
  }
}

export default CategoryStrockhd;
