import MyAccount from "@/lib/services/MyAccount";
import GetSingleCookie2 from "@/Utils/utils/GetSingleCookie2";
import Utils from "@/lib/utils";

/**
 * 在线咨询
 */
export default class ActionOnlineReference {
  static OpenOnlineParams = "onlineReference=1";
  static SetSession = () => {
    sessionStorage.setItem(ActionOnlineReference.OpenOnlineParams, "1");
  };
  static GetSession = () => {
    return sessionStorage.getItem(ActionOnlineReference.OpenOnlineParams);
  };

  static RemoveSession = () => {
    sessionStorage.removeItem(ActionOnlineReference.OpenOnlineParams);
  };

  static AutoOpenOnlineReference = () => {
    if (typeof window === "undefined") {
      return;
    }
    if (ActionOnlineReference.GetSession()) {
      ActionOnlineReference.RemoveSession();
      ActionOnlineReference.OpenOnlineReferenceServices();
    }
  };

  /**
   * 打开在线咨询
   */
  static OpenOnlineReferenceServices = () => {
    MyAccount.user.getUserInfo().then((res) => {
      if (res.status === 401) {
        ActionOnlineReference.SetSession();
        window.location.href = `/login?historyLocation=${encodeURIComponent(
          window.location.href
        )}`;
        return;
      }
      const userinfo = res.results;
      if (userinfo) {
        let token = GetSingleCookie2({ key: "Token" }) || "";
        let url = "https://uataicca.sephora.cn/webchatbot/h5chat_sephora.html";
        if (Utils.getEnv("restfulEnv") === "production") {
          url = "https://aicca.sephora.cn/webchatbot/h5chat_sephora.html";
        }
        window.location.href = `${url}?sysNum=1603354924318&sourceId=70181&lang=zh_CN&token=${token}`;
      }
    });
  };
}
