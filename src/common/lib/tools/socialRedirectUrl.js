// 联合登录记录返回页面的信息
export default function socialRedirectUrl(path, state) {
  if (!path || !state) return;
  const redirectUrl = JSON.stringify({
    platform: state,
    redirect: encodeURIComponent(
      window.location.search.replace("?historyLocation=", "").replace("&", "?"),
    ),
  });
  if (!redirectUrl) return path;
  return `${path}&state=${encodeURIComponent(redirectUrl)}`;
}
