import React, { Component } from "react";

class BrandTwoMore extends Component {
  constructor(props) {
    super(props);
    this.showMore = this.showMore.bind(this);
  }

  showMore() {
    let { toogleTwoClass } = this.props;
    toogleTwoClass();
  }

  render() {
    let { TWOCLASSMORES } = this.props;
    return (
      <div className="brand_twoclass_more" onClick={this.showMore}>
        {TWOCLASSMORES ? "收起" : "更多"}
        <em className={TWOCLASSMORES ? "cur" : ""} />
      </div>
    );
  }
}

export default BrandTwoMore;
