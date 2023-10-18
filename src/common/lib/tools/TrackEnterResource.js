import getLocationQuery from "@/Utils/utils/getLocationQuery";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import SetTimeCookie from "./SetTimeCookie";
import SetForeverCookie from "./SetForeverCookie";
import SetSingleCookie2 from "./SetSingleCookie2";

export default function TrackEnterResource() {
  const query = getLocationQuery();
  const utm_source = query.utm_source;
  const utm_medium = query.utm_medium;
  const utm_campaign = query.utm_campaign;
  const utm_content = query.utm_content;
  const utm_term = query.utm_term;
  const benefit_code = query.code;
  if (utm_source || utm_medium || utm_campaign || utm_content || utm_term) {
    const j = {};
    j.utm_source = encodeURIComponent(utm_source);
    j.utm_medium = encodeURIComponent(utm_medium);
    j.utm_campaign = encodeURIComponent(utm_campaign);
    j.utm_content = encodeURIComponent(utm_content);
    j.utm_term = encodeURIComponent(utm_term);
    j.currentTime = String(new Date().getTime());
    const stringjson = JSON.stringify(j);
    SetTimeCookie("order_source", stringjson);
    if (!GetSingleCookie2({ key: "first_touch_source" })) {
      SetForeverCookie("first_touch_source", stringjson);
    }
  }
  if (benefit_code) {
    const URI_code = encodeURIComponent(benefit_code);
    const string_code = JSON.stringify(URI_code);
    // SetTimeCookie('benefit_code', string_code);
    SetSingleCookie2({
      key: "benefit_code",
      domain: ".sephora.cn",
      value: string_code,
    });
  }
}
