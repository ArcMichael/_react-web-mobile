import { AJAX } from "../../../lib/ajax";

//广告位
const getADcontent = code => {
  return new Promise((resolve, ) => {
    AJAX(
      {
        type: "GET",
        url: `/v1/mpcms/common/banner/${code}?channel=mobile`,
      },
      json => {
        resolve(json.results);
      },
    );
  });
};

export default getADcontent;
