export default (function ifDev() {
  return !(
    (typeof window === 'undefined') ||
      (
        typeof window !== 'undefined' &&
        window.location instanceof Object &&
        ['www.sephora.cn', 'm.sephora.cn'].includes(window.location.host)
      )
  )
})()
