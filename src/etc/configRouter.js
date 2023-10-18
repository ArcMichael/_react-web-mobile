/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-09-16 09:53:48
 * @LastEditTime: 2021-04-15 13:41:51
 */
export default function configRouter() {
  return [
    { index: "Index", regex: /^\/$/ },
    { index: "Category", regex: /^\/category\/.+\/$/ },
    { index: "SearchResults", regex: /^\/SearchResults(\/)?/ },
    { index: "new", regex: /^\/new(\/)?/ },
    { index: "HotWords", regex: /^\/HotWords(\/)?/ },
    { index: "NicheFragrance", regex: /^\/v2\/html\/nichefragrance(\/)?/ },
    { index: "CurrentLimiting", regex: /^\/v2\/html\/currentLimiting(\/)?/ },
    { index: "OfflineService", regex: /^\/v2\/html\/offlineService(\/)?/ },
    { index: "lipQuiz", regex: /^\/v2\/html\/lipQuiz(\/)?/ },
    {
      index: "MgmTrialApplication",
      regex: /^\/v2\/html\/mgmTrialApplication(\/)?/,
    },
    { index: "MgmTrialApplication", regex: /^\/v2\/html\/mgmRankList(\/)?/ },
    {
      index: "MgmTrialApplicationIndex",
      regex: /^\/v2\/html\/mgmTrialApplicationIndex(\/)?/,
    },
    {
      index: "MgmTrialApplicationIndex",
      regex: /^\/v2\/html\/mgmTrialApplicationDetails(\/)?/,
    },
    { index: "myAccount", regex: /^\/myAccount(\/)?/ },
    { index: "myAccountManagement", regex: /^\/myAccount\/management(\/)?/ },
    {
      index: "myAccountIntegralRecord",
      regex: /^\/myAccount\/integralFlow(\/)?/,
    },
    { index: "myAccountMemberCard", regex: /^\/myAccount\/myMemberCard(\/)?/ },
    { index: "myAccountAddress", regex: /^\/myAccount\/address(\/)?/ },
    {
      index: "myAccountRestPassword",
      regex: /^\/myAccount\/modifyPassword(\/)?/,
    },
    { index: "myAccountEquityDetail", regex: /^\/content\/card(\/)?/ },
    { index: "UpdatePassword", regex: /^\/updatePassword(\/)?/ },
    {
      index: "myAccountIssueInvoice",
      regex: /^\/myAccount\/issueInvoice(\/)?/,
    },
    { index: "myAccountInvoiceList", regex: /^\/myAccount\/invoiceList(\/)?/ },
    { index: "changehistory", regex: /^\/myAccount\/changeHistory(\/)?/ },
    { index: "myAccountApplyReturn", regex: /^\/myAccount\/applyReturn(\/)?/ },
    { index: "myAccountReturnList", regex: /^\/myAccount\/returnList(\/)?/ },
    {
      index: "myAccountReturnDetails",
      regex: /^\/myAccount\/returnDetails(\/)?/,
    },
    {
      index: "myAccountReturnDetailsEdit",
      regex: /^\/myAccount\/returnDetailsEdit(\/)?/,
    },
    {
      index: "myAccountMyAccountMessage",
      regex: /^\/myAccount\/myMessage(\/)?/,
    },
    {
      index: "myAccountReturnRefundDetailst",
      regex: /^\/myAccount\/returnRefundDetails(\/)?/,
    },
    {
      index: "myAccountOfflineOrder",
      regex: /^\/myAccount\/offlineOrder(\/)?/,
    },
    { index: "forgottenPassword", regex: /^\/forgottenPassword(\/)?/ },
    { index: "resetPasswords", regex: /^\/resetPasswords(\/)?/ },
    { index: "BrandAll", regex: /^\/brand(\/?)$/ },
    { index: "download", regex: /^\/public\/download\.html(\/)?/ },
    { index: "consultHistory", regex: /^\/public\/consultHistory\.html(\/)?/ },
    { index: "register", regex: /^\/register(\/)?/ },
    { index: "login", regex: /^\/login(\/)?/ },
    { index: "logisticsInfo", regex: /^\/logisticsInfo(\/)?/ },
    { index: "product", regex: /^\/product(\/)?/ },
    { index: "homepage", regex: /^\/homepage(\/)?/ },
    { index: "rewardsBoutique", regex: /^\/v2\/html\/rewardsBoutique(\/)?/ },
    { index: "rewardsBoutique", regex: /^\/v2\/html\/rewardsBrand(\/)?/ },
    { index: "IntergalDonate", regex: /^\/v2\/html\/intergalDonate(\/)?/ },
    { index: "exchangeSuccess", regex: /^\/v2\/html\/exchangeSuccess(\/)?/ },
    {
      index: "exchangeSuccess",
      regex: /^\/v2\/html\/exchangeReceiveSuccess(\/)?/,
    },
    { index: "exchangeDetail", regex: /^\/v2\/html\/exchangeDetail(\/)?/ },
    { index: "exchangeList", regex: /^\/v2\/html\/exchangeList(\/)?/ },
    { index: "certificate", regex: /^\/v2\/html\/certificate(\/)?/ },
    { index: "gainpoint", regex: /^\/v2\/html\/gainPoint(\/)?/ },
    { index: "standings", regex: /^\/v2\/html\/standings(\/)?/ },
    {
      index: "rewardsBoutiqueLimit",
      regex: /^\/v2\/html\/rewardsBoutiqueLimit(\/)?/,
    },
    { index: "Hotsales", regex: /^\/v2\/html\/hotsalesstandings(\/)?/ },
    {
      index: "rewardsBoutiqueGuide",
      regex: /^\/v2\/html\/rewardsBoutiqueGuide(\/)?/,
    },
    { index: "lotteryActivity", regex: /^\/v2\/html\/lotteryActivity(\/)?/ },
    { index: "historyCoupon", regex: /^\/v2\/html\/historyCoupon(\/)?/ },
    {
      index: "filterPerfumeStick",
      regex: /^\/v2\/html\/filterPerfumeStick(\/)?/,
    },
    {
      index: "filterPerfumeSoldOut",
      regex: /^\/v2\/html\/filterPerfumeSoldOut(\/)?/,
    },
    { index: "searchRevam", regex: /^\/v2\/html\/search_revamp(\/)?/ },
    { index: "CategoryBrand", regex: /^\/v2\/html\/categorybrand(\/)?/ },
    {
      index: "CategoryIntelligent",
      regex: /^\/v2\/html\/categoryintelligent(\/)?/,
    },
    {
      index: "CategoryRecommend",
      regex: /^\/v2\/html\/categoryrecommend(\/)?/,
    },
    { index: "postmailSuccess", regex: /^\/v2\/html\/postmailSuccess(\/)?/ },
    { index: "Brandpage", regex: /^\/brand\/(?=\w+)(?!story)/ },
    { index: "Brandpage", regex: /^\/brands\/(?=\w+)(?!story)/ },
    { index: "Giftset", regex: /^\/gift_set(\/)?/ },
    { index: "Couponset", regex: /^\/coupon_set(\/)?/ },
    { index: "Exclusiveoffer", regex: /^\/exclusive_product(\/)?/ },
    { index: "CategoryProduct", regex: /^\/category\/.+\-/ },
    { index: "CategoryProduct", regex: /^\/categories\/.+\-/ },
    { index: "SearchResults", regex: /^\/search(\/)?/ },
    { index: "SearchresultsV2", regex: /^\/search(\/)v2(\/)?/ },
    { index: "Moodresults", regex: /^\/hot(\/)?/ },

    {
      index: "GiftRecommend",
      regex: /^\/v2\/html\/gift_intelligent_recommendation(\/)?/,
    },
    {
      index: "GiftRecommend",
      regex: /^\/v2\/html\/gift_intelligent_result(\/)?/,
    },
    { index: "myAccountCoupon", regex: /^\/myAccount\/myCoupon(\/)?/ },
    {
      index: "myAccountHistoryCoupon",
      regex: /^\/v2\/html\/myAccountHistoryCoupon(\/)?/,
    },
  ];
}
