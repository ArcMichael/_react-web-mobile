import React from "react";
import SearchListPromptcont from "./SearchListPromptcont";

const SearchListPrompt = ({ products }) => {
  let p1 = "",
    keyWord = "",
    p2 = "",
    p3 = "",
    cont = [];
  if (products.notFoundKeyWord) {
    p1 = "未找到商品，为您推荐";
    p2 = "的搜索结果";
    p3 = "或者试试：";
    keyWord = products.notFoundKeyWord;
  }
  if (products.swapWords) {
    p1 = "以下是";
    p2 = "的搜索结果";
    p3 = "您是不是想找：";
    products.notFoundKeyWord;
    cont = products.swapWords;
  }
  return (
    <div className="search-list-prompt">
      <p>
        <span>{p1}</span>
        <span className="search-list-prompt-keyword">“{keyWord}”</span>
        <span>{p2}</span>
      </p>
      <p>
        <span>{p3}</span>
        {cont.map((data, index) => {
          if (index > 9) return;
          return <SearchListPromptcont obj={data} index={index} key={index} total={cont.length} />;
        })}
      </p>
    </div>
  );
};

export default SearchListPrompt;
