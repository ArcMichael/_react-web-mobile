/*
 * @Author: Leo.Si
 * @Date: 2019-09-12 15:56:42
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-12-03 15:06:02
 * @function onlinereturn 原因公共样式
 * @props _obj:{
 *  name ----显示条件名
 *  iconUrl ----是否展示向右的箭头
 *  value ---- 默认选中的值
 * }
 */

import { urlGetParams } from "@/lib/url";
import React from "react";
export default class OnlineReturnReason extends React.Component {
  constructor(props){
    super(props)
    this.state={
      status:""
    }
  }
  componentDidMount(){
    let status=urlGetParams(window.location,"returnStatus")
    this.setState({
      status
    })
  }
  render() {
    let { _obj, _clickCallback, _tile } = this.props;
    const {status}=this.state
    return (
      <div
        className="online_return_page_reason"
        onClick={()=>{
          if (status&&status=="RRRS"&&_obj.name=="退货数量") 
            return
          _clickCallback && _clickCallback.call(this, _obj.callbackKEY, true)
        }}
      >
        <p>{_obj.name}</p>
        {!_obj.value && _obj.name === "退货原因" ? (
          <p style={{ color: "#737373" }}>{_tile || "请选择"}</p>
        ) : null}
        {!_obj.value && _tile && <p style={{ color: "#737373" }}>{_tile}</p>}
        {_obj.value ? (
          <p className={_obj.hasRight ? "online_return_page_reason_value_right" : ""}>
            {_obj.value}
          </p>
        ) : null}
        {_obj.iconUrl&&status&&!(_obj.name=="退货数量"&&status=="RRRS") && <img src={_obj.iconUrl} />}
      </div>
    );
  }
}
