import React from "react";
import ScrollAjaxHoc from "@/components/ScrollAjaxHoc";
import ProductSerivce from "@/lib/services/Product";
import ProductCommentList from "@/containers/ProductCommentNew/components/CommentList";
import "@/containers/ProductCommentNew/style/commentList.scss";

/*
 * @Author: Leo.Si
 * @Date: 2020-07-22 16:35:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-21 09:51:13
 * @function product-info 商品评论展示模块
 */

/** @typedef {import('@/lib/services/Product').GetProductCommentResp} GetProductCommentResp GetProductCommentResp **/
/** @typedef {import('@/components/ScrollAjaxHoc').ScrollAjaxInjectProps} ScrollAjaxInjectProps ScrollAjaxInjectProps **/

/**
 * @typedef {{
 *  productId:number;
 *  _commentList: any;
 *  _callback:any;
 *  _mySwiper:any;
 *  __InjectData__: GetProductCommentResp;
 * }} ProductCommentProps
 * */

/**
 * @param {ProductCommentProps} props
 * @returns
 */
const ProductComment = (props) => {
  const { _commentList, productId } = props;
  const data = _commentList;

  const style = {
    width: "70px",
    height: "12px",
  };
  let widthStyle =
    data && data.productScore > 0
      ? {
          width: 70 * (data.productScore / 5) + "px",
        }
      : {};
  return data ? (
    <div className="product-info-comment">
      <div
        className="product-info-comment-title"
        onClick={() => {
          if (data.totalRecord > 0) {
            window.location.href = "/v2/html/ProductCommentNew?id=" + productId;
          }
        }}
      >
        <p>
          评价<span>{data.totalRecord > 0 && data.totalRecord}</span>
        </p>
        {data.totalRecord > 0 ? (
          <div />
        ) : (
          <div className="product-info-no-comment">此商品暂时还没有评价</div>
        )}
        {data && data.totalRecord > 0 && data.productScore > 0 && (
          <span style={style} className="product-evaluate-praise-grade-img">
            <div style={widthStyle}>
              <span style={style} />
            </div>
          </span>
        )}
        {data && data.totalRecord > 0 && _commentList.productScore > 0 && (
          <span className="product-evaluate-praise-grade">{`${data.productScore}/5分`}</span>
        )}
        <img
          className="product-comment-arrow"
          src="https://ssl1.sephorastatic.cn/soa/mobile/images/pdp/popup-arrow.png"
        />
      </div>
      <ProductCommentList _productId={productId} _skuId={null} _product={true} />
    </div>
  ) : null;
};

export default ScrollAjaxHoc(ProductComment, {
  triggerAt: "SecondScreen",
  triggerAction: (props) => {
    const { productId, _mySwiper } = props;
    return new Promise((resolve) => {
      if (productId && _mySwiper.activeIndex === 0) {
        ProductSerivce.Product.getProductCommentList({
          productId,
          pageSize: 10,
          pageNo: 1,
        }).then((res) => {
          resolve(res);
        });
      } else {
        resolve(null);
      }
    });
  },
});
