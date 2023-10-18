import React from "react";
export default ({ categorysort }) => {
  return (
    <div className="quickscreen_container">
      <div className="quickscreen">
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
          <div className="quickscreen_hd">
            <a style={{ height: "0.54rem" }} />
          </div>
        </div>
      </div>
    </div>
  );
};
