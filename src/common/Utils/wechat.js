import * as script from '../lib/script'

export const setupWeChat = ({ callback = function () { } }) => {
  if (window.wx && window.wx.miniProgram) return false
  script.getScriptV2({
    //url: 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js', cb: function(json) {callback(json)},
    url: 'https://res.wx.qq.com/open/js/jweixin-1.3.2.js', cb: function (json) { callback(json) },
  })
}

