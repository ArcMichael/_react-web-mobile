import Sensor from "@/Utils/sensor";
import bodyScrollTop from "@/Utils/utils/bodyScrollTop";
import React from "react";

class SuspensionButton extends React.PureComponent {
  render() {
    const { isScroll, viewPortPage, totalPage, QCPTQ, startCustomerService } = this.props;
    let isShowPage = viewPortPage > 1;
    let pageDom = null;
    if (!isScroll) {
      pageDom = (
        <img
          onClick={() => bodyScrollTop.set(0)}
          src="https://ssl1.sephorastatic.cn/soa/mobile/images/suspension_top.png"
        />
      );
    } else {
      pageDom = (
        <div className="plp-suspension-page-container">
          <div className="plp-suspension-page-viewport">{viewPortPage}</div>
          <div className="plp-suspension-page-total">{totalPage}</div>
        </div>
      );
    }
    return (
      <div className="plp-suspension">
        <div className={`plp-suspension-page ${isShowPage ? "" : "hide"}`}>{pageDom}</div>
        <div className="plp-suspension-cart" onClick={() => {
         window.location.href = "/cart"; 
          Sensor.go("$WebClick", {
            action_id: "1000202_981",
            page_id: "MB_1000202",
            $element_content: "去购物车"
          });
          }}>
          {QCPTQ && <span className="shopcart-upper">{QCPTQ > 100 ? "99+" : QCPTQ}</span>}
          <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/suspension_cart.png" alt="" />
        </div>
        <div className="plp-suspension-custom" onClick={startCustomerService}>
          <img src="https://ssl1.sephorastatic.cn/soa/mobile/images/suspension_custom.png" alt="" />
        </div>
      </div>
    );
  }
}

export default SuspensionButton;
