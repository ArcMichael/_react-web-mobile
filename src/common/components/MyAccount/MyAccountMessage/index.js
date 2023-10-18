/*
 * @Author: Leo.Si 
 * @Date: 2019-10-22 10:07:23 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-11-18 16:29:45
 * @function 消息中心显示内容
 */
import React from 'react'
import MyAccountMessageTap from './MyAccountMessageTap'
import MymsgList from './MymsgList'
import MyBeautyList from './MyBeautyList'
const MyAccountMessageModule = ({
    _tapData,
    _scrollTop,
    _list,
    _clickCallback
}) => <div className='my_message_list'>
        <MyAccountMessageTap _tapData={_tapData} _scrollTop={_scrollTop} _clickCallback={_clickCallback} />
        {
            _tapData && _tapData[0] && _tapData[0].active_class && _tapData[0].active_class == 'active' && <MyBeautyList _list={_list} />
        }
        {
            _tapData && _tapData[1] && _tapData[1].active_class && _tapData[1].active_class == 'active' && <MymsgList _list={_list} />
        }
    </div>
export default MyAccountMessageModule
