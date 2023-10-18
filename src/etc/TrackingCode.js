import $ from "jquery";
import PageIdMap from './pageIdMap'

if (typeof window !== "undefined" && !window.__JEST__) {
  $(document).ready(function () {
    if (!(window && window.__INITIAL_ENV__)) return;
    function getScript(url = null, options = { async: true }) {
      if (!url) return false;
      const script = document.createElement("script");
      script.async = options.async;
      script.src = url;
      const container = document.getElementsByTagName("script")[0];
      container.parentNode.insertBefore(script, container);
    }

    // sensor suid
    if (typeof window.GetSingleCookie === "function") {
      if (
        !window.GetSingleCookie(document.cookie, "sepcuid") ||
        !window
          .GetSingleCookie(document.cookie, "sepcuid")
          .match(
            /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/
          )
      ) {
        $.post("/api/SOA/authentication/sepcuid");
      }
    }
    function get_os(os = "") {
      if (os) return os;
      const clientStrings = [
        { s: "Android", r: /Android/ },
        { s: "iOS", r: /(iPhone|iPad|iPod)/ },
      ];
      for (const id in clientStrings) {
        const cs = clientStrings[id];
        if (cs.r.test(navigator.userAgent)) {
          os = cs.s;
          break;
        }
      }
      return os;
    }
    function isWeChat() {
      if (
        /(micromessenger|webbrowser)/.test(
          navigator.userAgent.toLocaleLowerCase()
        )
      ) {
        return true;
      }
      return false;
    }
    function get_device(device) {
      if (device) return device;
      // if (/(micromessenger|webbrowser)/.test(navigator.userAgent.toLocaleLowerCase())) return 'wechat'
      if (isWeChat()) return "MiniProgram";
      if (navigator.userAgent.match(/sephora\/app/)) return "app";
      return "mobile";
    }

    // sensor setup
    function sensor_setup(staticUrl) {
      let env = null;
      let stat = null;
      let config = {};
      if (staticUrl.restfulEnv) env = staticUrl.restfulEnv;
      if (staticUrl.static) stat = staticUrl.static;

      if (env && stat) {
        config = setup_configuration(env, stat);
      }

      if (env === "qa2" || env === "stage" || env === "production") {
        const para = config;
        const p = para.sdk_url;
        const n = para.name;
        const w = window;
        const d = document;
        const s = "script";
        let x = null;
        let y = null;
        w.sensorsDataAnalytic201505 = n;
        w[n] =
          w[n] ||
          function (a) {
            return function () {
              (w[n]._q = w[n]._q || []).push([a, arguments]);
            };
          };
        const ifs = [
          "track",
          "quick",
          "register",
          "registerPage",
          "registerOnce",
          "clearAllRegister",
          "trackSignup",
          "trackAbtest",
          "setProfile",
          "setOnceProfile",
          "appendProfile",
          "incrementProfile",
          "deleteProfile",
          "unsetProfile",
          "identify",
          "login",
          "logout",
          "trackLink",
          "clearAllRegister",
        ];
        for (let i = 0; i < ifs.length; i++) {
          if (typeof w[n] === "function") {
            w[n][ifs[i]] = w[n].call(null, ifs[i]);
          }
        }
        if (!w[n]._t) {
          (x = d.createElement(s)), (y = d.getElementsByTagName(s)[0]);
          x.async = 1;
          x.src = p;
          y.parentNode.insertBefore(x, y);
          w[n].para = para;
        }
        const obj = {};
        w.timeString =
          String(new Date().valueOf()) +
          String(Math.floor(Math.random() * 1000));
        obj.timeString = w.timeString;
        obj.sensorTime = new Date().valueOf();
        w[n].registerPage({
          current_url: w.location.href,
          platform_type: get_device(),
          system_type: get_os(),
          environment_type: env,
          referrer:
            typeof document !== "undefined" &&
              typeof document.referrer === "string"
              ? document.referrer
              : "",
          ...PageIdMap()
        });
        w[n].quick("autoTrack", { ...obj, ...window.pageType, });
        // window.pageType = Object.assign(window.pageType, obj)
      }
    }
    // sensor configuration

    // 1.4.1 普通参数
    // 普通参数对代码埋点和可视化埋点都有效，下面是必填参数：

    // sdk_url: sensorsdata.min.js 文件的地址，请从 GitHub 获取并且放在你们自己网站目录下。
    // name: SDK 使用的一个默认的全局变量，如定义成 sa 的话，后面接可以使用 sa.track() 用来跟踪信息。为了防止变量名重复，你可以修改成其他名称比如 sensorsdata 等 。
    // server_url: 数据接收地址。
    // heatmap_url: （1.9以上版本新加） heatmap.min.js 文件的地址，在热力分析渲染页面时会用到，采集数据时候不会加载。
    // 如果有需要，也可以修改可选参数：

    // cross_subdomain: 设置成 true 后，表示在根域下设置 cookie 。也就是如果你有 zhidao.baidu.com 和 tieba.baidu.com 两个域，且有一个用户在同一个浏览器都登录过这两个域的话，我们会认为这个用户是一个用户。如果设置成 false 的话，会认为是两个用户。默认 true。
    // show_log: 设置 true 后会在网页控制台打 logger，会显示发送的数据,设置 false 表示不显示。默认 true。
    // use_client_time: 因为客户端系统时间的不准确，会导致发生这个事件的时间有误，所以这里默认为 false ，表示不使用客户端时间，使用服务端时间，如果设置为 true 表示使用客户端系统时间。如果你在属性中加入 {$time: new Date()} ，注意这里必须是 Date 类型，那么这条数据就会使用你在属性中传入的这个时间。
    // source_channel: 默认取来源是根据 utm_source 等 ga 标准来的。如果你用的是百度统计的 hmsr 等参数。可以在这里面加入，参数必须是数组，比如 ['hmsr']。
    // source_type: 自定义搜索引擎流量，社交流量，搜索关键词。具体用法参考 7.10 。
    // is_single_page: 设置成 true 后， 表示在单页面开发的网站中，我们会对 hashchange 和 popstate 事件进行监听，当这两个事件任何一个发生时，也会发送 $pageview 事件。默认 false。详情参考 7.9 节。
    // is_track_device_id:设置成 true 后， 表示事件属性里面添加一个设备 id 的属性，存贮在 cookie 里面并发送。默认 false，记录但不发送。
    // send_type: 默认值 'image' 表示使用图片 get 请求方式发数据，( 神策系统 1.10 版本以后 ) 可选使用 'ajax' 和 'beacon' 方式发送数据，这两种默认都是 post 方式， beacon 方式兼容性较差，请参考 3.3.2 目录 。

    function setup_configuration(env, stat) {
      console.log(env, stat);
      switch (env) {
        case "stage":
          return {
            sdk_url: `${stat}/soa/public/js/sensor/1.15.11/sensorsdata.min.js`,
            name: "sa",
            server_url: "https://sensor.sephora.cn:8106/sa/?project=test",
            use_app_track: true,
            // web_url: 'https://sensor.sephora.cn:8106/config?project=default',
            heatmap_url: `${stat}/soa/public/js/sensor/1.15.11/heatmap.min.js`,
            heatmap: {
              clickmap: "default",
              scroll_notice_map: "default",
              loadTimeout: 3000,
              collect_input() {
                return true;
              },
              element_selector: "not_use_id",
              renderRefreshTime: 1000,
              scroll_delay_time: 4000,
            },
          };
        case "production":
          return {
            sdk_url: `${stat}/soa/public/js/sensor/1.15.11/sensorsdata.min.js`,
            name: "sa",
            server_url: "https://sensor.sephora.cn:8106/sa/?project=default",
            use_app_track: true,
            // web_url: 'https://sensor.sephora.cn:8106/config?project=default',
            show_log: false,
            heatmap_url: `${stat}/soa/public/js/sensor/1.15.11/heatmap.min.js`,
            heatmap: {
              clickmap: "default",
              scroll_notice_map: "default",
              loadTimeout: 3000,
              collect_input() {
                return true;
              },
              element_selector: "not_use_id",
              renderRefreshTime: 1000,
              scroll_delay_time: 4000,
            },
          };
        case "qa2":
          return {
            sdk_url: `${stat}/soa/public/js/sensor/1.15.11/sensorsdata.min.js`,
            name: "sa",
            server_url: "https://sensor.sephora.cn:8106/sa/?project=test",
            use_app_track: true,
            // web_url: 'https://sensor.sephora.cn:8106/config?project=default',
            heatmap_url: `${stat}/soa/public/js/sensor/1.15.11/heatmap.min.js`,
            show_log: true,
            heatmap: {
              clickmap: "default",
              scroll_notice_map: "default",
              loadTimeout: 3000,
              collect_input() {
                return true;
              },
              element_selector: "not_use_id",
              renderRefreshTime: 1000,
              scroll_delay_time: 4000,
            },
          };
        default:
          return {};
      }
    }
    sensor_setup(window.__INITIAL_ENV__.Env);

    if (/^\/public\/?/.test(window.location.pathname)) return;

    if (
      /^\/v2\/html\/currentLimiting?/.test(window.location.pathname) &&
      /sephora\/app/.test(window.navigator.userAgent)
    ) {
      return;
    }

    if (
      /^\/campaign\/?/.test(window.location.pathname) &&
      /sephora\/app/.test(window.navigator.userAgent)
    ) {
      return;
    }
    if (
      /^\/beautyCommunity\/?/.test(window.location.pathname) &&
      /sephora\/app/.test(window.navigator.userAgent)
    ) {
      return;
    }
    if (
      /^\/weeklyspecials\/?/.test(window.location.pathname) &&
      /sephora\/app/.test(window.navigator.userAgent)
    ) {
      return;
    }
    if (
      isWeChat() === false &&
      /sephora\/app/.test(window.navigator.userAgent) === false
    ) {
      window.addEventListener(
        "load",
        function (e) {
          // baidu
          getScript("//hm.baidu.com/hm.js?26a309555c3997e904c1aac405e80335");
          // 360
          getScript("//s.union.360.cn/75002.js", { async: false });
          // peerless
          getScript("//t.agrantsem.com/tg.js?ang_tj=true&c=AG_075602_MDYR&t=1");
          // SEPbridge
          // YOOULAN_START
          let YLTrackerz = (window.YLTrackerz = []);
          YLTrackerz = {
            mid: 9,
            ers: [{ type: "pageview" }],
            track(er) {
              this.ers.push(er);
            },
          };
          getScript(
            document.location.protocol === "https:"
              ? "https://sstatic.bla01.com/s.js"
              : "http://static.bla01.com/s.js"
          );

          const noscript = document.createElement("noscript");
          noscript.innerHTML =
            '<iframe src="//www.googletagmanager.com/ns.html?id=GTM-N57TLT" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
          document.body.insertBefore(noscript, document.body.firstElementChild);
        },
        false
      );
    }
  });
}
