import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import OfflineOrderModule from "@/components/MyAccount/MyAccountOfflineOrder";
import CommonTop from "@/components/CommonTop";
import CommonPageTitle from "@/components/CommonPageTitle";
import GuseeYouLike from "@/components/PlpPage/GuessYouLike";
import * as url from "../../lib/url";
import { initOfflineOrderList } from "../../actions/myAccount";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountOfflineOrder.scss");
}
interface myAccount {
  offlineOrderList: any;
}
const MyAccountOfflineOrder: React.FunctionComponent = () => {
  const myAccount = useSelector<RootState, myAccount>((s) => s.myAccount);
  const { offlineOrderList } = myAccount;
  const dispatch = useDispatch();
  const SCROLL_TOP =
    document.documentElement.scrollTop || document.body.scrollTop;
  useEffect(() => {
    dispatch(initOfflineOrderList(1));
  }, []);
  return (
    <div className="offline_order_page">
      <CommonTop />
      <CommonPageTitle
        _isBackV2={true}
        _title="我的订单"
        _href={
          url.urlGetParams(window.location, "orderType")
            ? `/myOrderList?orderType=${url.urlGetParams(
                window.location,
                "orderType"
              )}`
            : ""
        }
        _isCustomer={true}
      />
      <OfflineOrderModule
        _offlineOrderList={offlineOrderList}
        _scrollTop={SCROLL_TOP}
        _loadMore={initOfflineOrderList}
      />

      {GuseeYouLike && offlineOrderList && offlineOrderList.isShowGuess && (
        <GuseeYouLike
        _title="推荐"
        type="search"
        listTitle="我的订单:"
        listType="Guess You Like_OrderList"
        // logic="CART_MOBILE,l:20,o:0"
      />
      )}
    </div>
  );
};
export default MyAccountOfflineOrder;
