class Request {
  constructor(props) {
    this.req = props.req;
    this.res = props.res;
    this.timeStamp = new Date().getTime();
  }

  getXForWardFor() {
    return (
      this.req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      this.req.connection.remoteAddress || // 判断 connection 的远程 IP
      this.req.socket.remoteAddress || // 判断后端的 socket 的 IP
      this.req.connection.socket.remoteAddress ||
      null
    );
  }

  setXForWard() {
    if (this.getXForWardFor()) {
      this.res.setHeader('x-forwarded-for', this.getXForWardFor());
    }
  }
}

export default Request;
