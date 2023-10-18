import React from 'react';
import Images from '../../../components/Images/render';
import Sensor from '../../../Utils/sensor';
import { urlGetParams } from '../../../lib/url';
import Image from '@/components/ImagesLazyLoad';

const RankingListItem = ({ _content, type }) => {
  let tags = <p className="ranking-tags" />;
  if (_content.tags && _content.tags.length) {
    tags = (
      <p className="ranking-tags">
        {_content.tags.map((tag, ind) => {
          if (ind > 2) return null;
          return (
            <span className={`ranking-tag ranking-tag-${tag.key}`} key={`ranking-tag-${ind}`}>
              {tag.value}
            </span>
          );
        })}
      </p>
    );
  }
  let name = urlGetParams(window.location, 'name');

  return (
    <a href={`/product/${_content.spuId}.html?sku=${_content.skuId}`} onClick={()=>{
      Sensor.go("TopRankingListClick", {
        OP_code:_content.spuId,
        commodity_sku:_content.skuId,
        current_url:window.location.href,
        topRankinglist_name:name,
      });
    }}>
      <li className="ranking-list-body-li">
        <div className="ranking-list-body-li-img">
          <Image src={`${_content.defaultImage}180x180.jpg`} />
        </div>
        <div className="ranking-list-body-li-info">
          {type === 'common' ? tags : null}
          <p className="ranking-brand">{_content.brandEN}</p>
          <p className="ranking-name">{_content.name}</p>
          {type === 'top' ? tags : null}
          <p className="ranking-price">
            <span className="ranking-price-realprice">{_content.price ? '￥' + _content.price : ''}</span>
            <span className="ranking-price-constprice">{_content.costPrice ? '￥' + _content.costPrice : ''}</span>
          </p>
        </div>
        {// 推荐理由
        _content.recommend && type === 'top' ? (
          <div className="ranking-list-body-li-recommend">
            <span className="recommend-label">上榜理由：</span>
            <span className="recommend-reason">{_content.recommend}</span>
          </div>
        ) : null}
        {type === 'top' ? (
          <div className="ranking-check">
            <Images _src="https://ssl1.sephorastatic.cn/soa/nmobile/img/ranking_check.png" />
          </div>
        ) : null}
      </li>
    </a>
  );
};

export default RankingListItem;
