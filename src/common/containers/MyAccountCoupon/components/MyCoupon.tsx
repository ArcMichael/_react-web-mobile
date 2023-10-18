import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyCoupon, getInitialCoupon,getDoorList } from "../../../actions/myAccount";
import CommonPageTitle from "./coupon-top";
import CouponBody, {
  couponDetail,
  depositCoupon,
} from "../../../components/MyAccount/MyAccountCoupon/CouponBody";
import DoorCoupon from "../../../components/MyAccount/MyAccountCoupon/DoorCoupon";
interface MyAccountCouponConProps {
  setCouponDetail: (data: couponDetail) => void;
  toggleCouponRule: () => void;
}

const MyAccountCouponCon: React.FunctionComponent<MyAccountCouponConProps> = ({
  setCouponDetail,
  toggleCouponRule,
}) => {
  const dispatch = useDispatch();
  const [minHeight, setMinHeight] = useState(0);
  const [tabIndex, setTabIndex] = useState(1);
  const changeTab = (tab: number) => {
    setTabIndex(tab);
    dispatch(getInitialCoupon(1,tab));

  };
  useEffect(() => {
    dispatch(getInitialCoupon(1));
    if (typeof window !== undefined) {
      setMinHeight(window.screen.height);
    }
  }, []);
  const MyAccountCouponConts = useSelector<RootState, depositCoupon[]>(
    (state) => state.MyAccountCouponConts
  );
  const doorCouponConts = useSelector<RootState, depositCoupon[]>(
    (state) => state.doorCouponConts
  );
  console.log(doorCouponConts)
  const nowValid = 1;
  return (
    <div className="my-discount" style={minHeight ? { minHeight } : undefined}>
      <div className="myCoupon_top">
        <CommonPageTitle
          changeTab={changeTab}
          tabIndex={tabIndex}
          _isBackV2
          _title={[
            {
              tab: 1,
              title: "线上优惠券",
            },
            {
              tab: 2,
              title: "门店优惠券",
            },
          ]}
          _customRight={
            <img
              src="https://ssl1.sephorastatic.cn/soa/mobile/images/myAccount/coupon-rule.png"
              className="coupon_help"
              onClick={toggleCouponRule}
            />
          }
        />
      </div>
     {tabIndex == 1 && (
        <CouponBody
          getMyCoupon={(param) => dispatch(getMyCoupon(param))}
          nowValid={nowValid}
          depositCouponResults={MyAccountCouponConts}
          setCouponDetail={setCouponDetail}
        />
      )}
      {/* 门店body */}
      {tabIndex == 2 && (
        <DoorCoupon
          getMyCoupon={(param) => dispatch(getDoorList(param))}
          nowValid={nowValid}
          setCouponDetail={setCouponDetail}

          depositCouponResults={doorCouponConts}
        />
      )} 
    </div>
  );
};

export default MyAccountCouponCon;
