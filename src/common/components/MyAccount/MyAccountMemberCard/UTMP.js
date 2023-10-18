export default {
  cardImageUrl: "",
  benefitsInfo: "",
  cardImageText: "",
  cardNo: "",
  changeMemberUrl: "whetherChangeCard",
  currentIndex: "0",
  cardTypeMapping: {
    PINK: ["粉卡会员", 0],
    WHITE: ["白卡会员", 1],
    BLACK: ["黑卡会员", 2],
    GOLDEN: ["金卡会员", 3],
    EMPLOYEE: ["员工账号", 4],
    TEST: ["测试账号", 5],
    O2O: ["BA账号", 6],
    BACKEND: ["无卡会员", 7],
  },
  userGroup: ["PINK", "WHITE", "BLACK", "GOLDEN"],
  cardImage: {
    PINK: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_pinkVip.png",
    WHITE: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_newWhite.png",
    BLACK: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_blackVip.png",
    GOLDEN: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_glodenVip.png",
    EMPLOYEE: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/defaultVip.png",
    TEST: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/defaultVip.png",
    O2O: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/defaultVip.png",
    BACKEND: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/defaultVip.png",
  },
  cardList: [
    {
      cardImageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/sephoraPink.png",
      cardText: "粉卡",
      cardType: "PINK",
    },
    {
      cardImageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/sephoraWhite.png",
      cardText: "白卡",
      cardType: "WHITE",
    },
    {
      cardImageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/sephoraBlack.png",
      cardText: "黑卡",
      cardType: "BLACK",
    },
    {
      cardImageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/sephoraGolden.png",
      cardText: "金卡",
      cardType: "GOLDEN",
    },
  ],
  equityImageList: [
    {
      isTitle: true,
      titleText: "会员权益",
      titleLinkCon: "查看详情>",
      titleLink: "/content/card",
      className: "myAccount_integral_member_card_equity_title",
    },
    {
      imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/newPeopleGift.png",
      text: "新人礼包",
      className: "sepcial_li",
      belong: [3, 5, 9, 11],
      content:
        "新注册会员专享礼包\n含优惠券2张:\n满199减20元(仅限丝芙兰自有品牌)\n满299减30元(仅限丝芙兰独家品牌)",
      CTAText: "查看优惠券",
      linkUrl: "/myAccount/myCoupon",
    },
    // {
    //   imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_trendInformation.png",
    //   text: "潮流资讯",
    //   className: "sepcial_li",
    //   belong: [3, 5, 9, 11],
    //   content: "关注丝芙兰公众微信平台或邮箱订阅丝芙兰会员邮件，\n获取更多丝芙兰官方独家优惠活动信息与新品资讯。",
    //   CTAText: "查看详情",
    // },
    {
      imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_beautyService.png",
      text: "美妆服务",
      className: "",
      belong: [3, 5, 9, 11],
      content:
        "15分钟美妆定制 \n无瑕底妆、精致美眉、自然眼妆、魅惑美唇、致胜眼线等轻松打造专属妆容，精致局部妆容定制\n\n全妆美力定制\n 日常通勤妆、甜蜜约会妆、闪耀派对妆，三款精致妆容免费体验",
      CTAText: "确认",
    },
    {
      imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_newProductTrial.png",
      text: "新品试用",
      className: "",
      belong: [3, 5, 9, 11],
      content:
        "口碑护肤、人气彩妆、馥郁香氛、\n大牌新品、热门夯货付邮即试，\n享不停的宠爱，是你的专属礼遇！",
      CTAText: "确认",
    },
    {
      imageUrl:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_cumulativeIntegral.png",
      text: "累计积分",
      className: "",
      belong: [3, 5, 9, 11],
      content:
        "消费即可获得专属会员积分，消费1元=1分， 积分有效期限为1年，新获得的积分有效期自积分到账之日起连续12个月，且至第12个月的倒数第二个自然日届满。",
      // {
      //   GOLDEN: "消费即可获得专属会员积分，消费1元=1分，1500积分可自动生成一张九折券，可用于购物使用。",
      //   BLACK: "消费即可获得专属会员积分，消费1元=1分，1500积分可自动生成一张九折券，可用于购物使用。",
      //   WHITE:
      //     "消费即可获得专属会员积分，消费1元=1分。积分有效期限为1年，每一笔当月生效的积分将在次年对应月月底到期；对于有效期内未成功升级至黑卡或金卡的白卡会员，该笔积分将自动清零。1500积分可自动生成一张九折券，可用于购物使用。",
      //   PINK: "消费即可获得专属会员积分，消费1元=1分，1500积分可自动生成一张九折券，可用于购物使用。",
      // },
      linkUrl: "/myAccount/integralFlow",
      CTAText: "查看详情",
    },
    {
      imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_couponExchange.png",
      text: "积分随心兑",
      className: "",
      belong: [3, 5, 9, 11],
      content:
        "可用账户中现有积分兑换积分商城中对应档位的好礼，线上兑换需随单赠送；门店兑换需到店以实际门店库存为准",
      CTAText: "查看详情",
      linkUrl: "/v2/html/rewardsBoutiqueGuide",
    },
    {
      imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_beautifulBirthday.png",
      text: "精美生日礼",
      className: "",
      belong: [3, 5, 9, 11],
      content: {
        GOLDEN:
          "金卡专属三重生日礼遇\n心意之选320元好礼门店专享\n臻享100元电子礼券,限App、小程序、官网使用\n生日月享受一次双倍积分",
        BLACK:
          "黑卡专属三重生日礼遇，\n惊喜礼献80元好礼门店专享，\n臻享50元电子礼券，限App、小程序、官网使用，\n生日月享受一次双倍积分。",
        WHITE:
          "金卡专属三重生日礼遇\n心意之选320元好礼门店专享\n臻享100元电子礼券，限App、小程序、官网使用\n生日月享受一次双倍积分\n黑卡专属三重生日礼遇，\n惊喜礼献80元好礼门店专享，\n臻享50元电子礼券，限App、小程序、官网使用，\n生日月享受一次双倍积分。",
        PINK: "金卡专属三重生日礼遇\n心意之选320元好礼门店专享\n臻享100元电子礼券，限App、小程序、官网使用\n生日月享受一次双倍积分\n黑卡专属三重生日礼遇，\n惊喜礼献80元好礼门店专享，\n臻享50元电子礼券，限App、小程序、官网使用，\n生日月享受一次双倍积分。",
      },
      CTAText: "查看详情",
    },
    {
      imageUrl:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_birthdayMonthDoubleIntegral.png",
      text: "生日月双倍积分",
      className: "",
      belong: [3, 5, 9, 11],
      content: {
        GOLDEN: "生日当天起一个月内的第一笔订单享受一次双倍积分礼遇，邂逅奇迹礼赞，尊享双倍幸运。",
        BLACK: "生日当天起一个月内的第一笔订单享受一次双倍积分礼遇，邂逅奇迹礼赞，尊享双倍幸运。",
        WHITE:
          "金黑卡会员可专享生日当天起一个月内的第一笔订单享受一次双倍积分礼遇，邂逅奇迹礼赞，尊享双倍幸运",
        PINK: "金黑卡会员可专享生日当天起一个月内的第一笔订单享受一次双倍积分礼遇，邂逅奇迹礼赞，尊享双倍幸运",
      },
      CTAText: "查看详情",
    },
    {
      imageUrl: "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_membershipWeek.png",
      text: "美力特权 私享折扣",
      className: "sepcial_li",
      belong: [3, 5, 9, 11],
      content: "不定期美力特权活动，金黑卡专属特权，邂逅独家折扣，探索更多美力可能。",
      CTAText: "查看详情",
      linkUrl: "/",
    },
    {
      imageUrl:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_memberblackandgold.png",
      text: "黑金专属升级优惠券",
      className: "",
      belong: [3, 5, 9, 11],
      content:
        "首次升级成为黑卡或金卡会员可获赠至高价值200元的升级礼：全场任意消费满599元立减100元，或满1099元立减200元。",
      CTAText: "查看优惠券",
      linkUrl: "/myAccount/myCoupon",
    },
    {
      imageUrl:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_earlyAdmissionPrivilege.png",
      text: "抢先购",
      className: "",
      belong: [3, 5, 9, 11],
      content: "金卡会员独享尊贵臻宠，独家折扣抢先入场，提前锁定心意好物。",
      CTAText: "查看详情",
      linkUrl: "/",
    },
    {
      imageUrl:
        "https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/new_zunmeiMembershipDay.png",
      text: "尊美会员日",
      className: "",
      belong: [3, 5, 9, 11],
      content:
        "预约进店，尽享多重会员独家专属礼遇，\n定制妆容、贴心专业顾问指导，\n更有大牌新品，等你抢鲜试用！",
      CTAText: "立即预约",
      linkUrl:
        "https://www.sephora.cn/login?historyLocation=https%3A%2F%2Fm.sephora.cn%2Fcampaign%2Fcrm%2FPrestigeBeauty%2Findex.html%3Fsms%3D1",
    },
  ],
};
