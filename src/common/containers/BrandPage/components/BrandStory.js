import React, { Component } from "react";
import Brandstorycon from "./Brandstorycon";
import Brandadvertising from "./Brandadvertising";
import Brandscreen from "./Brandscreen";

class Brandstory extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name, Brandpagecon } = this.props;
    return (
      <div className="brand_story">
        <Brandstorycon Brandpagecon={Brandpagecon} />
        <Brandadvertising name={name} />
        <Brandscreen Brandpagecon={Brandpagecon} />
      </div>
    );
  }
}

export default Brandstory;
