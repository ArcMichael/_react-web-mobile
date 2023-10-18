export default function SetForeverCookie(cookie, value) {
  const Times = 60 * 24 * 365 * 20;
  const exp = new Date();
  exp.setTime(exp.getTime() + Times * 60 * 1000);
  window.document.cookie = `${cookie}=${escape(
    value,
  )};expires=${exp.toGMTString()}; domain=.sephora.cn; path=/`;
}
