export default function SetTimeCookie(cookie, value) {
  const Times = 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Times * 60 * 1000);
  window.document.cookie = `${cookie}=${escape(
    value,
  )};expires=${exp.toGMTString()}; domain=.sephora.cn; path=/`;
}
