import React from "react";
import { connect } from "react-redux";
import { initAddress } from "@/actions/myAccount";
import DataLink from "../../../Atoms/DataLink";
import PageTitle from "../../../CommonPageTitle";
import NoAddress from "./NoAddress";

class AllAddressList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.choiceAddress = this.choiceAddress.bind(this);
  }

  start(index, item, e) {
    const position = this.state;
    position.startX = e.changedTouches[0].pageX;
    position.startY = e.changedTouches[0].pageY;
  }

  move(index, item, e) {
    const position = this.state;
    position.endX = e.changedTouches[0].pageX;
    position.endY = e.changedTouches[0].pageY;
  }

  end(index, item) {
    const position = this.state;
    if (position.startX - position.endX < -50) {
      // 向左
      this.setState({
        nowIndex: index,
        direction:
          item && item.isDefault && item.isDefault === "1" ? "leftMin" : "left",
      });
    } else if (position.startX - position.endX > 50) {
      this.setState({
        nowIndex: index,
        direction:
          item && item.isDefault && item.isDefault === "1"
            ? "rightMin"
            : "right",
      });
    }
  }

  // 删除收货地址
  deleteAddress(addrId) {
    const { deleteAddress } = this.props;
    deleteAddress(addrId);
    this.setState({
      nowIndex: "",
      direction: "",
    });
  }

  // 设为默认地址
  setDefaultAddress(addrId) {
    const { setDefaultAddress } = this.props;
    setDefaultAddress(addrId);
    this.setState({
      nowIndex: "",
      direction: "",
    });
  }

  // 选择地址
  choiceAddress(addrId) {
    const { chooseAddressPT } = this.props;
    chooseAddressPT(addrId);
  }

  render() {
    const { addressData, setState } = this.props;
    const { nowIndex, direction } = this.state;
    if (
      addressData &&
      addressData.allAddress &&
      addressData.allAddress.length === 0
    ) {
      return <NoAddress setState={setState} />;
    }
    return (
      <div className="my_address_all">
        <PageTitle
          _title="收货地址"
          _callback={() =>
            setState({ showAddress: "", addressData: { allAddress: [] } })
          }
          _isBack
         />
        <ul className="my_address_all_ul">
          {addressData &&
            addressData.allAddress &&
            addressData.allAddress.length > 0 &&
            addressData.allAddress.map((item, index) => {
              const { userName, phone, address, isDefault, addrId } = item;
              return (
                <li
                  className={`${index === nowIndex ? direction : ""}`}
                  key={`my_address_all_${index}`}
                  onTouchStart={this.start.bind(this, index, item)}
                  onTouchMove={this.move.bind(this, index, item)}
                  onTouchEnd={this.end.bind(this, index, item)}
                >
                  <img
                    className="address_circle"
                    src={`https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/rb_circle.png`}
                    onClick={() => this.choiceAddress(addrId)}
                  />
                  <div>
                    <p>{userName}</p>
                    <p>{phone}</p>
                    <p>
                      {isDefault && isDefault === "1" ? (
                        <span>[默认地址]</span>
                      ) : (
                        ""
                      )}
                      {address}
                    </p>
                  </div>
                  <DataLink
                    _Href=""
                    _Omniture=""
                    _Title=""
                    _Content=""
                    _Https="https"
                    _Sensor={{
                      eventKey: "myAccountClick",
                      value: {
                        $lib_detail:
                          "M_NewMobile##getSensorData##AllAddressList.js##81",
                        button_name: "管理收货地址-编辑收货地址",
                      },
                    }}
                    _ClickCallback={() =>
                      setState({
                        showAddress: "modify",
                        addressData: { ...addressData, modifyData: item },
                      })
                    }
                  >
                    <img
                      className="address_edit"
                      src="https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/btn_edit.png"
                    />
                  </DataLink>
                  {isDefault && isDefault === "1" ? (
                    ""
                  ) : (
                    <button
                      onClick={this.setDefaultAddress.bind(this, addrId)}
                      className="my_address_all_set_default"
                    >
                      设为默认
                    </button>
                  )}
                  <button
                    className="my_address_all_set_del"
                    onClick={this.deleteAddress.bind(this, addrId)}
                  >
                    删除
                  </button>
                </li>
              );
            })}
        </ul>
        <DataLink
          _Href=""
          _Omniture=""
          _Title=""
          _Content=""
          _Https="https"
          _Sensor={{
            eventKey: "myAccountClick",
            value: {
              $lib_detail: "M_NewMobile##getSensorData##AllAddressList.js##100",
              button_name: "管理收货地址-新增收货地址",
            },
          }}
          _ClickCallback={() =>
            setState({
              showAddress: "add",
            })
          }
        >
          <button className="my_address_increased">新增收货地址</button>
        </DataLink>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {
  initAddress,
})(AllAddressList);
