import getConfigs from "isomorphisms/getConfigs";
import CheckCampaignCode from "./CheckCampaignCode";

const configs = getConfigs();
/**
 *
 * @param {object} params
 * @param {string} params._Omniture
 * @param {string} params._Href
 * @param {string?} params._Https
 */
const getTrackingHref = (params) => {
  const { _Omniture, _Href, _Https } = params;
  let Href = _Href || "#";
  const Https = _Https || null;
  if (Https === "https" && _Href) {
    Href = configs.abtest + _Href;
  }
  if (Https === "http" && _Href) {
    Href = _Href;
  }
  if (!Href.match(/intcmp=|kwrec=|prodlink=/)) {
    const href = CheckCampaignCode(Href, _Omniture);
    return href;
  }
  return Href;
};

export default getTrackingHref;
