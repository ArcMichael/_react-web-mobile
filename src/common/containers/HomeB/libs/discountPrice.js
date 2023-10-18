import { AJAX } from "../../../lib/ajax";
import { GetConfirmation } from "../../../lib/Tools";

function discountPrice(params, callback, excludeSoldOut = false) {
  AJAX(
    {
      type: "POST",
      url: `/v1/product/product/discount-price?channel=MOBILE&&excludeSoldOut=` + excludeSoldOut,
      data: {
        queryBody: params,
      },
    },
    json => {
      callback(GetConfirmation(json));
    },
  );
}

export default discountPrice;
