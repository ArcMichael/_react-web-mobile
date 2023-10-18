/*
 * @Author: leo.si
 * @Date: 2019-04-28 09:45:09
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 16:01:26
 * @function h5与小程序的交互
 */
/**
 *
 * Creates a CurrentLimitingForMiniprogram.
 *
 * @returns {initial} The initial function is used to initialize JSSDK(1.3.2) in window
 *
 * @returns {h5InvokeMiniprogram} It is used to realize the connection between the widget and H5 current limiting page.
 * Currently, for current limiting through userId,
 * it is necessary for the widget to provide user information (userId, Token) in the form of URL parameters.
 *
 * @returns {judgeMiniprogramEnvironment} To determine whether it is in the widget environment,
 * use the wx. miniProgram. getEnv method provided by JSSDK (1.3.2) to determine whether it is in the widget environment.
 *
 * @returns {getParamsAndSetCookie} Get the URL parameter (userId, sephoraToken) and set the cookie (UID, Token)
 *
 * @returns {navigateBack} Return to the previous page through the wx.miniProgram.navigateBack method provided by JSSDK (1.3.2)
 */
import { isWeChat, warning, SetSingleCookie2, urlGetParams } from './lib/index'
export default function CurrentLimitingForMiniprogram() {
  return {
    initial: function({ callback } = {}) {
      if (!isWeChat()) return
      function setup(w, d, s, u) {
        const f = d.getElementsByTagName(s)[0]
        const j = d.createElement(s)
        j.async = true
        j.src = u
        f.parentNode.insertBefore(j, f)
        j.onerror = function() {
          warning('Wechat JSSDK failed to load')
        }
        j.onload = function() {
          callback && callback()
        }
      }
      if (typeof window !== 'undefined') {
        setup(window, document, 'script', 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js',)
      }
      return this
    },
    h5InvokeMiniprogram: function() {
      const that = this
      this.initial({ callback: () => {
        wx.miniProgram.getEnv(function(res) {
          if (res.miniprogram) {
            that.getParamsAndSetCookie()
          } else {
            warning('Currently not in a miniprogram environment')
          }
        })
      } })
    },
    judgeMiniprogramEnvironment: function() {
      let inMiniprogram = false
      try {
        wx.miniProgram.getEnv(function(res) {
          inMiniprogram = res.miniprogram
        })
      } catch (err) {
        warning('System error,currently not in a miniprogram environment')
      }
      return inMiniprogram
    },
    getParamsAndSetCookie: function() {
      if (!urlGetParams(window.location, 'userId')) return warning('userId not obtained')
      if (!urlGetParams(window.location, 'sephoraToken')) return warning('sephoraToken not obtained')
      SetSingleCookie2({ key: 'UID', value: urlGetParams(window.location, 'userId'), domain: '.sephora.cn' })
      SetSingleCookie2({ key: 'Token', value: urlGetParams(window.location, 'sephoraToken'), domain: '.sephora.cn' })
    },
    navigateBack: function() {
      try {
        wx && wx.miniProgram && wx.miniProgram.navigateBack({})
      } catch (err) {
        warning('System error, failed to return to previous page')
      }
    },
  }
}
