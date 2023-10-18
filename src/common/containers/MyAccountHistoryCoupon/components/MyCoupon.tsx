import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import { getMyCoupon, getInitialCoupon,getDoorList } from "../../../actions/myAccount";
import CommonPageTitle from "../../../components/CommonPageTitle";
import CouponTab from "./CouponTab";
import CouponBody, {
  depositCoupon,
} from "../../../components/MyAccount/MyAccountCoupon/CouponBody";
import urlGetParams from "@/lib/urls/urlGetParams";
import DoorCoupon from "../../../components/MyAccount/MyAccountCoupon/DoorCoupon";

interface MyAccountCouponConProps {
  toggleCouponRule: () => void;
}

const MyAccountCouponCon: React.FunctionComponent<MyAccountCouponConProps> = ({
  toggleCouponRule,
}) => {
  const MyAccountCouponConts = useSelector<RootState, depositCoupon[]>(
    (s) => s.MyAccountCouponConts
  );
  const doorCouponConts = useSelector<RootState, depositCoupon[]>(
    (state) => state.doorCouponConts
  );
  const dispatch = useDispatch();
  const [nowValid, setNowValid] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const [isDoor, setIsDoor] = useState<string|boolean>("");


  const tabValid = (v: number, ifSendReq: boolean) => {
    bodyScrollTop.set(0);
    setNowValid(v);
    ifSendReq &&
      getMyCoupon &&
      dispatch(
        getMyCoupon({
          pageNo: 1,
          pageSize: 15,
          valid: v,
        })
      );
  };
  useEffect(() => {
    let isDoor=urlGetParams(window.location,"isDoor")
    setIsDoor(isDoor)
    if (isDoor) {
      dispatch(getInitialCoupon(2,2));
    }else{
      dispatch(getInitialCoupon(0));
    }
    
    if (typeof window !== undefined) {
      setMinHeight(window.screen.height);
    }
  }, []);
  return (
    <div className="my-discount" style={minHeight ? { minHeight } : undefined}>
      <div className="myCoupon_top">
        <CommonPageTitle
          _isBackV2
          _title="历史优惠券"
          _customRight={
            <img
              src="https://ssl1.sephorastatic.cn/soa/mobile/images/myAccount/coupon-rule.png"
              className="coupon_help"
              onClick={toggleCouponRule}
            />
          }
        />
        <CouponTab
          nowValid={nowValid}
          depositCouponResults={isDoor?doorCouponConts:MyAccountCouponConts}
          tabCallback={tabValid}
        />
      </div>
      {isDoor?
      <DoorCoupon
      getMyCoupon={(param) => dispatch(getDoorList(param))}
          nowValid={nowValid}
          depositCouponResults={doorCouponConts}
      />
      :<CouponBody
        getMyCoupon={(param: any) => dispatch(getMyCoupon(param))}
        nowValid={nowValid}
        depositCouponResults={doorCouponConts}
      />}
    </div>
  );
};

export default MyAccountCouponCon;
