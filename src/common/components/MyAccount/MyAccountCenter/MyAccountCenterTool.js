/*
 * @Author: Leo.Si 
 * @Date: 2019-08-16 14:20:21 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-08-29 20:11:00
 * @function 展示用户的玩美服务
 */

import React from 'react'
import ToolLists from './ToolLists'
const MyAccountCenterTool = ({
    _order,
    _clickCallback
}) => !!_order && <div className='myaccount_center_tool'>
    <div className='myaccount_center_order_entry'>
        <div className='myaccount_center_title'>玩美服务</div>
    </div>
    <ToolLists _data={_order} _clickCallback={_clickCallback} />
</div>
export default MyAccountCenterTool
