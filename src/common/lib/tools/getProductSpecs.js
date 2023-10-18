/**
 * 获取产品的规格显示
 */
const getProductSpecs = (params = {}) => {
  let productSpecs = "";
  // if (params && params.spec) productSpecs = `${params.spec}`
  if (params && params.specType)
    productSpecs = `${params && params.spec}${
      params.specType === "weight" ? "g" : params.specType === "volume" ? "ml" : ""
    }`;
  productSpecs = productSpecs
    ? `${productSpecs}${(params && params.custom && `,${params.custom}`) || ""}`
    : (params && params.custom) || "";
  return productSpecs ? `规格:${productSpecs}` : "";
};

export default getProductSpecs;
