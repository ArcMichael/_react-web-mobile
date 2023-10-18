export const getBffTestUrl = () => {
  if (typeof window !== "undefined") {
    if (window.__INITIAL_ENV__.Env.restfulEnv === "stage") {
      return "http://10.157.26.152:60020";
    }
  }
  return null;
};

export const qsStringify = params => {
  if (typeof params === "object") {
    let s = "";
    const keys = Object.keys(params);
    keys.forEach((key, index) => {
      s += `${key}=${params[key]}${index === keys.length - 1 ? "" : "&"}`;
    });
    return s;
  }
  return "";
};
