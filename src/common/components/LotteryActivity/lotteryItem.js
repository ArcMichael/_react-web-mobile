import React, { Component } from "react";
export default class lotteryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { content, activedId } = this.props;
    return (
      <div className={activedId === content.position ? "row_item row_item-active" : "row_item"} id={`row_item_${content}`}>
        <img src={content.imageUrl} alt="" />
      </div>
    );
  }
}
