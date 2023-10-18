export const isWeChat = () => {
  if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) {
    return true
  }
  return false
}
