export function getScript({ url = null, options = { async: true } }) {
  if (!url) return false;
  const script = document.createElement("script");
  script.async = options.async;
  script.src = url;
  const container = document.getElementsByTagName("script")[0];
  container.parentNode.insertBefore(script, container);
}

export function getScriptV2({ url = null, options = { async: true }, cb = function () {} }) {
  if (!url) return cb({ results: false });
  const script = document.createElement("script");
  script.async = options.async;
  script.src = url;
  const container = document.getElementsByTagName("script")[0];
  container.parentNode.insertBefore(script, container);
  script.onload = function () {
    cb({ results: "Completed" });
  };
}

export function getLink({ url = null }) {
  if (!url) return false;
  const link = document.createElement("link");
  link.href = url;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.rev = "stylesheet";
  const container = document.getElementsByTagName("link")[0];
  container.parentNode.insertBefore(link, container);
}
