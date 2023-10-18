import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import Images from "../../components/Images/render";
import { changehistory } from "../../actions/changehistory";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/Changehistory.scss");
}

class Changehistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      CommonPageTitle: null,
      CurrentComponentCommonTop: null,
    };
  }
  componentDidMount() {
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index").default,
      });
    });
    this.props.changehistory((json) => {
      const jsondata = typeof json == "string" ? JSON.parse(json) : json;
      if (jsondata && jsondata.status == 2) {
        this.setState({
          data: jsondata.results,
        });
      }
    });
  }
  render() {
    const { data, CommonPageTitle, CurrentComponentCommonTop } = this.state;

    return (
      <div>
        {CommonPageTitle && <CommonPageTitle _isBack={true} _title="兑换记录" />}
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        <div id="apptitle">兑换记录</div>
        <div className="Changehistory">
          {data &&
            data.map((d) => {
              const size = `规格:` + d.pro_size;
              return (
                <div className="list_Wrapper" key={d.order_id}>
                  <div className="title">
                    <span>订单号：{d.order_id}</span>
                    {d.delivery_id ? (
                      <span>
                        <a
                          href={
                            "http://www.sf-express.com/mobile/cn/sc/dynamic_function/waybill/waybill_query_by_billno.html?billno=" +
                            d.delivery_id
                          }
                        >
                          {d.status_cn || ""}
                        </a>
                      </span>
                    ) : (
                      <span>{d.status_cn || ""}</span>
                    )}
                  </div>
                  <div className="line-top" />
                  <div className="content">
                    <div className="img">
                      <Images _src={d.pro_url} />
                    </div>
                    <div className="text">
                      <div className="productcn">{d.pro_name}</div>
                      <div className="pro_size">{size}</div>
                    </div>
                  </div>
                  <div className="line-top" />
                  <div className="adress">
                    <div className="label">收货人信息：</div>
                    <div className="value">
                      <p>{d.address}</p>
                      <p>
                        {d.receiver_name} &nbsp;&nbsp; {d.receiver_mobile}
                      </p>
                    </div>
                  </div>
                  <div className="exchange_time">
                    兑换时间: <span>{d.exchange_time}</span>
                  </div>
                  <div className="exchange_time coupon_cost">券数: {d.coupon_cost}张</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  changehistory,
})(Changehistory);
