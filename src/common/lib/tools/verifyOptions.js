// plp 路由参数校验
const verifyOptions = (params, types, defValue) => {
  const regexCheck = {
    number: "^[0-9]*$",
  };
  if (params === "" || params === 0 || !String(params).match(new RegExp(regexCheck[types]))) {
    return defValue;
  }
  return false;
};

export default verifyOptions;
