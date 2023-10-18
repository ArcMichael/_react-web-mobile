import { AJAX } from "@/lib/ajax";

class ShareH5 {
  static getShareList(shareId:string) {

    return new Promise((resolve) => {
      AJAX(
        {
         
          type: "GET",
          url: `/v1/order/operation/shareInfo/${shareId}`
        },
        (json) => {
          resolve(json.results);
        }
      );
    });
  }
}
export default ShareH5