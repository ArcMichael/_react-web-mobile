import React from "react";
import { useSelector } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
if (__DEV__ && isBrowser()) {
  require("../../../../public/style/common/_module_order_cart.scss");
}

interface AddtoCartAnimationProps {
  hasShowAdvertising?: boolean;
  hasClickAddtoCart: boolean;
}

const AddtoCartAnimation: React.FunctionComponent<AddtoCartAnimationProps> = ({
  hasShowAdvertising,
  hasClickAddtoCart,
}) => {
  const cart: any = useSelector<RootState>((state) => state.cart);
  let QCPTQ = cart.QCPTQ;
  return (
    <div
      className={`suspension-cart ${hasShowAdvertising ? "up" : ""} ${
        hasClickAddtoCart ? "" : "vishid"
      }`}
      onClick={
        ()=>{
          window.location.href="/cart"
        }
      }
    >
      {QCPTQ && (
        <span className="shopcart-upper">{QCPTQ > 100 ? "99+" : QCPTQ}</span>
      )}
      <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/suspension_cart.png" />
    </div>
  );
};

export default AddtoCartAnimation;
