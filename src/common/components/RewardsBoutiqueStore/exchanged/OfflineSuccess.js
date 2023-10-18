import React from "react";

class OfflineSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultdata: null,
    };
  }
  getDate = () => {};
  componentDidMount() {
    const { resultdata } = this.state; // TODO: 请移除无用state
    console.log(resultdata);
  }
  render() {
    return <div className="OfflineSuccessContainer">兑换成功</div>;
  }
}

export default OfflineSuccess;
