import { typeofString } from ".";

export function wxBack(ua, redirectPage) {
  if (!window.history.pushState || !document.dispatchEvent) return;
  if (!redirectPage || !typeofString(redirectPage)) return;
  if (
    ua.match(/(iPhone\sOS)\s([\d_]+)/) &&
    /(micromessenger|webbrowser)/.test(ua.toLocaleLowerCase())
  ) {
    pushHistory();
    var bool = false;
    setTimeout(function () {
      bool = true;
    }, 1500);
    window.addEventListener(
      "popstate",
      function () {
        if (bool) {
          location.href = redirectPage;
        }
        pushHistory();
      },
      false,
    );
  }
}

export function pushHistory() {
  var state = {
    title: "title",
    url: "#",
  };
  window.history.pushState(state, "title", "#");
}
