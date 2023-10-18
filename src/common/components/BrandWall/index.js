/*
 * @Author: zone Tian
 * @Date: 2020-02-03 14:51:49
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2020-10-12 13:56:44
 */

import React from 'react';
import HotBrand from './HotBrand';
import BrandList from './BrandList';
import BrandMenu from './BrandMenu';

const BrandWall = ({ BrandAll, HotBrandAllcon, dataoffset, Scorll, curId }) => (
  <div className="brand_all_list">
    {HotBrandAllcon ? <HotBrand HotBrandAllcon={HotBrandAllcon} /> : null}
    <div className="brand_top_title">全部品牌</div>
    {BrandAll ? <BrandList BrandAll={BrandAll} dataoffset={dataoffset} curId={curId} /> : null}

    {BrandAll ? <BrandMenu BrandAll={BrandAll} curId={curId} callback={Scorll} dataoffset={dataoffset} /> : null}
  </div>
);

export default BrandWall;
