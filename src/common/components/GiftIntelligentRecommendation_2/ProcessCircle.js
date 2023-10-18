import React, { Component } from "react";
import { connect } from "react-redux";

export class ProcessCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: "",
      top: "",
    };
    this.myRef = React.createRef();
  }
  // dragStart(ev) {
  //   // ev.preventDefault();
  //   const target = document.querySelectorAll(".cicle_container")[0];
  //   let btnHeight = document.querySelector(".gift_intelligent_bottom");
  //   let clientHeight = document.querySelector(".gift_intelligent_result");
  //   this.widthMax =
  //     clientHeight.getBoundingClientRect().width -
  //     target.getBoundingClientRect().width;
  //   this.heigthMax =
  //     clientHeight.getBoundingClientRect().height -
  //     btnHeight.getBoundingClientRect().height -
  //     target.getBoundingClientRect().height;
  //   this.startX = ev.changedTouches[0].pageX;
  //   this.startY = ev.changedTouches[0].pageY;
  //   this.x = target.offsetLeft;
  //   this.y = target.offsetTop;
  // }
  // dragMove(ev) {
  //   this.clientX = ev.changedTouches[0].pageX;
  //   this.clientY = ev.changedTouches[0].pageY;
  //   this.left = this.clientX - this.startX + this.x;
  //   this.top = this.clientY - this.startY + this.y;
  //   if (this.left < 10) {
  //     this.left = 10;
  //   } else if (this.widthMax - this.left < 10) {
  //     this.left = this.widthMax - 10;
  //   }

  //   if (this.top < 0) {
  //     this.top = 0;
  //   } else if (this.heigthMax - this.top < 0) {
  //     this.top = this.heigthMax;
  //   }
  //   this.setState({
  //     left: this.left / 50,
  //     top: this.top / 50,
  //   });
  // }
  // dragEnd() {
  //   if (this.left < this.widthMax / 2 && this.top > 80) {
  //     this.left = 10;
  //   } else if (
  //     this.widthMax - this.left < this.widthMax / 2 &&
  //     this.heigthMax - this.top > 80
  //   ) {
  //     this.left = this.widthMax - 10;
  //   }
  //   if (this.top < 80) {
  //     this.top = 0;
  //   } else if (this.heigthMax - this.top < 80) {
  //     this.top = this.heigthMax;
  //   }
  //   this.setState({ left: this.left / 50, top: this.top / 50 });
  //   document.removeEventListener("mousemove", this._dragMove);
  //   document.removeEventListener("mouseup", this._dragEnd);
  // }
  componentDidMount() {}
  showModalMessage() {
    this.props.msg(true);
  }
  render() {
    let { limit, giftList, color } = this.props;
    let { left, top } = this.state;
    let totalPrice = 0;
    giftList.map((v) => (totalPrice += Number(v.price)));
    return (
      <div>
        {limit ? (
          <div
            ref={this.myRef}
            id="cicle_container"
            className="cicle_container"
            style={{
              left: `${left}rem`,
              top: `${top}rem`,
              border: "2px solid black",
            }}
            // onTouchStart={(e) => this.dragStart(e)}
            // onTouchMove={(e) => this.dragMove(e)}
            // onTouchEnd={(e) => this.dragEnd(e)}
            onClick={() => {
              this.props.changeData(true);
            }}
          >
            <div className="wave_2" style={{ backgroundColor: `${color}` }} />
            <div
              className={`wave-mask_2 ${
                totalPrice / limit >= 1 ? "clear" : ""
              }`}
              style={{
                top: ` ${(40 - parseInt((totalPrice / limit) * 100)) / 100}rem`,
                borderRadius: 0,
                border:"1px solid"
              }}
            />
            <p>￥{totalPrice}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    giftList: state.giftIntelligentNew.giftList,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProcessCircle);
