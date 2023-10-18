// 判断plp类型，分类、搜索、品牌、礼物、独家、去使用、热搜
const judgeTypeOfPlp = () => {
  if (typeof window !== "undefined") {
    const href = window.location.pathname;
    const typeReg = {
      category: /category|categories/, // 分类
      giftSet: /gift_set/, // 礼物套装
      couponSet: /coupon_set/, // 优惠券去使用
      exclusive: /exclusive_product/, // 独家销售
      search: /search/, // 搜索结果
      hot: /hot/, // 热搜词
      brand: /brand|brands/, // 品牌
      purchaserecordcon: /\/purchaserecord.html/,
      vaproductlist: /\vaproductlist.html/,
    };
    return Object.keys(typeReg).find((type) => typeReg[type].test(href));
  }
  return undefined;
};

export default judgeTypeOfPlp;
