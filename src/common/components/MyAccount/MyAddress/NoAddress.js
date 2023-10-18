/*
 * @Author: Leo.Si 
 * @Date: 2019-08-27 11:37:56 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-08-27 13:40:44
 * @function 当没有收货地址时，popup提示
 */
import React from 'react'
const NoAddress = ({
    _clickCallback
}) =>
    < div className="my_address_no"  >
        <div className="my_address_no_bg" />
        <div className="my_address_no_text">
            <p>您还没有收货地址，赶快设置一个吧！</p>
            <a className="btn-set-address" onClick={_clickCallback.bind(this, 'switchAddressShow', 'addAddress')} >去设置</a>
            <img className="my_address_no_close"  onClick={_clickCallback.bind(this, 'switchAddressShow', 'allAddress')}  src='https://ssl1.sephorastatic.cn/soa/mobile/images/common_searchtop_delete.png'/>
        </div>
    </div >
export default NoAddress