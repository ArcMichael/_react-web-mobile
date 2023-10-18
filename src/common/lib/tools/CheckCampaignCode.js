/**
 * 用来校验传入的url 是否配置 track code
 * zoneTian
 * @param {string} link
 * @param {string?} omniture
 */
export default function CheckCampaignCode(link, omniture) {
  if (/intcmp=|kwrec=|prodlink=/.test(link)) {
    return link;
  }
  if (!omniture || omniture === "") {
    return link;
  }
  let hashNum = "";
  let query = link.split("?")[1] || null;
  let omni = omniture.split("?")[1] || omniture.split("?")[0];
  omni = omni.split("&")[1] || omni.split("&")[0];
  let domain = link.split("?")[0];
  if (/#/.test(link) || /#/.test(omniture)) {
    const linkHash = link.split("#")[1] || "";
    const omnitureHash = omniture.split("#")[1] || "";
    domain = domain.split("#")[0];
    hashNum =
      linkHash && omnitureHash ? `#${linkHash}&${omnitureHash}` : `#${linkHash}${omnitureHash}`;
    query = (link.match(/\?(\S*)\#/) && link.match(/\?(\S*)\#/)[1]) || null;
  }
  return query ? `${domain}?${query}&${omni}${hashNum}` : `${domain}?${omni}${hashNum}`;
}
