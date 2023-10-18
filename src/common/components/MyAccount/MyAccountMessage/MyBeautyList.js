/*
 * @Author: Leo.Si
 * @Date: 2019-11-18 16:24:45
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2020-04-30 16:06:36
 * @function 我的消息列表展示数据
 */
import React from "react";
import DataLink from "../../Atoms/DataLink";
import Image from "../../ImagesLazyLoad/index"

const MyBeautyList = ({ _list }) =>
  !!_list && _list && _list.list && _list.list.length > 0 ? (
    <ul className="my_message_list_ul">
      {_list.list.map((item, index) => {
        const { createTime, imageUrl, title, subtitle, url } = item;
        return (
          <li key={`my_message_list_${index}`}>
            <p className="my_message_list_time">{createTime}</p>
            <DataLink
              _Sensor={{
                eventKey: "clickBanner_App_Mob",
                value: {
                  $lib_detail: "M_NewMobile##getSensorData##MyBeautyList.js##26",
                  banner_type: "campaign",
                  banner_belong_area: "Msg_Center_BeautyInfo",
                  banner_ranking: index + 1,
                  banner_to_url: url || "",
                  campaign_code: url || "",
                },
              }}
              _Href={url || "#"}
            >
              <div className="my_beauty_list_content">
                <Image src={imageUrl} />
                {/* <img src={imageUrl} /> */}
                {title && (
                  <p
                    className="my_beauty_list_content_title"
                    dangerouslySetInnerHTML={{ __html: decodeURIComponent(title) }}
                  />
                )}
                {subtitle && (
                  <p
                    className="my_beauty_list_content_subtitle"
                    dangerouslySetInnerHTML={{ __html: decodeURIComponent(subtitle) }}
                  />
                )}
              </div>
            </DataLink>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="my_message_list_no_message">暂时没有任何消息</div>
  );

export default MyBeautyList;
