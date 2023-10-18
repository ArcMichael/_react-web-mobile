// 更改加密方式
export default function GetSingleCookie2V2({ key = false }) {
  if (!window) return false;
  if (!window.document) return false;
  if (!window.document.cookie) return false;
  if (!key) return false;

  let List;
  const Reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  if ((List = document.cookie.match(Reg))) {
    return decodeURIComponent(List[2]);
  }
  return false;
}
