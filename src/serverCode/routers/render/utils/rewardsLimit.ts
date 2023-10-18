import getConfigs from "isomorphisms/getConfigs";
import { matchPath } from "react-router";
import request from "../../../utils/request";

const limitingPages = [
  "/v2/html/rewardsBoutique",
  "/v2/html/rewardsBrand/:id",
  "/v2/html/intergalDonate",
  "/v2/html/certificate",
  "/v2/html/exchangeList",
  "/v2/html/exchangeDetail/:id",
  "/v2/html/postmailSuccess/:recordId",
  "/v2/html/exchangeSuccess/:recordId",
  "/v2/html/exchangeReceiveSuccess/:recordId",
  "/v2/html/gainPoint",
];

const rewardsLimit = async (url: string) => {
  const configs = getConfigs();
  const isLimitPage = limitingPages.find((item) => {
    const match = matchPath(url, {
      path: item,
    });
    return match;
  });
  if (isLimitPage) {
    try {
      const res: any = await request(
        `https://${configs.api}/v1/rewards-boutique/integral_donate/getHtmlPage`,
        {
          method: "get",
        }
      );
      return res.status;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return null;
};

export default rewardsLimit;
