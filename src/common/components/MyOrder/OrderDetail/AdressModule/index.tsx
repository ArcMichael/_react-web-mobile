import React, { useEffect, useCallback, useState } from "react";
import AddAddressPopup from "./AddAddressPopup";
import ModifyAddressPopup from "./ModifyAddressPopup";
import ProvinceCityPopup from "./ProvinceCityPopup";
import DeliveryAllAddressPopup from "./DeliveryAllAddressPopup";
import OrderDetailAction from "@/lib/services/OrderDetail";
import { popupAlert } from "@/actions/popup";
import { useSelector, useDispatch } from "react-redux";
import {
  showAddressType,
  addressDataType,
  setState,
} from "@/containers/MyOrder/OrderDetail";
import isBrowser from "@/Utils/utils/isBrowser";
import { mapAddressFuncToRun } from "@/actions/myAccount";
if (__DEV__ && isBrowser()) {
  require("../../../../../public/style/myAccountAddress.scss");
}

interface addressInfo {
  userName: string;
  mobilePhone: string;
  telephone: string;
  addrProvince: string;
  addrCity: string;
  addrDistrict: string;
  zipcode: string;
  addrDetail: string;
  isDefault: boolean;
  orderType: string;
  addrId: string;
  orderId: string;
}

// 设为默认地址
function setDefaultAddress(
  id: string,
  setState: setState,
  queryAllAddress: () => void
) {
  if (!id) return alert("请确定！");

  OrderDetailAction.setDefaultAddress(
    JSON.stringify({
      queryBody: {
        addrId: id,
      },
    })
  ).then((json) => {
    const { results, code } = json;
    if (!code) {
      if (results && results != 1) {
        alert("设为默认地址失败! ");
      } else {
        queryAllAddress();
        setState({
          showAddress: "all",
        });
      }
    } else {
      alert("设为默认地址失败");
    }
  });
}

// 删除地址
function deleteAddress(id: string, type: string, queryAllAddress: () => void) {
  if (!id) return alert("请确定！");
  if (confirm("是否确认删除？")) {
    OrderDetailAction.deleteAddress(
      JSON.stringify({
        queryBody: {
          addrId: id,
          orderType: type,
        },
      })
    ).then((json) => {
      const { results, code } = json;
      if (!code) {
        if (results && results != 1) {
          alert("修改地址失败!");
        } else {
          queryAllAddress();
        }
      } else {
        alert("修改地址失败!");
      }
    });
  }
}

// 选择地址（普通订单）
function chooseAddressPT(orderId: string, addressId: string) {
  OrderDetailAction.chooseAddressPT({
    orderId,
    addressId,
  }).then((json) => {
    const { results } = json;
    if (results === 1) {
      window.location.reload();
    }
  });
}

// 修改地址
function editAddress(
  param: addressInfo,
  setState: setState,
  queryAllAddress: () => void,
  initOrderInfo: () => void
) {
  OrderDetailAction.editAddress({ queryBody: param }).then((json) => {
    if (json && json.saveState && json.saveState == "FAILED") {
      alert("修改地址失败! " + json.errorMessage);
      return;
    }
    setState({
      showAddress: "all",
    });
    // 刷新地址列表
    queryAllAddress();
    // 刷新订单页数据
    initOrderInfo();
    // GoogleAnalytics.push({
    //   event: "shoppingCartAction",
    //   eventName: "结算-地址-保存并使用",
    // });
  });
}

// 增加地址
function addAddress(
  param: addressInfo,
  setState: setState,
  initOrderInfo: () => void
) {
  OrderDetailAction.addAddress({ queryBody: param }).then((json) => {
    if (json && json.saveState && json.saveState == "FAILED") {
      alert("新增地址失败! " + json.errorMessage);
      return;
    }
    setState({
      showAddress: "",
    });
    // 刷新订单页数据
    initOrderInfo();
    // GoogleAnalytics.push({
    //   event: "shoppingCartAction",
    //   eventName: "结算-地址-新增收货地址",
    // });
  });
}

const AdressModule: React.FunctionComponent<{
  addressData: addressDataType;
  showAddress: showAddressType;
  setState: setState;
  queryAllAddress: () => void;
  type: string;
  orderId: string;
  initOrderInfo: () => void;
}> = ({
  addressData,
  showAddress,
  setState,
  queryAllAddress,
  type,
  orderId,
  initOrderInfo,
}) => {
  const myAccount: any = useSelector<RootState>((state) => state.myAccount);
  const { province_city_areas, isShowProvince } = myAccount;
  const [Comp, setComp] = useState<JSX.Element | null>(null);
  const dispatch = useDispatch();
  const getComp = useCallback(
    (params: string) => {
      switch (params) {
        case "all":
          return (
            <DeliveryAllAddressPopup
              addressData={addressData}
              setState={setState}
              setDefaultAddress={(index: string) =>
                setDefaultAddress(index, setState, queryAllAddress)
              }
              deleteAddress={(index: string) => {
                deleteAddress(index, type, queryAllAddress);
              }}
              chooseAddressPT={(addressId: string) =>
                chooseAddressPT(orderId, addressId)
              }
              type={type}
             />
          );
        case "add":
          return (
            <AddAddressPopup
              addressData={addressData}
              setState={setState}
              addAddress={(params: addressInfo) => {
                addAddress(params, setState, initOrderInfo);
              }}
              mapAddressFuncToRun={(
                callbackKEY: string,
                parasms: string,
                index: number
              ) => dispatch(mapAddressFuncToRun(callbackKEY, parasms, index))}
              province_city_areas={province_city_areas}
              type={type}
              orderId={orderId}
              popupAlert={(status: number, module: string, data: any) =>
                dispatch(popupAlert(status, module, data))
              }
             />
          );
        case "modify":
          return (
            <ModifyAddressPopup
              addressData={addressData}
              setState={setState}
              editAddress={(param: addressInfo) =>
                editAddress(param, setState, queryAllAddress, initOrderInfo)
              }
              type={type}
              orderId={orderId}
              initOrderInfo={initOrderInfo}
              mapAddressFuncToRun={(
                callbackKEY: string,
                parasms: string,
                index: number
              ) => dispatch(mapAddressFuncToRun(callbackKEY, parasms, index))}
              province_city_areas={province_city_areas}
              popupAlert={(status: number, module: string, data: any) =>
                dispatch(popupAlert(status, module, data))
              }
             />
          );
        default:
          return null;
      }
    },
    [addressData, province_city_areas]
  );
  useEffect(() => {
    setComp(getComp(showAddress));
  }, [showAddress, addressData, province_city_areas]);
  return (
    <div
      className={`myAccount_address address_popup ${showAddress ? "" : "hide"}`}
    >
      {Comp}
      {isShowProvince && <ProvinceCityPopup />}
    </div>
  );
};

export default AdressModule;
