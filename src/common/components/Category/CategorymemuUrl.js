/*
 * @Author: summer
 * @Date: 2021-06-Th 09:53:44
 * @Last Modified by:   summer
 * @Last Modified time: 2021-06-Th 09:53:44
 * 智能推荐--推荐
 */

import React, { Component } from "react";

class CategorymemuUrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classCur: "",
    };
  }

  componentDidMount() {
    const { obj } = this.props;
    const pathname = window.location.pathname;
    if (obj.Url == pathname) {
      obj.checked = true;
    }
    let classCur = "";
    if (obj.checked) {
      classCur = "cur";
    }
    this.setState({ classCur });
  }

  render() {
    const { obj, callback, _index } = this.props;
    let Href = "";
    const { classCur } = this.state;

    if (obj.Url) {
      Href = `${obj.Url}`;
    }
    return (
      <h1 className={classCur}>
        <a
          href={Href}
          onClick={() => callback(Href, obj.name, _index)}
          style={obj.name == "品牌" ? { borderTop: ".02rem solid #E9E9E9" } : {}}
        >
          {obj.name}
        </a>
      </h1>
    );
  }
}

export default CategorymemuUrl;
