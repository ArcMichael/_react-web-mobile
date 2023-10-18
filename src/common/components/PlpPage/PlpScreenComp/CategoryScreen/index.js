import React, { Component } from "react";
import CategoryStrock from "./CategoryStrock";
import CategoryClassification from "./CategoryClassification";
import CategoryReset from "./CategoryReset";

class CategoryScreenShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushLevel: [], // 数据保存
      selectLevel: [], // 下拉数据保存
      useInventory: false, // 是否选中仅看有货
      resetNum: 0,
      CATEGORY_RESETQUANTITY: null, // 重置数据
      CATEGORYQUANTITY: null,
      minFilterPrice: "", // 筛选最小金额
      maxFilterPrice: "", // 筛选最大金额
    };
    this.initialData = this.initialData.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  changeState(val, type) {
    const { resetNum } = this.state; // TODO: 请移除无用state
    console.log(resetNum);
    this.setState({
      [type]: val,
    });
  }

  initialData() {
    const { products } = this.props;
    let pushLevel = [],
      selectLevel = [],
      allarry = [],
      useInventory = false,
      maxFilterPrice = "",
      minFilterPrice = "";
    if (products) {
      products.facetAttrs.map((el, index) => {
        // 设置初始数据
        el.items.map((obj, i) => {
          let resultlist = {
            onelevel: index,
            twolevel: i,
            name: el.seoIdentifier == "a" ? obj.brandNameCN : obj.valueName,
            change: obj.checked ? true : false,
            seo: obj.seoIdentifier,
            seohd: el.seoIdentifier,
            brandNameEN: obj.brandNameEN,
          };
          allarry.push(resultlist);
        });
        pushLevel.push(allarry);
        allarry = [];

        let resultnext = {
          num: index,
          change: false,
        };
        if (el.seoIdentifier == "a") {
          // 品牌默认展示9个，第一次点击展开后展示24个
          resultnext.quantity = 24;
        }
        selectLevel.push(resultnext);
      });
      if (products.hasInventory != "0") {
        useInventory = true;
      }
      if (products.maxFilterPrice) {
        maxFilterPrice = products.maxFilterPrice;
      }
      if (products.minFilterPrice) {
        minFilterPrice = products.minFilterPrice;
      }
      this.setState({
        pushLevel,
        selectLevel,
        useInventory,
        CATEGORY_RESETQUANTITY: null, // 重置数据
        CATEGORYQUANTITY: null,
        maxFilterPrice,
        minFilterPrice,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.screen !== this.props.screen && !nextProps.screen) {
      // 关闭后数据重置
      this.initialData.call(this);
    }
  }

  componentDidMount() {
    this.initialData();
  }

  render() {
    let { screen, products, url, categorysort, firstShowScreen } = this.props;
    let Cla = "category_conts";
    if (screen) {
      Cla = "category_conts cur";
    }

    return (
      <div className={Cla}>
        <div className="category_conts_strocks">
          <CategoryStrock
            changeState={this.changeState}
            selectLevel={this.state.selectLevel}
            pushLevel={this.state.pushLevel}
            useInventory={this.state.useInventory}
            products={products}
          />
          <CategoryClassification
            CATEGORY_RESETQUANTITY={this.state.CATEGORY_RESETQUANTITY}
            products={products}
            changeState={this.changeState}
            selectLevel={this.state.selectLevel}
            pushLevel={this.state.pushLevel}
            useInventory={this.state.useInventory}
            maxFilterPrice={this.state.maxFilterPrice}
            minFilterPrice={this.state.minFilterPrice}
            firstShowScreen={firstShowScreen}
          />
        </div>
        <CategoryReset
          screen={screen}
          changeState={this.changeState}
          products={products}
          url={url}
          pushLevel={this.state.pushLevel}
          categorysort={categorysort}
          useInventory={this.state.useInventory}
          CATEGORYQUANTITY={this.state.CATEGORYQUANTITY}
          minFilterPrice={this.state.minFilterPrice}
          maxFilterPrice={this.state.maxFilterPrice}
        />
      </div>
    );
  }
}

export default CategoryScreenShow;
