import React, { useEffect, useState } from "react";
import { skuList, skuInfo } from "../service/interance";
import { getAttarList, getskuInfo } from "../service";

interface PoupleAttar {
  _productId: string | number;
  _isShow: boolean;
  _skuId: number | null;
  _setIshow: Function;
  _setSkuInfo: Function;
}
const CommentList: React.FunctionComponent<PoupleAttar> = ({
  _productId,
  _isShow,
  _skuId,
  _setIshow,
  _setSkuInfo,
}) => {
  const [skuList, setSkuList] = useState<skuList[]>([]);
  const [skuInfo, setSkuInfo] = useState<skuList | null>(null);
  const [title, setTitle] = useState("");
  const [productInfo, setProductInfo] = useState<skuInfo | null>(null);

  const closeAttar = () => {
    _setIshow(false);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "initial";
    }
  };

  useEffect(() => {
    getList();
    getProductInfo();
  }, []);

  // 获取所有skulist
  const getList = async () => {
    const { results, errorMessage } = await getAttarList(_productId, _skuId);
    if (errorMessage) return false;
    setSkuList(results.saleAttrs);
    setTitle(results.title);
  };

  // 选择sku
  const chooseSku = async (sku: skuList) => {
    setSkuInfo(sku);
    getProductInfo(sku.skuId);
  };

  // 根据商品/sku获取详情,图片
  const getProductInfo = async (skuId?: number) => {
    const { results, errorMessage } = await getskuInfo(_productId, skuId);
    if (errorMessage) return false;
    setProductInfo(results.sku);
  };

  // 重置
  const resetSkuInfo = () => {
    setSkuInfo(null);
  };

  // 确定
  const sumbit = () => {
    closeAttar();
    _setSkuInfo(skuInfo);
  };

  if (!_isShow) {
    return null;
  }
  return (
    <div className="pouple-attar-box">
      <div className="pouple-content">
        <div className="pouple-header">
          <strong>选规格看评价</strong>
          <img
            onClick={closeAttar}
            className="pouple-close-icon"
            src="https://ssl1.sephorastatic.cn/soa/mobile/images/popupCloseIcon_black.png"
          />
        </div>
        {/* 商品信息 */}
        <div className="pouple-good">
          <img
            src={
              skuInfo
                ? productInfo?.defaultImage + "180x180.jpg"
                : "https://ssl1.sephorastatic.cn/wcsfrontend/products/nopic_50x50.jpg"
            }
            alt=""
          />
          <div className="pouple-good-right">
            <strong>{`${productInfo?.productNameEN} ${productInfo?.productNameCN}`}</strong>
            <p>{skuInfo ? "已选 " + skuInfo.value : "请" + title}</p>
          </div>
        </div>
        {/* 商品规格 */}
        <div className="pouple-attar">
          <p>商品规格</p>
          <ul>
            {skuList.map((it) => {
              return (
                <li
                  className={skuInfo && skuInfo.skuId == it.skuId ? "active" : ""}
                  onClick={() => chooseSku(it)}
                >
                  {it.image && <img src={it.image} />}
                  {it.color && <span style={{ color: it.color }} />}
                  {it.value}
                </li>
              );
            })}
          </ul>
        </div>
        {/* 底部按钮 */}
        <div className="pouple-footer">
          <div onClick={resetSkuInfo}>重置</div>
          <div onClick={sumbit}>确定</div>
        </div>
      </div>
    </div>
  );
};

export default CommentList;
