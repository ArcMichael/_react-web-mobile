/*
 * @Author: Leo.Si
 * @Date: 2019-11-18 16:24:45
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-19 14:13:25
 * @function 我的消息列表展示数据
 */
import React from "react";
import DataLink from "../../Atoms/DataLink";

const MymsgList = ({ _list }) =>
  !!_list && _list && _list.list && _list.list.length > 0 ? (
    <ul className="my_message_list_ul">
      {_list.list.map((item, index) => {
        const { createTime, iconUrl, title, content, isLinked, linkedUrl } = item;
        return (
          <li key={`my_message_list_${index}`}>
            <p className="my_message_list_time">{createTime}</p>
            <div className="my_message_list_content">
              <img src={iconUrl} />
              <span>{title}</span>
              <p dangerouslySetInnerHTML={{ __html: decodeURIComponent(content) }} />
              {isLinked ? (
                <DataLink
                  _Href={linkedUrl}
                  _Sensor={{
                    eventKey: "clickBanner_App_Mob",
                    value: {
                      $lib_detail: "M_NewMobile##getSensorData##MyBeautyList.js##26",
                      banner_type: "campaign",
                      banner_belong_area: "Msg_Center_MyMsg",
                      banner_to_url: linkedUrl || "",
                      banner_ranking: index + 1,
                      campaign_code: linkedUrl || "",
                    },
                  }}
                >
                  查看详情{">"}
                </DataLink>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="my_message_list_no_message">暂时没有任何消息</div>
  );

export default MymsgList;
