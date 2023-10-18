import React, { useState, useCallback } from "react";
import DeepLinkPopup from "@/components/DeepLink/DeepLinkPopup";
import { CommonOpenApp } from "@/Utils/deepLinkV2";
// import { isIOS } from "@/lib/device";
import Sensor from "@/Utils/sensor";
import GoogleAnalytics from "@/Utils/GoogleAnalytics";

interface OrderDetailDeepLinkProps {
  show: boolean;
  close: () => void;
}
const openApp = () => {
  Sensor.go("downloadAppClick", {
    $lib_detail: "M_newDeepLink##toDownLoad##DeepLink.js##38",
  });
  GoogleAnalytics.pushV2({
    event: "appDownload",
  });
  CommonOpenApp();
};
// const openApp = () => {
//   Sensor.go("downloadAppClick", {
//     $lib_detail: "M_newDeepLink##toDownLoad##DeepLink.js##38",
//   });
//   GoogleAnalytics.pushV2({
//     event: "appDownload",
//   });
//   window.location.href = getHrefLinkV2();
//   if (!isIOS()) {
//     autoGoDownloadPage();
//   }
// };
// const autoGoDownloadPage = () => {
//   setTimeout(() => {
//     window.location.href = getOiaDownloadLink();
//   }, 500);
// };
const OrderDetailDeepLink: React.FunctionComponent<OrderDetailDeepLinkProps> =
  ({ show, close }) => {
    const [showPopup, setShowPopup] = useState(false);
    const closeHandle = useCallback((cb) => {
      setShowPopup(false);
      cb && cb();
    }, []);
    return (
      <div>
        <div className={`cancleOrder ${show ? "cur" : ""}`}>
          <div className="cancel-toApp-body">
            <div className="cancel-toApp-top">
              <span className="iconC iconC-close close" onClick={close} />
            </div>
            <div>请至丝芙兰APP客户端完成操作</div>
            <button onClick={() => setShowPopup(true)}>打开APP</button>
          </div>
        </div>
        {showPopup && (
          <DeepLinkPopup
            isShowPopup={showPopup}
            closeHandle={closeHandle}
            openApp={openApp}
          />
        )}
      </div>
    );
  };

export default OrderDetailDeepLink;
