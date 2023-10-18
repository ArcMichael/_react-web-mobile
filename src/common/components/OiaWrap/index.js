import isBrowser from "@/Utils/utils/isBrowser";
import Download from "../../containers/Download";

const OiaWrap = (component) => {
  if (isBrowser() && window.location.host.match(/oia/)) {
    return Download;
  }
  return component;
};

export default OiaWrap;
