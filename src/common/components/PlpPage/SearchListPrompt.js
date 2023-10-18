import React from "react";
import SearchListPromptcont from "./SearchListPromptcont";

const SearchListPrompt = props => {
  let searchlist = [],
    { products } = props;
  if (products.notFoundKeyWord) {
    return (
      <div className="searchlistPrompt">
        抱歉，未找到
        <a href="javascript:;" className="promptPro">
          {" "}
          {products.notFoundKeyWord}{" "}
        </a>
        ，为您推荐以下商品
      </div>
    );
  }

  if (products.swapWords) {
    searchlist = products.swapWords.map((el, index) => {
      if (index > 9) return false;
      return <SearchListPromptcont obj={el} index={index} key={index} total={products.swapWords.length} />;
    });
    return (
      <div className="searchlistPrompt">
        对不起，暂时没有您想要的品牌，我们为您推荐
        {searchlist}
        {searchlist.length}个相关品牌的产品。
      </div>
    );
  }
};

export default SearchListPrompt;
