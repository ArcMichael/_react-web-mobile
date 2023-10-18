export default function GetSingleCookie2({
  key = false,
}: {
  key: boolean | string;
}) {
  if (!window) return "";
  if (!window.document) return "";
  if (!window.document.cookie) return "";
  if (!key) return "";

  const Reg = document.cookie.match(
    new RegExp("(^| )" + key + "=([^;]*)(;|$)")
  );

  return Reg ? Reg[2] : "";
}
