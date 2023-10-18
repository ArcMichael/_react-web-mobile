import React, { useEffect, useState, useRef } from "react";
// import { skuList, skuInfo } from "../service/interance";
import Swiper from "react-id-swiper";
import LazyloadImage from "@/components/LazyloadImage";
import { CommentDto } from "../service/interance";
import "../style/imgList.scss";

interface ImgListState {
  _show?: boolean;
  _setShow?: Function;
  _imgList?: CommentDto[];
  _isCurrent?: number;
  _next?: Function;
}
const ImgList: React.FunctionComponent<ImgListState> = ({
  _imgList = [],
  _show = false,
  _setShow = () => {},
  _isCurrent = 0,
  _next = () => {},
}) => {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(1);
  const [nowInfo, setNowInfo] = useState<CommentDto | null>(null);

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (!_isCurrent) return;
    setCurrent(_isCurrent);
    changeCurrent(_isCurrent);
  }, [_isCurrent]);

  useEffect(() => {
    if (!_imgList.length) return;
    let prevImgLength = 0;
    for (let x = 0; x < _imgList.length; x = x + 1) {
      prevImgLength += _imgList[x].commentImageDtoList?.length || 0;
    }
    setTotal(prevImgLength);
    setTimeout(() => {
      swiperRef.current.swiper.update();
    }, 0);
  }, [_imgList]);

  const changeCurrent = (current: number) => {
    let prevImgLength = 0;
    for (let x = 0; x < _imgList.length; x = x + 1) {
      prevImgLength += _imgList[x].commentImageDtoList?.length || 0;
      if (prevImgLength >= current) {
        setNowInfo(_imgList[x]);
        break;
      }
    }
  };

  const params = {
    direction: "horizontal",
    autoplay: false,
    loop: false,
    initialSlide: _isCurrent - 1,
    on: {
      slideChange() {
        let index = swiperRef.current.swiper.activeIndex + 1;
        setCurrent(index);
        // changeCurrent(index);
        if (index >= 10) {
          // console.log("加载下一页数据");
          _next();
        }
      },
    },
  };

  const closeShow = () => {
    _setShow(false);
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "initial";
    }
  };

  const returnHtmle = () => {
    const pushHtml: any = [];

    _imgList.map((item, index) => {
      item.commentImageDtoList?.map((it, id) => {
        pushHtml.push(
          <div className="list-item" key={`list-li-${index}-${id}`}>
            <LazyloadImage key={`${index}-${id}`} imgProps={{ src: `${it.imagePath}` }} />
          </div>,
        );
      });
    });
    return pushHtml;
  };

  if (!_show) {
    return null;
  }

  return (
    <div className="imgList">
      <div className="imgList-top">
        <img
          onClick={closeShow}
          src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/open_icon.png"
        />
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="imgBox">
        {/* {returnHtmle().length && ( */}
        <Swiper {...params} ref={swiperRef}>
          {returnHtmle()}
        </Swiper>
        {/* )} */}
      </div>
      {nowInfo && (
        <div className="imgList-footer">
          <div className="imgList_foter_box">
            <div className="imgList-name">{nowInfo.nickName}</div>
            <div className="imgList-sku">{nowInfo.skuSpec}</div>
            <div className="imgList-content">{nowInfo.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgList;
