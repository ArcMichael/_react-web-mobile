export default function pushBack(type, goNum) {
  if (document.referrer === "" || document.referrer === 0 || (type && type === "search")) {
    window.location.href = "/";
  } else {
    window.history.go(goNum || -1);
    return false;
  }
  return false;
}
