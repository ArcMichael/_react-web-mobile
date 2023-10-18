import GOOGLE_STATIC from "./google_static.json";

export function google_basic(pathname) {
  // PV static || activity
  const pageView = google_static(pathname) || google_activity(pathname) || {};
  pageView.timeString = window.timeString || null;
  pageView.time = new Date().valueOf();
  if (new RegExp("^/$").test(window.location.pathname)) {
    pageView.page_enname = "home_page";
  } else {
    let pagename =
      (window.location.pathname &&
        window.location.pathname.split("/") &&
        window.location.pathname.split("/")[1]) ||
      null;
    pagename = pagename ? `${pagename.replace(".html", "")}_page` : "";
    pageView.page_enname = pagename;
  }
  pageView.page_url = window.location.href;
  return pageView;
}
export function google_static() {
  let _static = false;
  GOOGLE_STATIC.map((data, ) => {
    if (new RegExp(data.regexp).test(window.location.pathname)) {
      _static = data.static;
    }
  });
  return _static;
}

export function google_activity(router) {
  if (!router) return false;
  return false;
}
