import React from "react";
class MyOrderListEmpty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // text: "",
    };
  }
  componentDidMount() { }
  render() {
    const { _status } = this.props;
    let text;
    switch (_status) {
      case "all":
        text = "暂无订单";
        break;
      case "DIP":
        text = "您没有待发货的订单";
        break;
      case "DPP":
        text = "您没有待支付的订单";
        break;
      case "DID":
        text = "您没有已发货的订单";
        break;
      case "DF":
        text = "您没有待评价的订单";
        break;
    }
    return (
      <div className="myOrderList-empty">
        <span />
        <span>{text}</span>
      </div>
    );
  }
}

export default MyOrderListEmpty;
