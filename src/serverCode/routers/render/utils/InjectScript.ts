import type { Url } from "url";
import getConfigs from "isomorphisms/getConfigs";
import { matchPath } from "react-router";
import getPxToRem from "./getPxToRem";

const configs = getConfigs();

/**
 * @typedef {import('../../common/reducers').RootState} RootState
 * */

export default class InjectScript {
  static AllowPaths = {
    shumei: [
      "/checkout",
      "/login",
      "/orderPaymentSuccess",
      "/order-",
      "/register",
      "/",
      "/myAccount",
      "/cart",
      "/product/:id.html",
    ],
    bridge: ["/v2/html/lipQuiz.html"],
    adhoc: ["/search/v2", "/search"],
    preconnect: ["/", "/homepage", "/homepage/:tab"],
  };

  static isAllowUrl = (Url: Url, allowPaths: string[]) => {
    return allowPaths.find((item) => Url.pathname && Url.pathname.indexOf(item) >= 0);
  };
  static isMatch = (Url: Url, allowPaths: string[]) => {
    return allowPaths.find((item) => {
      const match = matchPath(Url.pathname as string, {
        path: item,
        exact: true,
      });
      return Boolean(match);
    });
  };

  static DominPreconnect = (Url: Url) => {
    const allowUrl = InjectScript.isMatch(Url, InjectScript.AllowPaths.preconnect);
    if (allowUrl) {
      return `
      <link rel="preconnect" href="https://recommender.scarabresearch.com">
      <link rel="preconnect" href="${configs.static}">
      <link rel="preconnect" href="https://${configs.api}">
      `;
    }
    return "";
  };

  static ShumeiScript = (Url: Url) => {
    const allowUrl = InjectScript.isMatch(Url, InjectScript.AllowPaths.shumei);
    if (allowUrl) {
      return `<script>     
        (function() {
            window._smReadyFuncs = [];
            window.SMSdk = {
                ready: function(fn) {
                    fn && _smReadyFuncs.push(fn);
                }
            };

            window._smConf = {
                organization: 'qfoShxSauZWl8mZDzd9Z', 
                staticHost: 'ssl1.sephorastatic.cn/soa/public/js/fengkong/shumei',
                apiHost:'fengkong.sephora.cn',
            };

            var url = (function () {
                var originHost = "ssl1.sephorastatic.cn/soa/public/js/fengkong/shumei";
                var protocol = 'https://';
                var fpJsPath = '/fpv2.js';
                var url =  protocol + _smConf.staticHost + fpJsPath;
                var ua = navigator.userAgent.toLowerCase();
                var isWinXP = /windows\s(?:nt\s5.1)|(?:xp)/.test(ua);
                var isLowIE = /msie\s[678]\.0/.test(ua);

                if(isWinXP && isLowIE) {
                    url = protocol + originHost + fpJsPath;
                }

                return url;
            })();
            var sm = document.createElement("script");
            var s = document.getElementsByTagName("script")[0];
            sm.src = url;
            s.parentNode.insertBefore(sm, s);
        })();
    </script>`;
    }
    return "";
  };

  static BridgeScript = (Url: Url) => {
    const allowUrl = InjectScript.isAllowUrl(Url, InjectScript.AllowPaths.bridge);
    if (allowUrl) {
      const host = configs.static;
      return `<script src="${host}/soa/public/js/sep_invoke/SEPBridge_1.5.6.js"></script>`;
    }
    return "";
  };

  static tingyun = () => {
    return process.env.RUN_ENV === "production"
      ? `<script async defer src="${configs.static}/soa/mobile/js/tingyun/3.3.0/pro-sephora-node-mobile.js"></script>`
      : `<script async defer src="${configs.static}/soa/mobile/js/tingyun/3.3.0/test-sephora-node-mobile.js"></script>`;
  };

  static PerformanceEvent = () => {
    return `
      <script>
        var PAGESHOWSTATUS = false;
        const consoleColor = "background:#7cb305; color:#fff;";
        window.addEventListener("pageshow", function pageshow() {
          console.log(\`%c PageShow : \`, consoleColor, true);
          window.PAGESHOWSTATUS = true;
          window.removeEventListener("pageshow", pageshow);
        });
        document.addEventListener(
          "readystatechange",
          function readyStateChange() {
            if (document.readyState === "complete") {
              console.log(
                \`%c document.readState : \`,
                consoleColor,
                document.readyState
              );
              window.removeEventListener("readystatechange", readyStateChange);
            }
          }
        );
      </script>
    `;
  };
  static PxtoRem = () => {
    return getPxToRem();
  };

  static Boomr = () => {
    return `
    <script>
          (function(){
              if(window.location && window.location.host.match(/oia/)){return;}
              if(window.BOOMR && window.BOOMR.version){return;}
              var dom,doc,where,iframe = document.createElement("iframe"),win = window;
          
              function boomerangSaveLoadTime(e) {
              win.BOOMR_onload=(e && e.timeStamp) || new Date().getTime();
              }
              if (win.addEventListener) {
              win.addEventListener("load", boomerangSaveLoadTime, false);
              } else if (win.attachEvent) {
              win.attachEvent("onload", boomerangSaveLoadTime);
              }
          
              iframe.src = "javascript:false";
              iframe.title = ""; iframe.role="presentation";
              (iframe.frameElement || iframe).style.cssText = "width:0;height:0;border:0;display:none;";
              where = document.getElementsByTagName("script")[0];
              where.parentNode.insertBefore(iframe, where);
          
              try {
              doc = iframe.contentWindow.document;
              } catch(e) {
              dom = document.domain;
              iframe.src="javascript:var d=document.open();d.domain='"+dom+"';void(0);";
              doc = iframe.contentWindow.document;
              }
              doc.open()._l = function() {
              var js = this.createElement("script");
              if(dom) this.domain = dom;
              js.id = "boomr-if-as";
              js.src = "https://s.go-mpulse.net/boomerang/" +
              "4R5YB-FZH58-UPUGS-8Q45T-7X78C";
              BOOMR_lstart=new Date().getTime();
              this.body.appendChild(js);
              };
              doc.write('<body onload="document._l();">');
              doc.close();
          })();
      </script>
    `;
  };

  static Emarsys = () => {
    return `
    <script>
        var ScarabQueue = ScarabQueue || [];

        (function(id){
            if(document.getElementById(id)){
                return;
            }
            var js = document.createElement('script');
            js.id = id;
            js.src = 'https://recommender.scarabresearch.com/js/18BC49C88D345FEB/scarab-v2.js';
            var fs = document.getElementsByTagName('script')[0];
            fs.parentNode.insertBefore(js, fs);
        })('scarab-js-api')
        
    </script>
    `;
  };

  static ADHOC = (Url: Url) => {
    const allowUrl = InjectScript.AllowPaths.adhoc.find(
      (item) => Url.pathname && Url.pathname.indexOf(item) >= 0,
    );
    const scriptSrc = `${configs.static}/soa/public/js/adhoc.ab.plus.js`;
    if (allowUrl) {
      return `<script  type="text/javascript">
      window.__ADHOC_EXP_URL__ = "https://abexperiment.sephora.cn/experiment/get_flags_async";
      window.__ADHOC_TRACKER_URL__ = "https://abexperiment.sephora.cn/tracker/tracker";
    </script>
    <script src="${scriptSrc}" charset="utf-8"></script>
    <script type="text/javascript">
        var adhoc_params = (function urlGetAllParams(location) {
            var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
                args = {},
                items = qs.length ? qs.split("&") : [],
                item = null,
                name = null,
                value = null,
                i = 0,
                len = items.length;
            for (i = 0; i < len; i++) {
                item = items[i].split("=");
                name = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1]);
                if (name.length && value) {
                    args[name] = value;
                }
            }
            return args;
        })(window.location),
            adhoc_main = {},
            adhoc_custom = {
              'platform':(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger")?'wechat':'mobile'
              };
        for (let i in adhoc_params) {
            if (i.match(/adhoc\_/)) {
                if (adhoc_custom === null) adhoc_custom = {};
                adhoc_custom[i] = adhoc_params[i]
            }
        }
        adhoc_main.appKey = 'ADHOC_9c5e9bbb-aa28-4276-bdb7-d84e2a5536a0';
        if("${process.env.RUN_ENV}"==='stage'){
          adhoc_main.appKey = 'ADHOC_c0779307-7668-46af-81eb-03396e9dc741';
        }
        adhoc_main.crossDomain = 'sephora.cn'; 
        adhoc_main.defaultFlags = { searchpv : 0 }; 
        if (adhoc_custom) {
            adhoc_main.custom = adhoc_custom
        }
        adhoc('init', adhoc_main)
    </script>`;
    }
    return "";
  };
  // Url: any 入参
  static ShumeiSMCPScript = () => {
    // const allowPaths = ["/login", "/loginTwo", "/resetTwo","/v2/html/bindPhone", "/register"];
    // const allowUrl = InjectScript.isMatch(Url, allowPaths);
    // if (allowUrl) {
      return `<script src='https://ssl1.sephorastatic.cn/soa/public/js/fengkong/shumei/captcha-js-img/pr/v1.0.3/smcp.min.js'></script>`;
    // }
    // return "";
  };
}
