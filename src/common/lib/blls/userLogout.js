import { AJAX } from "../ajax";

/* 用户登出接口 */
export default function userLogout(callback) {
  AJAX(
    {
      type: "POST",
      url: `/v1/portal/logout`,
      headers: {
        channel: "WEB",
      },
    },
    (json) => {
      callback(json);
    },
  );
}
