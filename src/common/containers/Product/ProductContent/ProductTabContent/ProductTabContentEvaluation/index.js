/*
 * @Author: Leo.Si
 * @Date: 2020-07-02 15:54:08
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-25 22:29:15
 * @function 展示商品的评价信息
 */
import React from "react";
import ProductServices from "@/lib/services/Product";
// import bodyScrollTop from "@/Utils/utils/bodyScrollTop";

/**
 * @typedef {{
 *  isActive:boolean;
 *  productId:number;
 *  swiper?:any;
 * }} ProductTabContentEvaluationProps
 * */

/** @typedef {import('@/lib/services/Product').GetProductCommentListParams} GetProductCommentListParams */
/** @typedef {import('@/lib/services/Product').GetProductCommentResp} GetProductCommentResp */

/**
 * @typedef {{
 *  params: GetProductCommentListParams;
 *  data: GetProductCommentResp['results'] | null;
 * }} ProductTabContentEvaluationState
 * */

/**
 * @extends {React.Component<ProductTabContentEvaluationProps,ProductTabContentEvaluationState>}
 */
class ProductTabContentEvaluation extends React.Component {
  constructor(props) {
    super(props);
    /** @type {ProductTabContentEvaluationState} - description */
    this.state = {
      params: {
        pageNo: 1,
        pageSize: 10,
      },
      data: null,
      hasNext: true,
      laoding: false
    };
    this.getComments = this.getComments.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillUnmount() {
    window.document.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    if(this.state.laoding) return
    if(this.state.hasNext ==false) return
    // console.log(this.props.isActive)
    // if (
      // window.document.getElementById("ProductTabContentEvaluation").scrollHeight - ) {
      if (this.state.data && this.state.data.hasNext) {
        this.setState(
          {
            params: {
              ...this.state.params,
              pageNo: this.state.params.pageNo + 1,
            },
            laoding:true
          },
          () => {
            this.getComments();
          },
        );
      }
    // }
    // console.log("111")
  }

  /**
   * @param {ProductTabContentEvaluationProps} prevProps
   * @param {ProductTabContentEvaluationState} prevState
   */
  componentDidMount() {
    this.getComments();
    // const { isActive } = prevProps;
    // if (this.props.isActive !== isActive) {

    //   console.log("index == 4",prevProps)
    //   if (this.props.isActive) {
      window.document.addEventListener("scroll", this.handleScroll);
    //   } else {
    //     window.document.removeEventListener("scroll", this.handleScroll);
    //   }
    // }

    // if (isActive !== this.props.isActive && this.props.isActive && !this.state.data) {
    //   this.getComments();
    // }
  }

  getComments() {
    const { data } = this.state;
    ProductServices.Product.getProductCommentList({
      ...this.state.params,
      productId: this.props.productId,
    }).then((res) => {
      this.setState(
        {
          data: data
            ? {
                ...res.results,
                commentDtos: (data.commentDtos || []).concat(res.results.commentDtos),
              }
            : res.results,
          laoding:false,
          hasNext:res.results.hasNext,
        },
        () => {
          this.props.setCommentList(this.state.data)
          if (this.props.swiper) {
            this.props.swiper.update();
          }
        },
      );
    });
  }

  render() {
    // const { _view } = this.props;
    const { data } = this.state;

    if (data && data.commentDtos && data.commentDtos.length == 0) {
      return (
        <div className="no-product-evaluate" style={{ height: `100vh` }}>
          <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/pingjia.png" />
          <span>此商品暂时还没有评价哦~</span>
        </div>
      );
    }
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
    let photoUrlReg = new RegExp(/^https:\/\/ssl/);
    let photoUrlEndReg = new RegExp(/jpg|png|gif$/);
    return (
      <div className="product-evaluate">
        <div className="product-evaluate-praise">
          <span className="product-evaluate-praise-title">好评度</span>
          {data && data.productScore > 0 && (
            <span className="product-evaluate-praise-grade">{`${data.productScore}分`}</span>
          )}
          {data && data.productScore > 0 && (
            <span style={style} className="product-evaluate-praise-grade-img">
              <div style={widthStyle}>
                <span style={style} />
              </div>
            </span>
          )}
        </div>
        <ul className="product-evaluate-commentlist">
          {data &&
            data.commentDtos &&
            data.commentDtos.length > 0 &&
            data.commentDtos.map((item, index) => {
              const { photo, nickName, cardType, isEssenceComment, content, createTime, replyDto } =
                item;
              let photoUrl = photo;
              if (photoUrlReg.test(photo) && !photoUrlEndReg.test(photo)) {
                photoUrl = photo + "S.jpg";
              }
              return (
                <li key={`product-evaluate-commentlist-${index}`}>
                  <div className="product-evaluate-commentlist-top">
                    <img src={photoUrl || "/soa/images/productsDetailsPage/head.png"} />
                    <span>{nickName}</span>
                    <em className={cardType} />
                    {isEssenceComment && isEssenceComment === 1 ? <p>精华评论</p> : ""}
                  </div>
                  <div className="product-evaluate-commentlist-content">{content}</div>
                  {replyDto && (
                    <div className="product-evaluate-commentlist-reply">
                      <div className="product-evaluate-commentlist-reply-triangle" />
                      <p className="product-evaluate-commentlist-reply-head">
                        <img src={replyDto.avatarUrl || ""} />
                        <span>{replyDto.nickName} 回复：</span>
                      </p>
                      <div className="product-evaluate-commentlist-reply-content">
                        {replyDto.content}
                      </div>
                    </div>
                  )}
                  <div className="product-evaluate-commentlist-createTime">{createTime}</div>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}
export default ProductTabContentEvaluation;