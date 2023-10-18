/**
 *
 * @param {import('express').Request} req
 * @param {*} res
 * @param {*} url
 * @param {*} params
 * @param {*} callback
 */
export default function GetFetch(req, res, url, params, callback) {
  const cookies = req.headers.cookie ? req.headers.cookie.split("; ") : "";
  let relCookieToken;
  let relCookieUserId;
  if (params && params.headers && params.headers.UID) {
    relCookieUserId = params.headers.UID;
  }
  for (let i = 0; i < cookies.length; i++) {
    const tmpCookie = cookies[i].split("=");
    if (tmpCookie[0].match(/^Token\d*/)) {
      relCookieToken = tmpCookie[1];
    }
    if (tmpCookie[0].match(/^UID\d*/)) {
      relCookieUserId = tmpCookie[1];
    }
  }

  if (
    !url.match(
      /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
    ) == null
  ) {
    callback({ status: 1, message: "error format Url" });
    return;
  }

  if (Object.prototype.toString.call(params) !== "[object Object]") {
    callback({ status: 1, message: "error format Patams" });
    return;
  }

  if (params.method == null) {
    callback({ status: 1, message: "error Params Method" });
    return;
  }

  if (!params.headers) {
    params.headers = {};
  }
  params.headers.Token = relCookieToken;
  params.headers.UID = relCookieUserId;

  params.headers["Content-Type"] = "application/json";
  params.headers["User-Agent"] = req.headers["user-agent"];
  params.headers.Referer = req.headers.referer || "";

  fetch(url, params)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        // 续cookie node发送到客户端设置请求头带cookie
        if (
          response &&
          response.headers &&
          response.headers._headers &&
          response.headers._headers["set-cookie"]
        ) {
          for (const i in response.headers._headers["set-cookie"]) {
            res.append("Set-Cookie", response.headers._headers["set-cookie"][i]);
          }
        }
        return Promise.resolve(response);
      }
      if (response.status === 401) {
        return Promise.resolve(response);
      }
      console.error(response.statusText);
      return Promise.reject(new Error(response.statusText));
    })
    .then((json) => json.json())
    .then(function (data) {
      callback({
        status: data.status,
        results: data,
      });
    })
    .catch((error) => {
      callback({
        status: 1,
        results: { results: error },
      });
      console.log(JSON.stringify({ url, params, error }));
    });
}
