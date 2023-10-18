import React, { useEffect, useState } from "react";
import "./style/index.scss";
import LineTag from "@/components/Comment/line-tag";
import { urlGetParams } from "@/lib/url";
import CommentList from "./components/CommentList";
import PoupleAttar from "./components/PoupleAttar";
import { skuList, labelDto } from "./service/interance";
import { getSkuScoreList } from "./service";

const style = {
  width: "60px",
  height: "8px",
};

interface ICommentNew {}
const CommentNew: React.FunctionComponent<ICommentNew> = () => {
  const [isShow, setIshow] = useState(false);
  const [skuInfo, setSkuInfo] = useState<skuList | null>(null);
  const [productScore, setProductScore] = useState(0);
  const [labelList, setLabelList] = useState<labelDto[]>([]);
  const calcScore = (score: number) => {
    let obj = {};
    if (score > 0) {
      obj = { width: 60 * (score / 5) - 3 + "px" };
    }
    return obj;
  };

  const changeAttar = () => {
    setIshow(true);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    getScoreList();
  }, [skuInfo]);

  const getScoreList = async () => {
    const productId = urlGetParams(window.location, "id") || 0;
    const { results, errorMessage } = await getSkuScoreList(
      productId,
      skuInfo ? skuInfo.skuId : null,
    );
    if (errorMessage) return false;
    setLabelList(results || []);
  };

  return (
    <div>
      <div className="comment-top">
        <div className="star-box">
          <span style={style} className="product-evaluate-praise-grade-img">
            <div style={calcScore(productScore)}>
              <span style={style} />
            </div>
          </span>
          <div className="star-text">
            <span className="now-num">{productScore}</span>
            <span className="star-num">/5分</span>
          </div>
        </div>
        <div className="line-tag-box">
          <div>
            <LineTag _labelList={labelList} />
          </div>
        </div>
      </div>
      <div className="choose-specs">
        <div className="specs-box" onClick={changeAttar}>
          <div className="specs-title">{skuInfo ? "已选 " + skuInfo.value : "选规格"}</div>
          <img
            className="specs-more"
            src="https://sslstage1.sephorastatic.cn/soa/mobile/images/more.png"
          />
        </div>
      </div>
      <CommentList
        _productId={urlGetParams(window.location, "id") || 0}
        _skuId={skuInfo ? skuInfo.skuId : skuInfo}
        _setProductScore={setProductScore}
      />
      <PoupleAttar
        _isShow={isShow}
        _skuId={skuInfo ? skuInfo.skuId : skuInfo}
        _setIshow={setIshow}
        _setSkuInfo={setSkuInfo}
        _productId={urlGetParams(window.location, "id") || 0}
      />
    </div>
  );
};

export default CommentNew;
