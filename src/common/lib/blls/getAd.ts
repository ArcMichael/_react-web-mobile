import { AJAX } from "../ajax";
import { GetConfirmation } from "../Tools";

export default function getAd(params: any, callback: any) {
  AJAX(
    {
      type: "GET",
      url: `/v1/mpcms/common/banner/${params}?channel=mobile`,
    },
    (json: any) => {
      callback(GetConfirmation(json));
    }
  );
}
