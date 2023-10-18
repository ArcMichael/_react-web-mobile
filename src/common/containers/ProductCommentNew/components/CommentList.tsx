import React, { useEffect, useState } from "react";
import "../style/commentList.scss";
import { urlGetParams } from "@/lib/url";
import { Params, CommentDto, labelDto } from "../service/interance";
import { getCommentList, getSkuLabelList, toggleLikeComment } from "../service";
import ImgList from "./ImgList";

interface ICommentList {
  _productId: number | string;
  _skuId: number | null;
  _product?: boolean;
  _setProductScore?: Function;
}

// 图片存在几张
// 2  3348
// 4 2883
// 5 521044
const CommentList: React.FunctionComponent<ICommentList> = ({
  _productId,
  _skuId,
  _product = false,
  _setProductScore,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [imgCurrent, setImgCurrent] = useState<number>(0);
  const countRef = React.useRef<number>(0);
  const [current, setMaxCurrent] = useState<number>(1);
  const [commentList, setCommentList] = React.useState<CommentDto[]>([]);
  const [labelList, setLabelList] = React.useState<labelDto[]>([]);

  const [params, setParams] = useState<Params>({
    pageNo: 1,
    productId: _productId,
    labelId: urlGetParams(window.location, "labelId") || "is_all",
    skuId: _skuId,
    pageType: _product ? 1 : 2,
  });

  const getList = async () => {
    if (params.pageNo > current) return;
    setLoading(true); // 设为请求状态
    const { results, errorMessage } = await getCommentList(params);
    setLoading(false); // 请求完毕置为false
    if (errorMessage) return false;
    if (results?.commentDtos) {
      setMaxCurrent(results.totalPages);
      if (params.pageNo == 1) {
        setCommentList(results.commentDtos);
      } else {
        setCommentList([...commentList, ...results.commentDtos]);
      }

      if (_setProductScore) {
        _setProductScore(results.productScore);
      }
    } else {
      setCommentList([]);
    }
  };

  useEffect(() => {
    const handerScroll = () => {
      setTimeout(() => {
        if (loading) return; // 判断是否在请求状态
        if (countRef.current == current) return;
        // 变量t就是滚动条滚动时，到顶部的距离
        const t = document.documentElement.scrollTop || document.body.scrollTop;
        if (t + 815 > document.body.clientHeight && !loading) {
          setParams({
            ...params,
            pageNo: countRef.current + 1,
          });
        }
      }, 0);
    };

    document.addEventListener("scroll", handerScroll);
    return () => {
      document.removeEventListener("scroll", handerScroll);
    };
  });

  // 给图片预览的组件，下一页
  const nextLoad = () => {
    if (loading) return; // 判断是否在请求状态
    if (countRef.current == current) return;
    setParams({
      ...params,
      pageNo: countRef.current + 1,
    });
  };

  const getLabeltList = async () => {
    const { results, errorMessage } = await getSkuLabelList(_productId, _product ? 1 : 2, _skuId);
    if (errorMessage) return false;
    setLabelList(results || []);
  };

  useEffect(() => {
    if (_skuId) {
      setParams({
        ...params,
        pageNo: 1,
        skuId: _skuId,
      });
    }
  }, [_skuId]);

  useEffect(() => {
    getList();
    countRef.current = params.pageNo;
  }, [params]);

  useEffect(() => {
    getLabeltList();
  }, []);

  const chooseLabel = (id: string) => {
    // 如果是pdp页面，则跳转全部评价
    if (_product) {
      window.location.href = `/v2/html/ProductCommentNew?id=${_productId}&labelId=${id}`;
    }
    setParams({ ...params, labelId: id, pageNo: 1 });
  };

  const toggleLike = async (uuid: string) => {
    const { results, errorMessage, jQueryStatus } = await toggleLikeComment(uuid);
    if (jQueryStatus && jQueryStatus.status == 400) {
      let nowSearch = window.location.search;
      const labelId = urlGetParams(window.location, "labelId");
      if (nowSearch) {
        window.location.href = `/login?historyLocation=${encodeURI(
          window.location.pathname.replace("/", "") + window.location.search,
        )}`;
      } else {
        window.location.href = `/login?historyLocation=v2/html/ProductCommentNew?id=${_productId}${
          labelId ? "&labelId=" + labelId : ""
        }`;
      }
    }
    if (errorMessage) return false;
    if (results) {
      let index = commentList.findIndex((it) => it.uuid === uuid);
      commentList[index].isThumbsUp = commentList[index].isThumbsUp == 1 ? 0 : 1;
      setCommentList([...commentList]);
    }
  };

  const previewImg = (index: number, imgIndex: number) => {
    let prevImgLength = 0;
    for (let x = 0; x < commentList.length; x = x + 1) {
      if (x < index) {
        prevImgLength += commentList[x].commentImageDtoList?.length || 0;
      }
      if (x === index) {
        // 点击的当前行的Img的index
        prevImgLength = imgIndex + prevImgLength + 1;
      }
      if (x > index) {
        break;
      }
    }
    setImgCurrent(prevImgLength);
    setShow(true);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "hidden";
    }
  };

  if (_product && commentList.length === 0) {
    return null;
  }

  return (
    <div className={`comment-content ${_product ? "comment_product" : ""}`}>
      <ul className="tag-list">
        {labelList.map((it) => {
          return (
            <li
              key={it.id}
              onClick={() => chooseLabel(it.id)}
              className={params.labelId == it.id ? "current" : ""}
            >
              <div className="tag-title">{it.name}</div>
              <div className="tag-num">&nbsp;{it.count}</div>
            </li>
          );
        })}
      </ul>

      <ul className="comment-list">
        {commentList.length === 0 && (
          <div className="comment-list-empty">
            <img src="https://ssl1.sephorastatic.cn/soa/nmobile/img/product/pingjia.png" />
            还没有收到评价哟
          </div>
        )}
        {commentList.map((item, index) => {
          const photoImg =
            item.photo || "https://m.sephora.cn/soa/images/productsDetailsPage/head.png";
          return (
            <li key={item.uuid}>
              <div className="conent-top">
                <div>
                  <img className="comment-avatar" src={photoImg} />
                  <div className="comment-name">{item.nickName}</div>
                  <em className={`comment-card ${item.cardType}`} />
                  <ul className="skin-list">
                    {item.userArchives?.map((label) => {
                      return <li key={label}>{label}</li>;
                    })}
                  </ul>
                </div>
                {item.isEssenceComment == 1 && (
                  <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/essence.png" />
                )}
              </div>
              {item.attrConsumerList && (
                <ul className="star-list">
                  {item.attrConsumerList.map((attar) => {
                    return <li key={attar.id}>{`${attar.value} ${attar.score}`}</li>;
                  })}
                </ul>
              )}

              {/* 评价 */}
              <div className="specs">{item.skuSpec}</div>
              <div className="content">{item.content}</div>
              {!_product && item.labelConsumers && (
                <ul className="commit-tag">
                  {item.labelConsumers.map((label) => {
                    return <li key={label}>{label}</li>;
                  })}
                </ul>
              )}
              {item.commentImageDtoList && (
                <div className="img-list">
                  {item.commentImageDtoList.map((imgSrc, imgIndex) => {
                    return (
                      <img
                        className={`imgLength${item.commentImageDtoList.length}`}
                        src={imgSrc.imagePath}
                        key={imgSrc.commentId}
                        onClick={() => previewImg(index, imgIndex)}
                      />
                    );
                  })}
                </div>
              )}

              {!_product && (
                <>
                  {item.replyDto && (
                    <div className="comment-desc">
                      {item.replyDto.nickName}：{item.replyDto.content}
                    </div>
                  )}
                  <div className="comment-foter">
                    <span className="foter-date">{item.createTime}</span>
                    <div className="foter-num">
                      {item.isThumbsUp === 0 ? (
                        <img
                          onClick={() => toggleLike(item.uuid)}
                          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/give0.png"
                        />
                      ) : (
                        <img
                          onClick={() => toggleLike(item.uuid)}
                          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/give2.png"
                        />
                      )}
                      {item.thumbsUpCount}
                    </div>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <ImgList
        _show={show}
        _setShow={setShow}
        _imgList={commentList}
        _isCurrent={imgCurrent}
        _next={nextLoad}
      />
    </div>
  );
};

export default CommentList;
