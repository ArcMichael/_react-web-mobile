/*
 * @Author: Leo.Si
 * @Date: 2020-06-10 15:00:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-09-Mo 02:53:31
 * @function 展示具体物流信息
 */
import React from "react";
class LogisticsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowButton: false,
      isLimit: 3,
    };
    this.userClick = this.userClick.bind(this);
  }

  componentDidMount() {
    if (this.props._detailsData && this.props._detailsData.length > 3) {
      this.setState({
        isShowButton: true,
      });
    }
  }

  userClick() {
    const { _detailsData } = this.props;
    this.setState({
      isShowButton: false,
      isLimit: _detailsData && _detailsData.length,
    });
  }
  render() {
    const { _detailsData } = this.props;
    const { isShowButton, isLimit } = this.state;
    return (
      <div className="myorder-delivery-content-details-div">
        <div className="myorder-delivery-content-details">
          <div className="myorder-delivery-content-details-left" />
          <div className="myorder-delivery-content-details-right">
            {_detailsData &&
              _detailsData.length > 0 &&
              _detailsData.map((item, index) => {
                const { trackingInfo, updateTime } = item;
                if (index + 1 > isLimit) return null;
                return (
                  <div className="info-row-process">
                    <em />
                    <p className={index + 1 == 1 ? "details-right-p-first" : ""}>{trackingInfo}</p>
                    <p>{updateTime}</p>
                  </div>
                );
              })}
          </div>
        </div>
        {isShowButton && (
          <button className="myorder-delivery-content-details-button" onClick={this.userClick}>
            查看完整物流
          </button>
        )}
      </div>
    );
  }
}
export default LogisticsDetails;
