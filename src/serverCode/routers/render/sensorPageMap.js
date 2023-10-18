export default function pageData(URL) {
  if (!URL) return { page_type_detail: "other", page_type: "other" };
  function GetQueryString(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = decodeURIComponent(URL.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  function getCampaignCode(campaignCode) {
    const arr = (campaignCode && campaignCode.split(/intcmp=|kwrec=|prodlink=/)) || [];
    return arr.length > 1 ? arr[arr.length - 1] : null;
  }

  const pageTMP = {
    category: () => {
      const categoryId = URL.pathname.split("/")[2];
      const category = categoryId.split("-");
      return {
        page_type_detail: `category_list_${category.length}`,
        page_type: "List-page",
        categoryId: URL.pathname.split("/")[2] || "",
        action_id: "1000202_008",
        page_id:"MB_1000202"
      };
    },
    "gift_set.html": () => {
      return {
        page_type_detail: "gift_list",
        page_type: "List-page",
      };
    },
    "coupon_set.html": () => {
      return {
        page_type_detail: "myaccount_coupon",
        page_type: "List-page",
      };
    },
    "logisticsInfo": () => {
      return {
        page_type_detail: "myaccount_logisticsInfo",
        page_type: "Function-page",
      };
    },
    "exclusive_product.html": () => {
      return {
        page_type_detail: "exclusive_list",
        page_type: "List-page",
      };
    },
    "updatePassword": () => {
      return {
        page_type_detail: "myaccount_updatePassword",
        page_type: "Function-page",
      };
    },
    search: () => {
      return {
        page_type_detail: "search_list",
        page_type: "List-page",
        key_words: GetQueryString("k"),
      };
    },
    hot: () => {
      return {
        page_type_detail: "search_hot_list",
        page_type: "List-page",
        key_words: GetQueryString("k"),
      };
    },
    brand: () => {
      const brandId =
        (URL.pathname.split("/")[2] && URL.pathname.split("/")[2].split("-")[1]) || null;
      const story =
        (URL.pathname.split("/")[2] && URL.pathname.split("/")[2].split("-")[2]) || null;
      if (story) {
        return {
          page_type_detail: "brand_story",
          page_type: "Campaign-page",
          brand_id: story,
        };
      }
      if (brandId) {
        return {
          page_type_detail: "brand_list",
          page_type: "List-page",
          brand_id: brandId,
        };
      }
      return {
        page_type_detail: "brand_navigation",
        page_type: "Navigation-page",
      };
    },
    product: () => {
      return {
        page_type_detail: "product_detail",
        page_type: "Product-detail-page",
        OP_code: URL.pathname.split("/")[2].split(".")[0] || "",
      };
    },
    cart: () => {
      return {
        page_type_detail: "cart",
        page_type: "Function-page",
      };
    },
    checkout: () => {
      return {
        page_type_detail: "checkout_order",
        page_type: "Function-page",
      };
    },
    order: () => {
      return {
        page_type_detail: "order_detail",
        page_type: "Function-page",
        orderID: URL.pathname.match(/order\-(\d*)\./)[1] || "",
      };
    },
    myAccount: () => {
      const pagename = URL.pathname.split("/")[2] || null;
      const data = {
        myCoupon: {
          page_type_detail: "myAccount_coupon",
          page_type: "Function-page",
        },
        address: {
          page_type_detail: "address",
          page_type: "Function-page",
        },
        management: {
          page_type_detail: "myAccount-management",
          page_type: "Function-page",
        },
        integralFlow: {
          page_type_detail: "myAccount-integralFlow",
          page_type: "Function-page",
        },
        myMemberCard: {
          page_type_detail: "member_card",
          page_type: "Function-page",
        },
        modifyPassword: {
          page_type_detail: "myAccount-modifyPassword",
          page_type: "Function-page",
        },
        changeHistory: {
          page_type_detail: "myAccount-changeHistory",
          page_type: "Function-page",
        },
        "profile.html": {
          page_type_detail: "user-info",
          page_type: "Function-page",
        },
      };
      if (data[pagename]) return data[pagename];
      return {
        page_type_detail: "my_account",
        page_type: "Function-page",
      };
    },
    login: () => {
      return {
        page_type_detail: "login_in",
        page_type: "Function-page",
      };
    },
    forgottenPassword: () => {
      return {
        page_type_detail: "forget_password",
        page_type: "Function-page",
      };
    },
    register: () => {
      return {
        page_type_detail: "register",
        page_type: "Function-page",
      };
    },
    "my-account": () => {
      return {
        page_type_detail: "user-info",
        page_type: "Function-page",
      };
    },
    myMemberCard: () => {
      return {
        page_type_detail: "member_card",
        page_type: "Function-page",
      };
    },
    restMyCard: () => {
      return {
        page_type_detail: "change-card",
        page_type: "Function-page",
      };
    },
    content: () => {
      const content = URL.pathname.split("/")[2] || null;
      if (content && content === "helpinfo") {
        return {
          page_type_detail: "help-center",
          page_type: "Function-page",
        };
      }
      if (content && content === "card") {
        return {
          page_type_detail: "content_card",
          page_type: "Function-page",
        };
      }
      return {
        page_type_detail: "content",
        page_type: "Function-page",
      };
    },
    campaign: () => {
      const changehistory = URL.pathname.split("/")[2] || null;
      if (changehistory && changehistory === "changehistory") {
        return {
          page_type_detail: "point_redemption_record",
          page_type: "Campaign-page",
        };
      }
      return {
        page_type_detail: "campaign_page",
        page_type: "Campaign-page",
        campaign_code: getCampaignCode(URL.href),
      };
    },
    myOrderList: () => {
      return {
        page_type_detail: "my_order_list",
        page_type: "Function-page",
      };
    },
    beautyCommunity: () => {
      return {
        page_type_detail: "beautyCommunity",
        page_type: "Function-page",
      };
    },
    wxBindCustomedCard: () => {
      return {
        page_type_detail: "wxBindCustomedCard",
        page_type: "Function-page",
      };
    },
    resetPasswords: () => {
      return {
        page_type_detail: "resetPasswords",
        page_type: "Function-page",
      };
    },
    helpInfo: () => {
      return {
        page_type_detail: "content",
        page_type: "Function-page",
      };
    },
    error: () => {
      return {
        page_type_detail: "error",
        page_type: "error",
      };
    },
    home: () => {
      return {
        page_type_detail: "home",
        page_type: "home",
        action_id: "1000001_000",
        page_id: "MB_1000001",
        $screen_name: "首页",
      };
    },
    homepage: () => {
      return {
        page_type_detail: "home",
        page_type: "home",
        action_id:"1000001_000",
        page_id:"MB_1000001",
        $screen_name: "首页",
      };
    },
    v2: () => {
      const content = URL.pathname.split("/")[3] || null;
      const data = {
        rewardsBoutique: () => {
          return {
            page_type_detail: "rewardsBoutique",
            page_type: "other",
          };
        },
        hotsalesstandings: () => {
          return {
            page_type_detail: "hotsalesstandings",
            page_type: "other",
          };
        },
        exchangeDetail: () => {
          return {
            page_type_detail: "exchangeDetail",
            page_type: "other",
          };
        },
        gainPoint: () => {
          return {
            page_type_detail: "gainPoint",
            page_type: "other",
          };
        },
        exchangeList: () => {
          return {
            page_type_detail: "exchangeList",
            page_type: "other",
          };
        },
        "lipQuiz.html": () => {
          return {
            page_type_detail: "lipQuiz",
            page_type: "other",
          };
        },
        mgmTrialApplication: () => {
          return {
            page_type_detail: "mgmTrialApplication",
            page_type: "other",
          };
        },

        mgmRankList: () => {
          return {
            page_type_detail: "mgmRankList",
            page_type: "other",
          };
        },
        mgmTrialApplicationIndex: () => {
          return {
            page_type_detail: "mgmTrialApplicationIndex",
            page_type: "other",
          };
        },
        mgmTrialApplicationDetails: () => {
          return {
            page_type_detail: "mgmTrialApplicationDetails",
            page_type: "other",
          };
        },
        rewardsBrand: () => {
          return {
            page_type_detail: "rewardsBrand",
            page_type: "other",
          };
        },
        intergalDonate: () => {
          return {
            page_type_detail: "intergalDonate",
            page_type: "other",
          };
        },
        exchangeSuccess: () => {
          return {
            page_type_detail: "exchangeSuccess",
            page_type: "other",
          };
        },
        exchangeReceiveSuccess: () => {
          return {
            page_type_detail: "exchangeReceiveSuccess",
            page_type: "other",
          };
        },
        rewardsBoutiqueGuide: () => {
          return {
            page_type_detail: "rewardsBoutiqueGuide",
            page_type: "other",
          };
        },
        standings: () => {
          return {
            page_type_detail: "standings",
            page_type: "other",
          };
        },
        historyCoupon: () => {
          return {
            page_type_detail: "historyCoupon",
            page_type: "other",
          };
        },
        lotteryActivity: () => {
          return {
            page_type_detail: content,
            page_type: "other",
          };
        },
        categoryrecommend: () => {
          return {
            page_type_detail: "category_recommend",
            page_type: "other",
          };
        },
        categorybrand: () => {
          return {
            page_type_detail: "category_brand",
            page_type: "other",
          };
        },
        categoryintelligent: () => {
          return {
            page_type_detail: "category_intelligent",
            page_type: "other",
          };
        },
        nichefragrance: () => {
          return {
            page_type_detail: "campaign_nichefragrance",
            page_type: "other",
          };
        },
        filterPerfumeStick: () => {
          return {
            page_type_detail: content,
            page_type: "other",
          };
        },
        filterPerfumeSoldOut: () => {
          return {
            page_type_detail: content,
            page_type: "other",
          };
        },
        deposit_rule: () => {
          return {
            page_type_detail: content,
            page_type: "other",
          };
        },
        search_revamp: () => {
          return {
            page_type_detail: "search",
            page_type: "other",
          };
        },
        bookingOrder: () => {
          return {
            page_type_detail: "my_order_list",
            page_type: "Function-page",
          };
        },
      };
      if (data[content]) {
        return data[content]();
      } else {
        return {
          page_type_detail: "other",
          page_type: "other",
        };
      }
    },
  };
  let pathname = URL.pathname === "/" ? "home" : URL.pathname.split("/")[1];
  pathname = pathname.indexOf("order-") === 0 ? "order" : pathname;
  pathname = pathname === "brands" ? "brand" : pathname;

  const obj = (pathname && pageTMP[pathname] && pageTMP[pathname]()) || {
    page_type_detail: "other",
    page_type: "other",
  };
  return obj;
}
