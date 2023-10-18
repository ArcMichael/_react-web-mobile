/*
 * @Author: Leo.Si 
 * @Date: 2019-08-16 14:20:21 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2020-02-12 11:24:04
 * @function 展示用户的订单信息
 */

import React from 'react'
import ToolLists from './ToolLists'
import SwiperOrder from './SwiperOrder'
import DataLink from '../../Atoms/DataLink'
const MyAccountCenterOrder = ({
    _order,
    _myAccountInfo,
    _orderSwiper
}) => <div className={`myaccount_center_order ${_myAccountInfo.cardInfoClass?'':'myaccount_center_order_less'}`}>
        <div className='myaccount_center_order_entry'>
            <div className='myaccount_center_title'>我的订单</div>
            <DataLink _Href='/myOrderList?orderType=all' _ClassName='myaccount_center_order_all' _Omniture='' _Title='' _Content='' _Https='https'
                _Sensor={{
                    'eventKey': 'myAccountClick',
                    'value': {
                        $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterOrder.js##22',
                        button_name: '我的订单-所有订单'
                    },
                }}
            >
                所有订单
                <em className='icon-arrow' />
            </DataLink >
        </div>
        <ToolLists _data={_order} />
        {_orderSwiper && _orderSwiper.length>0?<SwiperOrder orderSwiper={_orderSwiper} />:null}
    </div>
export default MyAccountCenterOrder