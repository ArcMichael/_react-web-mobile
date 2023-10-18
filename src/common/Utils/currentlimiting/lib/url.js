// 获取单个参数
export const urlGetParams = (location, name) => {
  return urlGetAllParams(location)[name] || false
}

/**
   * 获取全部URL参数
   * @param {*} url
   * return Obejct || {}
   */

export function urlGetAllParams(location) {
  const qs = (location.search.length > 0 ? location.search.substring(1) : '')


  const args = {}


  const items = qs.length ? qs.split('&') : []


  let item = null


  let name = null


  let value = null


  let i = 0


  const len = items.length
  for (i = 0; i < len; i++) {
    item = items[i].split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length && value) {
      args[name] = value
    }
  }
  return args
}

export const SetSingleCookie2 = ({ key = false, value = false, time = false, domain = false, path = '/' }) => {
  if (!window) return false
  if (!window.document) return false
  if (!window.document.cookie) return false
  if (!key) return false
  // if (!value) return false;

  const _strSecond = time || 1000 * 60 * 60 * 24 * 365 * 20
  const _exp = new Date()
  _exp.setTime(_exp.getTime() + _strSecond * 1)

  let _setCookie = key + '=' + escape(value) + ';'
  _setCookie += ' expires=' + _exp.toUTCString() + ';'
  if (domain) _setCookie += ' domain=' + domain + ';'
  _setCookie += ' path=' + path + ';'
  window.document.cookie = _setCookie
}
