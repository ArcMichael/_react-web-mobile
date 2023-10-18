import { AJAX } from "../../../lib/ajax";
import { GetConfirmation } from "../../../lib/Tools";

const getBrandListPageData = (param, callback) => {
  AJAX(
    {
      type: "GET",
      url: `/v1/search-service/product/list/brand?${param}`,
    },
    json => {
      callback(GetConfirmation(json));
    },
  );
};

export default getBrandListPageData;
