/*
 * @Author: Leo.Si 
 * @Date: 2019-09-17 20:29:34 
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-07-21 14:55:20
 * @function OnlineReturn  退货/售后 列表 tab切换
 */
import React from 'react'
const OnlineReturnListTap = ({
    _data,
    _scrollTop,
    _clickCallback
}) =>
    !!_data && <ul className={`online_return_list_tap ${_scrollTop>200?'online_return_list_tap_scroll':''}`}>
        {
            _data &&
            _data.length > 0 &&
            _data.map((item, index) => {
                const { name, showStatus,  active_class } = item
                return <li key={`online_return_list_tap_${index}`} onClick={_clickCallback.bind(this,'returnListTap',{
                    nowIndex: index,
                    showStatus
                })}>
                    <p className={active_class}>{name}</p>
                </li>
            })
        }
    </ul>
export default OnlineReturnListTap