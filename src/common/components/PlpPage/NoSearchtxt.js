import React from "react";
import { judgeTypeOfPlp } from "@/lib/Tools";

export default function NoSearchTxt() {
  if (judgeTypeOfPlp === "vaproductlist") {
    // 该页面S8不添加
    return (
      <div className="nosearchtxt">
        <p />
        <label>列表无结果</label>
      </div>
    );
  }
  if (judgeTypeOfPlp === "purchaserecordcon") {
    // 该页面S8不添加
    return (
      <div className="nosearchtxt">
        <p />
        <label>您一个月内没有领用过赠品，或这些商品已不再销售。</label>
      </div>
    );
  }
  return (
    <div className="nosearchtxt">
      <p>
        <span />
      </p>
      <label>搜索无结果，您可以重新搜索！</label>
    </div>
  );
}
