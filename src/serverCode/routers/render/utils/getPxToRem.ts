const WIDTH1 = 280;
const WIDTH2 = 320;
const WIDTH3 = 375;
const WIDTH4 = 384;
const WIDTH5 = 411;
const WIDTH6 = 414;
const WIDTH7 = 412;
const WIDTH8 = 640;
const WIDTH9 = 360;
const WIDTH10 = 540;
const WIDTH11 = 768;
const WIDTH12 = 600;

const presetWidths = [
  WIDTH1,
  WIDTH2,
  WIDTH3,
  WIDTH4,
  WIDTH5,
  WIDTH6,
  WIDTH7,
  WIDTH8,
  WIDTH9,
  WIDTH10,
  WIDTH11,
  WIDTH12,
];

const getPresetRem = () => {
  return presetWidths
    .map((item) => {
      return `
        @media screen and (width: ${item}px) {
            html {
              font-size: ${100 * (item / 750)}px;
            }
        }
        `;
    })
    .join("");
};

const getPxToRem = () => {
  return `
  <style>
    ${getPresetRem()}
  </style>
  <script>
                (function (win) {
                    var doc = win.document;
                    var docEl = doc.documentElement;
                    change();
                    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", change, false);
                    function change() {
                    var devicePixelRatio = win.devicePixelRatio || 1;
                    if (devicePixelRatio >= 3) {
                        devicePixelRatio = 3
                    } else {
                        if (devicePixelRatio >= 2 && devicePixelRatio < 3) {
                        devicePixelRatio = 2
                        }
                    }
                    docEl.setAttribute("data-dpr", Math.floor(devicePixelRatio));
                    var width = docEl.getBoundingClientRect().width;
                    docEl.style.fontSize = 100 * (width / 750) + "px";
                    setTimeout(function () {
                        var width = docEl.getBoundingClientRect().width;
                        docEl.style.fontSize = 100 * (width / 750) + "px";
                    }, 500)
                    }
                })(window); 
            </script>
  `;
};

export default getPxToRem;
