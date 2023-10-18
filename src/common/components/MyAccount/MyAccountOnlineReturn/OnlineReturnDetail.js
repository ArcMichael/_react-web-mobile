/*
 * @Author: Leo.Si
 * @Date: 2019-09-12 14:01:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-02 15:25:00
 * @function 申请退货详情的产品信息、退货原因、退货数量、退货金额、退货说明
 */
import React from "react";
import OrderListGoods from "@/components/MyOrder/OrderList/OrderListContentGoods";
import OnlineReturnReason from "./OnlineReturnReason";
import OnlineReturnExplain from "./OnlineReturnExplain";

const OnlineReturnDetail = ({ _recoreReason, _clickCallback, _isSumbit }) => {
  // debugger
  return (
    <div className="online_return_page_detail">
      <div className="online_return_info">
        <p className="online_return_page_detail_title">退货商品</p>
        <ul>
          {_recoreReason.productList &&
            _recoreReason.productList.map((products) => {
              return (
                <li key={products.skuId} className="">
                  <OrderListGoods productInfoDtoList={products} isHideTag/>
                </li>
              );
            })}
        </ul>
      </div>
      <div className="online_return_info">
        <p className="online_return_page_detail_title">退货信息</p>
        <div>
          <OnlineReturnReason _clickCallback={_clickCallback} _obj={_recoreReason.returnReason} />
          {_recoreReason.returnReason && _recoreReason.returnReason.value === "退货期内无理由退货" && (
            <div className="no_reason_tips">
              <em />
              <p>
                请您确保退回商品完好未拆封，同时包邮订单买家承担退回运费，非包邮订单买家承担来回运费
              </p>
            </div>
          )}
        </div>
        <div>
          <OnlineReturnReason _clickCallback={_clickCallback} _obj={_recoreReason.returnNumber} />
        </div>
        <div>
          <OnlineReturnReason _clickCallback={_clickCallback} _obj={_recoreReason.returnAmount} />
        </div>
      </div>
      <div className="online_return_info">
        <p className="online_return_page_detail_title">
          退货说明
          <em onClick={() => _clickCallback("returnReasonSample")} />
        </p>
        <OnlineReturnExplain _clickCallback={_clickCallback} />
      </div>
      <div
        className={`online_return_detail_submit ${!_isSumbit ? "noVal" : ""}`}
        onClick={_clickCallback.bind(this, "applyReturnAjax")}
      >
        提交
      </div>
    </div>
  );
};
export default OnlineReturnDetail;
