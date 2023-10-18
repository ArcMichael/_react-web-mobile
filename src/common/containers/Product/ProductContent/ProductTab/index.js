/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 10:25:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-25 22:15:28
 * @function PDP页面顶部切换按钮(商品、详情、评价)
 */
import React from "react";
import BottomMenus from "@/components/BottomMenus";
import * as url from "@/lib/url";
const Tab = ["商品","品牌", "详情", "推荐"];

const ProductTab = ({ _callback,_callbackMore, _productData, tabIndex }) => {

  return (
    <div className="product-tab" style={{borderBottom: _productData.tabIndex===4 ? "1px solid #ddd" : "none"}}>
      <img
        className="product-tab-back"
        src="https://ssl1.sephorastatic.cn/soa/nmobile/img/nichefragrance/icon/shape.png"
        onClick={() => {
          if(_productData.tabIndex===4){
            return  _callback(0)
          }
          let isSearchFrom=url.urlGetParams(window.location,"isSearchFrom")
          let urlF=url.urlGetParams(window.location, "searchF")
          urlF= urlF && urlF.replace("~","=")
          if (isSearchFrom) {
            sessionStorage.setItem("keywords",isSearchFrom)
          }
          if (urlF) {
            window.location.replace(urlF)
          }else{
            window.history.go(-1);
          window.location.replace(document.referrer)
          }
        }}
      />
      {
        _productData.tabIndex!==4 &&<ul 
          className="product-tab-ul" 
          style={{
            width: `${Tab.length == 4 ? '4rem' : '3rem'}`, 
            marginLeft: `${Tab.length === 4 ? '-2rem' : '-1.5rem'}`,
            display: `${tabIndex === 0 ? 'none' : 'flex'}`,
          }}>
          {Tab.map((item, index) => {
            return (
              <li
                className={Number(tabIndex) === index ? "active" : ""}
                key={`product-tab-li-${index}`}
                // onClick={_callback.bind(this, "tabClickfun", { _mySwiper, nowIndex: index })}
                onClick={_callback.bind(this, index )}
              >
                {item}
              </li>
            );
          })}
        </ul>
      }
      <span className="product-tab-more" onClick={_callbackMore.bind(this, "tabMoreClickfun", !_productData.tabMore)}>
        ...
      </span>
      {_productData.tabMore && (
        <div className="product-common-tabbar" style={{ width: "100%" }}>
          <BottomMenus disableToTop />
        </div>
      )}
    </div>
  );
};
export default ProductTab;
