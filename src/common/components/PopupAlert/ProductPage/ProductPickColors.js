/*
 * @Author: Leo.Si
 * @Date: 2020-07-13 11:06:49
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-09-23 13:48:51
 * @function product 页面选择色号的功能
 */

import React from "react";
import $ from "jquery";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import { popupAlert } from "../../../actions/popup";

class ProductPickColors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectSkuId: this.props._skuId,
      selectLastSkuId: this.props._skuId,
      hasInventory: this.props._skuId,
      itemNow: this.props._nowItem,
      selectedHasInventory: this.props._hasInventory,
      screenColors: false,
      screenColorsData: "",
      screenColorsSelected: {
        colors: "",
        materials: "",
      },
      isSameSkuId: false,
    };
    this.closePopup = this.closePopup.bind(this);
    this.clickSure = this.clickSure.bind(this);
    this.sceenColor = this.sceenColor.bind(this);
  }

  componentDidMount() {}
  /*
   * 自动关闭
   */
  closePopup() {
    const { popupAlert } = this.props;
    popupAlert(0, "ProductPickColors");
    setTimeout(() => {
      let scrollTop = parseFloat($(".product-page").css("bottom"));
      bodyScrollTop.set(scrollTop);
      $(".product-page").css({ bottom: 0 });
    }, 0);
  }

  clickSure() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback(this.state.hasInventory);
    this.closePopup();
  }
  //筛选功能
  sceenColor(_data) {
    if (!_data) {
      return this.setState({
        screenColors: false,
      });
    }
    const { _screenColorFun } = this.props;
    _screenColorFun &&
      _screenColorFun((callback) => {
        this.setState({
          screenColors: true,
          screenColorsData: callback,
        });
      });
  }
  //  切换色卡列表
  changePic(_skuId, _inventory, _index) {
    const { hasInventory } = this.state;
    const { _data } = this.props;
    this.setState({
      selectSkuId: _skuId,
      selectLastSkuId: _inventory <= 0 ? hasInventory : _skuId,
      isSameSkuId:
        _skuId === this.state.selectSkuId ? !this.state.isSameSkuId : false,
    });
    if (_inventory > 0) {
      this.setState({
        hasInventory: _skuId,
        itemNow:
          _data.prodColorSpecDtoList && _data.prodColorSpecDtoList[_index],
        selectedHasInventory: true,
      });
    }
  }
  // 渲染色卡列表
  renderItem(data) {
    const { prodColorSpecDtoList } = data;
    const { selectSkuId, selectLastSkuId, isSameSkuId } = this.state;
    if (prodColorSpecDtoList && prodColorSpecDtoList.length === 0) {
      return (
        <div className="no-color-pic-tab">
          <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/no-result.png" />
          <span>抱歉,没有找到商品</span>
        </div>
      );
    }
    return (
      prodColorSpecDtoList &&
      prodColorSpecDtoList.length > 0 &&
      prodColorSpecDtoList.map((item, index) => {
        const {
          colorMaterial,
          colorMaterialImg,
          colorValue,
          inventory,
          isHot,
          name,
          skuId,
        } = item;
        let backgroundColorArr = {
            backgroundColor: colorValue,
          },
          backgroundImageArr = {
            backgroundImage: "url(" + colorMaterialImg + ")",
            backgroundColor: colorValue,
            backgroundSize: "cover",
          };
        return (
          <div
            className={`color-list ${
              selectSkuId === skuId && (isSameSkuId ? "" : "color-list-new")
            }`}
            style={
              selectSkuId === skuId
                ? isSameSkuId
                  ? backgroundColorArr
                  : backgroundImageArr
                : backgroundColorArr
            }
            key={`tab-detail-${index}`}
            onClick={this.changePic.bind(this, skuId, inventory, index)}
          >
            <div className="mac-name">
              {name}&nbsp;&nbsp;{colorMaterial}
            </div>
            {isHot == "1" ? (
              <img
                className="hot-product"
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/hot.png"
              />
            ) : null}
            {inventory <= 0 ? (
              <div className="mac-name  guideColor">已售罄</div>
            ) : null}
            {inventory > 0 && selectLastSkuId === skuId ? (
              <img
                className="haveChoosen"
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/have-select.png"
              />
            ) : null}
          </div>
        );
      })
    );
  }
  // 存储色卡筛选列表选中的值
  screenColorSelected(type, index, item) {
    let newObj = this.state.screenColorsSelected;
    newObj[type] = {};
    newObj[type]["index"] = index;
    newObj[type]["item"] = item;
    if (type == "all") newObj = {};
    this.setState({
      screenColorsSelected: newObj,
    });
    const { _pickColorsFun } = this.props;
    _pickColorsFun &&
      _pickColorsFun({
        colorMaterial:
          (newObj && newObj.materials && newObj.materials.item) || "",
        colorValue: (newObj && newObj.colors && newObj.colors.item) || "",
      });
  }
  // 渲染色卡筛选列表
  renderScreenColors(_data, _count) {
    const { colors, materials } = _data;
    const { screenColorsSelected } = this.state;
    return (
      <div className="sceen-colors-contnet-item">
        <div className="color-kind-item">
          <p>
            <a>色系</a>
            <a className="color-selected">
              {screenColorsSelected &&
                screenColorsSelected.colors &&
                screenColorsSelected.colors.item}
            </a>
          </p>
          {colors &&
            colors.length > 0 &&
            colors.map((item, index) => {
              return (
                <span
                  className={`${
                    screenColorsSelected &&
                    screenColorsSelected.colors &&
                    screenColorsSelected.colors.index === index &&
                    "screen-selected"
                  }  screen-item`}
                  onClick={this.screenColorSelected.bind(
                    this,
                    "colors",
                    index,
                    item
                  )}
                  key={`color-kind-item-color-${index}`}
                >
                  {item}
                </span>
              );
            })}
        </div>
        <div className="color-kind-item quantity-kind-item">
          <p>
            <a>质地</a>
            <a className="materials-selected">
              {screenColorsSelected &&
                screenColorsSelected.materials &&
                screenColorsSelected.materials.item}
            </a>
          </p>
          {materials &&
            materials.length > 0 &&
            materials.map((item, index) => {
              return (
                <span
                  className={`${
                    screenColorsSelected &&
                    screenColorsSelected.materials &&
                    screenColorsSelected.materials.index === index &&
                    "screen-selected"
                  } screen-item`}
                  onClick={this.screenColorSelected.bind(
                    this,
                    "materials",
                    index,
                    item
                  )}
                  key={`color-kind-item-materials-${index}`}
                >
                  {item}
                </span>
              );
            })}
        </div>
        <div className="sceen-colors-buttom">
          <button onClick={this.screenColorSelected.bind(this, "all", "", "")}>
            重置
          </button>
          <button
            onClick={this.sceenColor.bind(this, false)}
          >{`确定(${_count})`}</button>
        </div>
      </div>
    );
  }
  render() {
    const { _zIndex, _data, _skuId } = this.props;
    const { selectedHasInventory, itemNow, screenColors, screenColorsData } =
      this.state;
    return (
      <div className="popup-mgm-popup-module" style={{ zIndex: _zIndex }}>
        <div className="popup-mgm-popup-module-pick-colors">
          <div className="popup-mgm-popup-module-pick-colors-title">
            <img
              onClick={this.closePopup}
              src="https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png"
            />
            <p>选择颜色</p>
            <span onClick={this.sceenColor}>筛选</span>
          </div>
          <div className="tab-content">
            <div
              className={`tab-detail ${
                selectedHasInventory && itemNow && "tab-detail-more-padding"
              }`}
            >
              {this.renderItem(_data, _skuId)}
            </div>
            {selectedHasInventory && itemNow && (
              <div className="color-select-bottom">
                <div
                  className="buy-color"
                  style={{ backgroundColor: itemNow.colorValue }}
                 />
                <div className="buy-color-name">
                  <span>已选: </span>
                  <span>{itemNow.name + " " + itemNow.colorMaterial}</span>
                </div>
                <a className="btn-pay" onClick={this.clickSure}>
                  确定
                </a>
              </div>
            )}
          </div>
          {screenColors && screenColorsData && (
            <div className="sceen-colors-bg">
              <div
                className="sceen-colors-contnet-left"
                onClick={this.sceenColor.bind(this, false)}
              />
              <div className="sceen-colors-contnet">
                {this.renderScreenColors(screenColorsData, _data.count)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

ProductPickColors.defaultProps = {
  _ox: false,
  _text: "",
  _className: "",
  _zIndex: 203,
  _autoClose: false,
  _totalCount: 2000,
  _title: "",
  _data: "",
  _skuId: "",
  _hasInventory: false,
  _screenColorFun: "",
  _pickColorsFun: "",
  _nowItem: "",
};

ProductPickColors.propTypes = {
  _closeCallback: PropTypes.func,
};

const mapStateToPrps = (state) => {
  const { popup_component } = state;
  let POPUP_ALERT_PARAMETERS = {};
  if (popup_component) {
    POPUP_ALERT_PARAMETERS = popup_component.POPUP_ALERT_PARAMETERS;
  }
  return Object.assign({}, POPUP_ALERT_PARAMETERS);
};

export default connect(mapStateToPrps, {
  popupAlert,
})(ProductPickColors);
