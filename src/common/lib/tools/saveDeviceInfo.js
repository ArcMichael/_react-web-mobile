import $ from "jquery";

// 保存设备信息
export default function saveDeviceInfo() {
  if (!localStorage.getItem("ua_parse")) {
    $.post("/api/SOA/save/device/information", "", (json) => {
      localStorage.setItem(
        "ua_parse",
        json && json.message && JSON.stringify(json.message)
      );
    });
  }
}
