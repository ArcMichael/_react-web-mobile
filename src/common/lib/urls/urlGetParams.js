import urlGetAllParams from "./urlGetAllParams";

// 获取单个参数
export default function urlGetParams(location, name) {
  return urlGetAllParams(location)[name] || false;
}
