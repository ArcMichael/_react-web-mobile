import React, { Component } from "react";
import { connect } from "react-redux";

export class ProcessCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  showModalMessage() {
    this.props.msg(true);
  }
  render() {
    let { limit, giftList } = this.props;
    let totalPrice = 0;
    giftList.map((v) => (totalPrice += Number(v.price)));
    return (
      <div
        className="cicle_container"
        onClick={() => {
          this.props.changeData(true);
        }}
      >
        <div className="wave" />
        <div
          className={`wave-mask ${totalPrice / limit >= 1 ? "clear" : ""}`}
          style={{
            top: ` ${(40 - parseInt((totalPrice / limit) * 100)) / 100}rem`,
          }}
         />
        <p>￥{totalPrice}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    giftList: state.giftIntelligent.giftList,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessCircle);
