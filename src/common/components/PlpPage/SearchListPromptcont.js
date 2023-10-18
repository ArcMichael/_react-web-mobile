import React from "react";

const SearchListPromptcont = props => {
  let { obj, total, index } = props,
    swapwords;
  swapwords = (obj.brandName ? obj.brandName : "") + (obj.categoryName ? obj.categoryName : "");
  return (
    <a href="javascript:;" className="promptPro">
      {swapwords + (index == total - 1 ? "" : " , ")}
    </a>
  );
};

export default SearchListPromptcont;
