import userLogout from "../blls/userLogout";

export default function soaLoginOff(notGoHome) {
  new Promise((res) => {
    try {
      userLogout(() => {
        res(true);
      });
    } catch (error) {
      res(true);
    }
  }).then(() => {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = `UID=; expires=${exp.toGMTString()}; path=/`;
    document.cookie = `Token=; expires=${exp.toGMTString()}; path=/; domain=.sephora.cn`;
    if (!notGoHome) {
      window.location.href = "/";
    }
  });
}
