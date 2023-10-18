import React from "react";
import { setState } from "@/containers/MyOrder/OrderDetail";
const NoAddress: React.FunctionComponent<{
  setState: setState;
}> = ({ setState }) => (
  <div className="my_address_no">
    <div className="my_address_no_bg" />
    <div className="my_address_no_text">
      <p>您还没有收货地址，赶快设置一个吧！</p>
      <a
        className="btn-set-address"
        onClick={() =>
          setState({
            showAddress: "add",
          })
        }
      >
        去设置
      </a>
      <img
        className="my_address_no_close"
        onClick={() =>
          setState({
            showAddress: "",
          })
        }
        src="https://ssl1.sephorastatic.cn/soa/mobile/images/common_searchtop_delete.png"
      />
    </div>
  </div>
);
export default NoAddress;
