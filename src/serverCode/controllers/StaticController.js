import RequestTPController from './RequestTPController';

class StaticController extends RequestTPController {
  /**
   * @param {{
   * req: import('express').Request;
   * res: import('express').Response
   * }} props
   */
  constructor(props) {
    super(props);
    this.req = props.req;
    this.res = props.res;
  }

  getProductJson(url) {
    return new Promise((resolve, reject) => {
      this.get({
        uri: url,
        json: true,
        headers: {
          Referer: this.req.headers['referer'] || '',
          'User-Agent': this.req.headers['user-agent'] || '',
        },
      })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

export default StaticController;
