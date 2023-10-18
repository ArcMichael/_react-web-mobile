import { AJAX } from "../../../lib/ajax";
import { GetConfirmation } from "../../../lib/Tools";

const getBrandListPageData = (param, callback) => {
  AJAX(
    {
      type: "POST",
      url: `/v1/offlieLineExternal/coupon/list`,
      data:param
    },
    json => {
      callback(GetConfirmation(json));
    },
  );
};

export default getBrandListPageData;
