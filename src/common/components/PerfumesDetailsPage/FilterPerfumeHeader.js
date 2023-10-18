/**
 * Created by summer
 * 香水定制头部
 */
import React from "react";
class FilterPerfumeHeader extends React.Component {
  render() {
    let { _data } = this.props;
    return (
      <div className="container-title">
        <img src={_data && _data.logo} />
        <p className="main-title">{_data && _data.subtitle}</p>
        <p className="sub-title">{_data && _data.slogan}</p>
      </div>
    );
  }
}

export default FilterPerfumeHeader;
