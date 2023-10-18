import requestp from "request-promise";
import RequestUtils from "./RequestUtils";
import { loggers } from "../utils/log";

class RequestTPController extends RequestUtils {
  constructor(props) {
    super(props);
  }

  setHeaders() {
    return {
      "x-forwarded-for": this.getXForWardFor(),
    };
  }

  /**
   * @param {{
   *  uri:string;
   *  json?:boolean;
   *  method?:'GET' | 'POST' | 'PUT' | 'DELETE';
   *  headers?:{ [K:string]:string }
   * }} param0
   */
  get({ uri, json = true, method = "GET", headers = {} }) {
    loggers.req.info(`${method} - ${uri} start request`);

    return requestp({
      headers: {
        ...this.setHeaders(),
        ...headers,
      },
      method,
      uri,
      json,
    });
  }
}

export default RequestTPController;
