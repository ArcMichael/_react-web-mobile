import React from "react";
import QuickScreenHeadSon from "./QuickScreenHeadSon";

export default ({ quickDataNew, QUICKSCREENTAB, categorysort, QuickScreenTab, products, pageType }) => {
  let QuickScreenHeadSonAll = [];
  if (quickDataNew instanceof Array && quickDataNew.length > 0) {
    QuickScreenHeadSonAll = quickDataNew.map((el, index) => {
      return (
        <QuickScreenHeadSon
          data={el}
          key={index}
          tabData={QUICKSCREENTAB}
          categorysort={categorysort}
          QuickScreenTab={QuickScreenTab}
          products={products}
          pageType={pageType}
        />
      );
    });
  }
  return (
    <div className="quickscreen_head top">
      <div
        className="quickscreen_filters_button"
        onClick={() => {
          categorysort(1, "screen", () => categorysort(2, "firstShowScreen"));
        }}
      >
        <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/quickfiltersShadow.png" />
        筛选
        <em />
      </div>
      <div className="quickscreen_hd">{QuickScreenHeadSonAll}</div>
    </div>
  );
};
