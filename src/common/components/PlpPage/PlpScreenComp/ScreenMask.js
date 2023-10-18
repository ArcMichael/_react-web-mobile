import React from "react";

export default ({ quickScreen, sort, screen, clearPopup }) => {
  let isShowMask = quickScreen || sort || screen;
  return <div className={`plppage_mask ${isShowMask ? "show" : ""} ${screen ? "z5" : ""}`} onClick={clearPopup} />;
};
