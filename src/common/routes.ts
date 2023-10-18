import loadable from "@loadable/component";
import { IAuthRouteProps } from "./AuthRoute";

const routes: IAuthRouteProps[] = [
  {
    path: "/",
    component: loadable(() => import("./containers/HomeB"), { ssr: true }),
  },
  {
    path: "/v2/html/nichefragrance",
    component: loadable(() => import("./containers/NicheFragrance"), {
      ssr: false,
    }),
  },
  {
    path: "/homepage",
    component: loadable(() => import("./containers/HomeB"), { ssr: true }),
  },

  {
    path: "/homepage/:tab",
    component: loadable(() => import("./containers/HomeB"), { ssr: true }),
  },
  {
    path: "/myAccount/issueInvoice",
    component: loadable(() => import("./containers/Invoice"), { ssr: false }),
  },

  {
    path: "/v2/html/currentLimiting",
    component: loadable(() => import("./containers/Currentlimiting"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/offlineService",
    component: loadable(() => import("./containers/OfflineService"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/mgmTrialApplication",
    component: loadable(() => import("./containers/MgmTrialApplication"), {
      ssr: false,
    }),
  },
  {
    path: "/v2/html/mgmRankList",
    component: loadable(() => import("./containers/MGM/MgmRankList"), {
      ssr: false,
    }),
  },
  {
    path: "/v2/html/mgmTrialApplicationIndex",
    component: loadable(
      () => import("./containers/MGM/MgmTrialApplicationIndex"),
      { ssr: false }
    ),
  },

  {
    path: "/v2/html/mgmTrialApplicationDetails",
    component: loadable(
      () => import("./containers/MGM/MgmTrialApplicationDetails"),
      {
        ssr: false,
      }
    ),
  },

  {
    path: "/v2/html/hotsalesstandings",
    component: loadable(() => import("./containers/Hotsales"), { ssr: false }),
  },

  {
    path: "/myAccount",
    component: loadable(
      () => import("./containers/myAccount/MyAccountCenter"),
      { ssr: false }
    ),
  },
  {
    path: "/myAccount/management",
    component: loadable(
      () => import("./containers/myAccount/MyAccountManagement"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/integralFlow",
    component: loadable(
      () => import("./containers/myAccount/MyAccountIntegralRecord"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/myMemberCard",
    component: loadable(
      () => import("./containers/myAccount/MyAccountMemberCard"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/content/card",
    component: loadable(
      () => import("./containers/myAccount/MyAccountEquityDetail"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/address",
    component: loadable(
      () => import("./containers/myAccount/MyAccountAddress"),
      { ssr: false }
    ),
  },
  {
    path: "/myAccount/modifyPassword",
    component: loadable(
      () => import("./containers/myAccount/MyAccountRestPassword"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/myMessage",
    component: loadable(
      () => import("./containers/myAccount/MyAccountMessage"),
      { ssr: false }
    ),
  },
  {
    path: "/myAccount/changeHistory",
    component: loadable(() => import("./containers/myAccount/Changehistory"), {
      ssr: false,
    }),
  },
  {
    path: "/myAccount/offlineOrder",
    component: loadable(
      () => import("./containers/myAccount/MyAccountOfflineOrder"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/applyReturn",
    component: loadable(
      () => import("./containers/myAccount/MyAccountApplyReturn"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/returnList",
    component: loadable(
      () => import("./containers/myAccount/MyAccountReturnList"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/returnDetails",
    component: loadable(
      () => import("./containers/myAccount/MyAccountReturnDetails"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/returnDetailsEdit",
    component: loadable(
      () => import("./containers/myAccount/MyAccountReturnDetailsEdit"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/myAccount/returnRefundDetails",
    component: loadable(
      () => import("./containers/myAccount/MyAccountReturnRefundDetails"),
      {
        ssr: false,
      }
    ),
  },

  {
    path: "/myAccount/invoiceList",
    component: loadable(
      () => import("./containers/myAccount/MyAccountInvoiceList"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/logisticsInfo",
    component: loadable(() => import("./containers/MyOrder/LogisticsInfo"), {
      ssr: false,
    }),
  },

  {
    path: "/updatePassword",
    // component: loadable(() => import("./containers/LoginStatePages/reset"), {
      component: loadable(() => import("./containers/UpdatePassword"), {
      ssr: false,
    }),
  },
  {
    path: "/forgottenPassword",
    component: loadable(() => import("./containers/ForgottenPassword"), {
      ssr: false,
    }),
  },
  {
    path: "/resetPasswords",
    component: loadable(() => import("./containers/ResetPasswords"), {
      ssr: false,
    }),
  },
  {
    path: "/public/download.html",
    component: loadable(() => import("./containers/Download"), { ssr: false }),
  },
  {
    path: "/brand",
    component: loadable(() => import("./containers/Brandwall"), { ssr: false }),
  },
  {
    path: "/brand/:id/*",
    component: loadable(() => import("./containers/BrandPage"), { ssr: false }),
  },
  {
    path: "/brands/*",
    component: loadable(() => import("./containers/BrandPage"), { ssr: false }),
  },

  {
    path: "/public/consultHistory.html",
    component: loadable(() => import("./containers/ConsultHistory"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/rewardsBoutique",
    component: loadable(
      () => import("./containers/RewardsBoutique/RewardsBoutiqueContainer"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/v2/html/rewardsBrand/:id",
    component: loadable(
      () => import("./containers/RewardsBoutique/RewardsBoutiqueContainer"),
      {
        ssr: false,
      }
    ),
  },

  {
    path: "/v2/html/rewardsBoutiqueLimit",
    component: loadable(() => import("./containers/RewardsBoutiqueLimit"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/intergalDonate",
    component: loadable(() => import("./containers/IntergalDonate"), {
      ssr: false,
    }),
  },

  {
    path: "/register",
    component: loadable(() => import("./containers/LoginStatePages/reset"), {
      ssr: false,
    }),
  },
  {
    path: "/login",
    component: loadable(() => import("./containers/LoginStatePages/loginTwo"), {
      ssr: false,
    }),
  },
  // {
  //   path: "/loginTwo",
  //   component: loadable(() => import("./containers/LoginStatePages/loginTwo"), {
  //     ssr: false,
  //   }),
  // },
  {
    path: "/EmailSuccess",
    component: loadable(
      () => import("./containers/LoginStatePages/components/EmailSuccess"),
      {
        ssr: false,
      }
    ),
  },
  // {
  //   path: "/resetTwo",
  //   component: loadable(() => import("./containers/LoginStatePages/reset"), {
  //     ssr: false,
  //   }),
  // },
  {
    path: "/v2/html/certificate",
    component: loadable(() => import("./containers/PointCenter/Certificate"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/exchangeList",
    component: loadable(() => import("./containers/PointCenter/ExchangeList"), {
      ssr: false,
    }),
  },
  {
    path: "/v2/html/exchangeDetail/:id",
    component: loadable(
      () => import("./containers/PointCenter/ExchangeDetail"),
      { ssr: false }
    ),
  },

  {
    path: "/v2/html/postmailSuccess/:recordId",
    component: loadable(
      () => import("./containers/PointCenter/PostmailSuccess"),
      { ssr: false }
    ),
  },

  {
    path: "/v2/html/exchangeSuccess/:recordId",
    component: loadable(
      () => import("./containers/PointCenter/ExchangeSuccess"),
      { ssr: false }
    ),
  },

  {
    path: "/v2/html/exchangeReceiveSuccess/:recordId",
    component: loadable(
      () => import("./containers/PointCenter/ExchangeSuccess"),
      { ssr: false }
    ),
  },

  {
    path: "/v2/html/gainPoint",
    // render:
    component: loadable(() => import("./containers/PointCenter/gainPoint"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/rewardsBoutiqueGuide",
    component: loadable(
      () => import("./containers/PointCenter/rewardsBoutiqueGuide"),
      {
        ssr: false,
      }
    ),
  },
  {
    path: "/v2/html/lipQuiz.html",
    component: loadable(() => import("./containers/Lipquiz"), { ssr: false }),
  },
  {
    path: "/product/:id.html",
    component: loadable(() => import("./containers/Product"), { ssr: false }),
  },
  // 评论页面
  {
    path: "/v2/html/ProductCommentNew",
    component: loadable(() => import("./containers/ProductCommentNew"), {
      ssr: false,
    }),
  },
  {
    path: "/v2/html/standings",
    component: loadable(() => import("./containers/Ranking"), { ssr: false }),
  },

  {
    path: "/v2/html/historyCoupon",
    component: loadable(() => import("./containers/myAccount/HistoryCoupon"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/lotteryActivity",
    component: loadable(() => import("./containers/LotteryActivity"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/filterPerfumeStick",
    component: loadable(
      () => import("./containers/MiuMiuPerfume/FilterPerfumeStick"),
      {
        ssr: false,
      }
    ),
  },

  {
    path: "/v2/html/filterPerfumeSoldOut",
    component: loadable(
      () => import("./containers/MiuMiuPerfume/FilterPerfumeSoldOut"),
      {
        ssr: false,
      }
    ),
  },

  {
    path: "/v2/html/deposit_rule",
    component: loadable(() => import("./containers/DepositRule"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/search_revamp",
    component: loadable(() => import("./containers/SearchRevam"), {
      ssr: false,
    }),
  },
  {
    path: "/category/:id-:id/*",
    component: loadable(() => import("./containers/CategoryProduct"), {
      ssr: false,
    }),
  },
  {
    path: "/categories/:id-:id/*",
    component: loadable(() => import("./containers/CategoryProduct"), {
      ssr: false,
    }),
  },

  {
    path: "/category/:id/*",
    component: loadable(() => import("./containers/Category"), { ssr: false }),
  },
  {
    path: "/v2/html/categorybrand",
    component: loadable(() => import("./containers/Category/CategoryBrand"), {
      ssr: false,
    }),
  },

  {
    path: "/v2/html/categoryintelligent",
    component: loadable(
      () => import("./containers/Category/CategoryIntelligent"),
      { ssr: false }
    ),
  },

  {
    path: "/v2/html/categoryrecommend",
    component: loadable(
      () => import("./containers/Category/CategoryRecommend"),
      { ssr: false }
    ),
  },

  {
    path: "/search",
    component: loadable(() => import("./containers/SearchResults"), {
      ssr: false,
    }),
  },
  {
    path: "/search/v2",
    component: loadable(() => import("./containers/SearchResults"), {
      ssr: false,
    }),
  },

  {
    path: "/hot",
    component: loadable(() => import("./containers/MoodResults"), {
      ssr: false,
    }),
  },

  {
    path: "/gift_set.html*",
    component: loadable(() => import("./containers/GiftSet"), { ssr: false }),
  },

  {
    path: "/coupon_set.html*",
    component: loadable(() => import("./containers/CouponSet"), { ssr: false }),
  },
  {
    path: "/v2/html/orderListShare",
    component: loadable(() => import("./containers/OrderShareH5"), {
      ssr: false,
    }),
  },
  {
    /* 礼品智能推荐 */
    path: "/v2/html/gift_intelligent_recommendation",
    component: loadable(
      () => import("./containers/giftIntelligentRecommendation"),
      { ssr: false }
    ),
  },
  {
    path: "/v2/html/gift_intelligent_result",
    component: loadable(
      () =>
        import("./containers/giftIntelligentRecommendation/RecommendResult"),
      { ssr: false }
    ),
  },
  {
    /* 礼品智能推荐2 */
    path: "/campaign/share/giftFinder",
    component: loadable(() => import("./containers/GiftRecommend"), {
      ssr: false,
    }),
  },
  {
    path: "/campaign/share/giftResult",
    component: loadable(() => import("./containers/GiftRecommend/result"), {
      ssr: false,
    }),
  },
  {
    path: "/campaign/*",
    component: loadable(() => import("./containers/Campaign"), { ssr: false }),
  },
  {
    path: "/exclusive_product.html*",
    component: loadable(() => import("./containers/Exclusiveoffer"), {
      ssr: false,
    }),
  },
  {
    path: "/myAccount/myCoupon",
    component: loadable(() => import("./containers/MyAccountCoupon/index"), {
      ssr: true,
    }),
  },
  {
    path: "/v2/html/myAccountHistoryCoupon",
    component: loadable(
      () => import("./containers/MyAccountHistoryCoupon/index"),
      {
        ssr: true,
      }
    ),
  },
  {
    path: "/v2/html/questionnaire",
    component: loadable(() => import("./containers/Questionnaire/index"), {
      ssr: false,
    }),
  },
  {
    path: "/order-:id.html",
    component: loadable(
      () => import("./containers/MyOrder/OrderDetail/index"),
      {
        ssr: true,
      }
    ),
  },
  {
    path: "/myOrderList",
    component: loadable(() => import("./containers/MyOrder/OrderList/index"), {
      ssr: true,
    }),
  },
  {
    path: "/v2/html/bookingOrder",
    component: loadable(
      () => import("./containers/MyOrder/OrderList/bookingOrder"),
      {
        ssr: true,
      }
    ),
  },
  {
    path: "/v2/html/bindPhone",
    component: loadable(
      () => import("./containers/LoginStatePages/components/BindPhone"),
      {
        ssr: true,
      }
    ),
  },
  {
    path: "/error",
    component: loadable(() => import("./containers/ERROR"), { ssr: false }),
  },
];

export default routes;
