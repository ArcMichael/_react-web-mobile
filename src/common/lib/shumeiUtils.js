export function getShuMeiDeviceId() {
  let deviceId = "";
  if (typeof window === "undefined") {
    return "";
  }
  if (window._deviceId) {
    return window._deviceId;
  }
  dealSmDeviceId(function (deviceIdCb) {
    return (deviceId = deviceIdCb);
  });
  return deviceId;
}

function dealSmDeviceId(cb) {

  var smTimeoutTime = 100;
  var smDeviceId = "";
  var smDeviceIdReady = false;
  if (!window.SMSdk) return "";
  var smTimer = setTimeout(function () {
    if (window._deviceId) {
      smDeviceId = window._deviceId;
    } else {
      smDeviceId = window.SMSdk.getDeviceId ? window.SMSdk.getDeviceId() : smDeviceId;
      window._deviceId = smDeviceId;
    }
    if (!smDeviceIdReady) {
      smDeviceIdReady = true; //执行业务逻辑
      cb && cb(smDeviceId);
    }
  }, smTimeoutTime);

  window.SMSdk.ready(function () {
    if (window._deviceId) {
      smDeviceId = window._deviceId;
    } else {
      smDeviceId = window.SMSdk.getDeviceId ? window.SMSdk.getDeviceId() : smDeviceId;
      window._deviceId = smDeviceId;
    }
    clearTimeout(smTimer);

    if (!smDeviceIdReady) {
      smDeviceIdReady = true;
      //执行业务逻辑
      cb && cb(smDeviceId);
    }
  });
}
