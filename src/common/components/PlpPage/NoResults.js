import React from "react";
import { judgeTypeOfPlp } from "@/lib/Tools";
import GuessYouLike from "./GuessYouLike";
import Nosearchtxt from "./NoSearchtxt";

export default function Noresults({ products }) {
  if (judgeTypeOfPlp() === "search" || judgeTypeOfPlp() === "purchaserecord") {
    if (products && !products.content) {
      // 页面未获得请求的默认展示
      return false;
    }
    if (products && products.content && products.content.length > 0) return false;
  } else if (products) return false;
  return (
    <div className="searchresult_GuessYouLike">
      {/* 搜索列表为空状态组件 */}
      <Nosearchtxt />
      {/* 猜你喜欢 */}
      {judgeTypeOfPlp() !== "purchaserecordcon" && (
        <GuessYouLike
          _title="为你推荐"
          type="search"
          listTitle="商品列表:"
          listType="Guess You Like_Search"
        />
      )}
    </div>
  );
}
