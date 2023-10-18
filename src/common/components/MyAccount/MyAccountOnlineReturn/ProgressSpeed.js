/*
 * @Author: Leo.Si
 * @Date: 2019-09-11 13:36:02
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-11-22 17:07:40
 * @function 用户申请退货进度
 * applyReturn 申请退货
 * WAIT_APPROVE 申请审核中
 * WAIT_RETURN 等待买家退货
 * WAIT_REFUND 等待退款
 * REFUNDED    退货成功
 * APPROVED    审核通过(等待买家退货)
 * REJECTED    审核被拒(申请审核失败)
 * RETURN_REJECTED 退货关闭
 * PARTIAL_REFUNDED 部分退款成功
 */
const statusGroup = [
  "icon-return_step1.png",
  "icon-return_step2.png",
  "icon-return_step3.png",
  "icon-return_step4.png",
  "icon-return_step5.png",
];
import CdnImage from "@/components/CdnImage";
import React from "react";
const ProgressSpeed = ({ _status }) =>
  !!_status && (
    <div className="online_return_status">
      <p className="online_return_status_title">{_status.title}</p>
      {_status.contnent ? (
        <p className="online_return_status_content">{_status.contnent}</p>
      ) : null}
      {_status.processStatus && _status.processStatus == "RETURN_REJECTED" ? (
        <ul className="online_return_status_list_rejected">
          <li>
            <span className={`online_return_status_number`}>
              <CdnImage src="/soa/mobile/images/order/icon-return_step1.png" />
            </span>
            <p
              className={`online_return_status_list_returnStateTitle title_checked`}
            >
              申请退货
            </p>
          </li>
          <li>
            <span className={`online_return_status_number`}>
              <CdnImage src="/soa/mobile/images/order/icon-return_step5.png" />
            </span>
            <p
              className={`online_return_status_list_returnStateTitle title_checked`}
            >
              退货关闭
            </p>
          </li>
        </ul>
      ) : (
        <ul className="online_return_status_list">
          {_status.returnState.map((item, index) => {
            // console.log("item", item);
            let { returnStateTitle, status } = item;
            //判断当前退货订单所处状态下，圆圈显示的样式
            let ischecked = false;
            if (
              _status.nowState &&
              _status.nowState >= 0 &&
              index <= _status.nowState
            ) {
              ischecked = true;
            }
            return (
              <li key={`online_return_status_list_${index}`}>
                <span
                  className={`online_return_status_number ${
                    ischecked || status ? "show" : "hide"
                  }`}
                >
                  <CdnImage
                    src={`/soa/mobile/images/order/${statusGroup[index]}`}
                  />
                </span>
                <p
                  className={`online_return_status_list_returnStateTitle ${
                    ischecked || status ? "title_checked" : ""
                  }`}
                >
                  {returnStateTitle}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
export default ProgressSpeed;
