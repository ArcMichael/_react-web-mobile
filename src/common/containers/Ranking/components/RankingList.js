import React from "react";
import Image from "@/components/ImagesLazyLoad/Image";
import Images from "../../../components/Images/render";
import RankingListItem from "./RankingListItem";

const RankingList = ({ _data }) => {
  return (
    <div>
      <div className="ranking-list-top">
        {/* <img src={(_data && _data.top) || null} alt="" className="ranking-list-top-img" /> */}
        <Image className="ranking-list-top-img" src={(_data && _data.top) || null} />
        <Images
          _src="https://ssl1.sephorastatic.cn/soa/nmobile/img/ranking_back.png"
          _className="ranking-list-top-back"
          callback={() => {
            window.history.go(-1);
          }}
        />
      </div>
      <div className="ranking-list-body">
        <ul className="ranking-list-body-ul">
          {_data &&
            _data.topSkus &&
            _data.topSkus.map((item, index) => {
              return (
                <RankingListItem
                  type="top"
                  _content={item}
                  _index={index}
                  key={`ranking-list-body-li-${index}`}
                />
              );
            })}
        </ul>
        <ul className="ranking-list-body-common">
          {_data &&
            _data.content &&
            _data.content.map((item, index) => {
              return (
                <RankingListItem
                  type="common"
                  _content={item}
                  _index={index}
                  key={`ranking-list-body-common-li-${index}`}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default RankingList;
