import configs from "./configs";
import getRunEnv from "./getRunEnv";

const getConfigs = () => {
  let runEnv = getRunEnv();
  return configs[runEnv];
};

export default getConfigs;
