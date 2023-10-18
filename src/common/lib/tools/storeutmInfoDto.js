import urlGetParams from "../urls/urlGetParams";

// 存储用户数据来源
function storeutmInfoDto() {
  const utmSource = urlGetParams(window.location, "utm_source") || "";
  const utmMedium = urlGetParams(window.location, "utm_medium") || "";
  const utmTerm = urlGetParams(window.location, "utm_term") || "";
  const utmCampaign = urlGetParams(window.location, "utm_campaign") || "";
  const utmContent = urlGetParams(window.location, "utm_content") || "";
  if (!utmSource && !utmMedium && !utmTerm && !utmCampaign && !utmContent) return false;
  return {
    utmSource,
    utmMedium,
    utmTerm,
    utmCampaign,
    utmContent,
  };
}

export default storeutmInfoDto;
