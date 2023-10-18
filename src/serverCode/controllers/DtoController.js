import RequestUtils from "./RequestUtils";

class DtoController extends RequestUtils {
  constructor(props) {
    super(props);
  }

  getSuccess(result) {
    const status = 0;
    const results = result;

    this.setXForWard();
    return this.res.status(200).send({
      ...this.getStaticError(),
      timeStamp: this.timeStamp,
      status,
      results,
    });
  }

  getError(error) {
    const status = 1;
    const results = null;

    this.setXForWard();
    return this.res.status(404).send({
      ...this.getStaticError(error),
      timeStamp: this.timeStamp,
      status,
      results,
    });
  }

  getErrorCDN(error) {
    const status = 1;
    const results = null;

    this.setXForWard();
    return this.res.status(200).send({
      ...this.getStaticError(error),
      timeStamp: this.timeStamp,
      status,
      results,
    });
  }

  getStaticError(e = "") {
    return {
      errorCode: e === "" ? 0 : 1,
      errorMessage: e,
    };
  }
}

export default DtoController;
