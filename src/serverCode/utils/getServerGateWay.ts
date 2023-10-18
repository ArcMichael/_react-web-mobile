import { DevUtils, CommonApps } from "@sephora/eureka";
import { RUN_ENV_ENUM } from "@sephora/configs";
import getConfigs from "../../isomorphisms/getConfigs";

const getServerGateWay = async () => {
  const configs = getConfigs();
  if (process.env.RUN_ENV) {
    return configs.gatewayShortDomain;
  }
  const devUtils = new DevUtils(
    (process.env.LOCAL_RUN_ENV || RUN_ENV_ENUM.stage) as RUN_ENV_ENUM
  );
  const gateway = await devUtils.getDevGatewayAddr(
    CommonApps.GATEWAY,
    (process.env.LOCAL_RUN_ENV || RUN_ENV_ENUM.stage) as RUN_ENV_ENUM
  );
  return gateway;
};
export default getServerGateWay;
