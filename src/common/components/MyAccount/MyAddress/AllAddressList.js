/*
 * @Author: Leo.Si
 * @Date: 2019-08-23 10:00:15
 * @Last Modified by: summer
 * @Last Modified time: 2021-05-Sa 02:51:05
 * @function 收货地址管理页面 展示所有的地址列表
 */
import React from "react";
import { connect } from "react-redux";
import { choiceAddress } from "@/lib/BLL";
import { initAddress } from "@/actions/myAccount";
import { lotteryAddress } from "@/actions/LotteryActivity";
import * as device from "@/lib/device";
import { setupWeChat } from "@/actions/dependency";
import { urlGetParams } from "@/lib/url";
import DataLink from "../../Atoms/DataLink";
import getRunEnv from "../../../../isomorphisms/getRunEnv";

class AllAddressList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    const { _clickCallback } = this.props;
    _clickCallback && _clickCallback("deleteAddress", addrId);
    this.setState({
      nowIndex: "",
      direction: "",
    });
  }

  // 设为默认地址
  setDefaultAddress(addrId) {
    const { _clickCallback } = this.props;
    _clickCallback && _clickCallback("setDefaultAddress", addrId);
    this.setState({
      nowIndex: "",
      direction: "",
    });
  }

  ckickAddress(index, item) {
    let host = "https://m.sephora.cn";
    const env = getRunEnv();
    if (env === "stage") {
      host = "https://stagem.sephora.cn";
    } else if (env === "ebf") {
      host = "https://ebfm.sephora.cn";
    }
    const params = {
      queryBody: {
        addressId: item.addrId,
        type: "1",
      },
    };
    choiceAddress(params, () => {
      const typeUrl = urlGetParams(  window.location, "type")
      // this.props.initAddress();
      this.props.lotteryAddress({ addrId: item.addrId }, (callback) => {
        if (callback) {
          const idUrl = urlGetParams( window.location,typeUrl == 'quest' ? "wid" : "id");
          const addressUrl = typeUrl == 'quest' ? 'questionnaire' : 'lotteryActivity';
          const token = urlGetParams(window.location,"token");
          const step = urlGetParams(window.location, "step") || 1;
          if (device.device_inMiniProgramsEnvironment()) {
            wx.miniProgram.navigateTo({
              url: `/sp/web?nto=1&nui=1&url=${encodeURIComponent(
                `${host}/v2/html/${addressUrl}?id=${idUrl}&token=${token}&step=${step}`
              )}`,
            });
          } else {
            window.location.href = `${host}/v2/html/${addressUrl}?id=${idUrl}`;
          }
        }
      });
    });
  }

  componentDidMount() {
    const { setupWeChat } = this.props;
    if (device.isWeChat()) {
      setupWeChat({
        callback: () => {},
      });
    }
  }

  render() {
    const { _data, _clickCallback, _type } = this.props;
    const { nowIndex, direction } = this.state;
    return (
      <div className="my_address_all">
        <ul className="my_address_all_ul">
          {_data &&
            _data.length > 0 &&
            _data.map((item, index) => {
              const { userName, phone, address, isDefault, addrId, check } =
                item;
              if (_type) {
                return (
                  <li
                    className={`${index === nowIndex ? direction : ""}`}
                    key={`my_address_all_${index}`}
                    onTouchStart={this.start.bind(this, index, item)}
                    onTouchMove={this.move.bind(this, index, item)}
                    onTouchEnd={this.end.bind(this, index, item)}
                  >
                    <img
                      onClick={this.ckickAddress.bind(this, index, item)}
                      className="address_circle"
                      src={`https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/${
                        check && check == 1 ? "rb_circle_selected" : "rb_circle"
                      }.png`}
                    />
                    <div onClick={this.ckickAddress.bind(this, index, item)}>
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
                      _ClickCallback={_clickCallback.bind(
                        this,
                        "switchAddressShow",
                        "modifyAddress",
                        index
                      )}
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
              }
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
                    src={`https://ssl1.sephorastatic.cn/soa/nmobile/img/myAccount/${
                      check && check == 1 ? "rb_circle_selected" : "rb_circle"
                    }.png`}
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
                    _ClickCallback={_clickCallback.bind(
                      this,
                      "switchAddressShow",
                      "modifyAddress",
                      index
                    )}
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
          _ClickCallback={_clickCallback.bind(
            this,
            "switchAddressShow",
            "addAddress"
          )}
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
  lotteryAddress,
  setupWeChat,
})(AllAddressList);
