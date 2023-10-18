import GetParamsByUrl from "./GetParamsByUrl";

/**
 * 获取全部URL参数
 * @param {Location} location
 * @return Obejct || {}
 */
export default function urlGetAllParams(location) {
  return GetParamsByUrl(location.search);
}
