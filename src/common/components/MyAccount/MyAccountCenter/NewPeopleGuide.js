/*
 * @Author: summer
 * @Date: 2020-11-21 10:01:01
 * @Last Modified by: summer
 * @Last Modified time: 2021-03-Fr 11:32:13
 * @function 新人引导
 */
import React from "react";

const NewPeopleGuide = ({ _list, _index, _orderSwiper, clickCallback, _myAccountInfo }) => (
  <div className="myaccount_center_info">
    {_list &&
      _list.length > 0 &&
      _list.map((item, index) => {
        return (
          <div
            className={`new-people-guide`}
            key={`guide_${index}`}
            onClick={() => {
              clickCallback(_index);
            }}
          >
            {_myAccountInfo && _myAccountInfo.userProfileAdPosition ? <div className="guide-box" /> : null}
            <img
              src={!_orderSwiper && index == 2 ? _list[index + 1] : item}
              alt=""
              className={[`guide_img_${index}`, _index == index ? "display_status" : ""].join(" ")}
            />
          </div>
        );
      })}
  </div>
);
export default NewPeopleGuide;
