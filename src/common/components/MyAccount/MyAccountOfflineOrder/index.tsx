import React from "react";
import { useDispatch } from "react-redux";
import Product from "@/components/MyOrder/OrderList/OrderListContentGoods";
import {
  IitemDto,
  IoperationDto,
  addDto,
} from "@/containers/MyOrder/OrderList/interface";
import * as OrderList from "@/actions/orderList";
import { popupAlert } from "@/actions/popup";
interface Props {
  _loadMore: Function;
  _offlineOrderList: any;
  _scrollTop?: number;
}
const OfflineOrderModule: React.FunctionComponent<Props> = (props) => {
  const { _loadMore, _offlineOrderList, _scrollTop } = props;
  const dispatch = useDispatch();
  const loadMoreData = () => {
    dispatch(_loadMore(
      _offlineOrderList &&
        _offlineOrderList.pageNum &&
        _offlineOrderList.pageNum + 1
    ))
  };
  return (
    <div className="offline_order_page_content">
      <div
        className={`offline_order_page_content_title  ${
          _scrollTop && _scrollTop > 100 ? "title_fixed" : ""
        }`}
      >
        <div>线下订单</div>
        <div
          onClick={() => {
            window.location.href = "/myOrderList?orderType=all";
          }}
        >
          <span>线上订单</span>
          <img src="https://sslstage1.sephorastatic.cn/soa/mobile/images/order/Icon-switch.png" />
        </div>
      </div>
      {!_offlineOrderList ||
      !_offlineOrderList.list ||
      _offlineOrderList.list.length == 0 ? (
        <div className="offline_order_page_content_no_order">
          <span />
          <span>暂无订单</span>
        </div>
      ) : (
        <div>
          <ul className="offline_order_page_content_ul">
            {_offlineOrderList &&
              _offlineOrderList.list &&
              _offlineOrderList.list.length > 0 &&
              _offlineOrderList.list.map((item: any, index: number) => {
                const {
                  storeName,
                  purchaseTime,
                  itemList,
                  totalQuantity,
                  totalAmount,
                  actualAmount,
                  discountAmount,
                } = item;
                return (
                  <li
                    className="offline_order_page_content_ul_li"
                    key={`offline_order_${index}`}
                  >
                    <div className="offline_order_title">
                      <span>{storeName}</span>
                      <span>
                        {purchaseTime.includes(" ")
                          ? purchaseTime.split(" ")[0]
                          : purchaseTime}
                      </span>
                    </div>
                    {itemList &&
                      itemList.length > 0 &&
                      itemList.map((key: IitemDto, num: number) => {
                        const {
                          productImageUrl,
                          productBrandNameEn,
                          productName,
                          skuId,
                          price,
                          quantity,
                          productId,
                          productSize,
                        } = key;
                        let productData = {
                          defaultImagePath: productImageUrl,
                          brandNameEN: productBrandNameEn,
                          productNameCN: productName,
                          offerPrice: price,
                          quantity: quantity,
                          productId: productId,
                          productSize: productSize,
                          skuId: skuId,
                          isFullImage: true,
                        };
                        let operationArr: IoperationDto[] = [];
                        if (skuId && productId) {
                          operationArr.push({
                            type: "button",
                            text: "再次购买",
                            className: "addcart",
                            callback: () => {
                              let arr: addDto[] = [];
                              if (skuId) {
                                arr.push({
                                  type: 1,
                                  channel: "MOBILE",
                                  quantity: 1,
                                  checked: 1,
                                  skuId: skuId,
                                });
                              }
                              dispatch(
                                OrderList.batchRepurchase(
                                  arr,
                                  (callback: any) => {
                                    if (
                                      callback &&
                                      callback.results &&
                                      !callback.results.code
                                    ) {
                                      window.location.href = "/cart";
                                    } else {
                                      if (
                                        callback &&
                                        callback.results &&
                                        callback.results.code &&
                                        (callback.results.code == 40051299 ||
                                          callback.results.code == 40051399 ||
                                          callback.results.code == 40052199 ||
                                          callback.results.code == 40053099 ||
                                          callback.results.code == 40051039 ||
                                          callback.results.code == 40073099 ||
                                          callback.results.code == 40050169)
                                      ) {
                                        dispatch(
                                          popupAlert(1, "PopupCleaning", {
                                            _title: callback.results.code,
                                            _text: callback.results.message,
                                            _autoClose: true,
                                          }),
                                        );
                                      } else {
                                        window.location.href = "/cart";
                                      }
                                    }
                                  }
                                )
                              );
                            },
                          });
                        }
                        return (
                          <Product
                            // _data={productData}
                            productInfoDtoList={productData}
                            operationArr={operationArr}
                            key={`offline_order_page_content_ul_li_product_${num}`}
                          />
                        );
                      })}
                    <div className="offline_order_bottom">
                      <div className="offline_order_text goods_actualAmount">
                        <p>{`共${totalQuantity}件商品`}</p>
                        <p>
                          <span>实付款 </span>
                          <span>¥</span> {actualAmount}
                        </p>
                      </div>
                      <div className="offline_order_text goods_totalAmount">
                        <p>商品总额</p>
                        <p>
                          <span>¥</span>
                          {totalAmount}
                        </p>
                      </div>
                      <div className="offline_order_text goods_totalAmount">
                        <p>折扣金额</p>
                        <p>¥{discountAmount}</p>
                      </div>
                      {/* <div className="offline_order_text">
                        <p>优惠券抵扣</p>
                        <p>¥{discountAmount}</p>
                      </div> */}
                    </div>
                  </li>
                );
              })}
          </ul>
          {_offlineOrderList && _offlineOrderList.isMore ? (
            <p
              className="offline_order_load_more"
              onClick={() => loadMoreData()}
            >
              加载更多
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default OfflineOrderModule;
