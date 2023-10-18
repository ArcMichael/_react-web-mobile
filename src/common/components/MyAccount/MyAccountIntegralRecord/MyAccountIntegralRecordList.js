/*
 * @Author: Leo.Si 
 * @Date: 2019-08-19 16:06:05 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-09-02 11:09:46
 * @function 积分记录页面 积分记录信息列表
 */
import React from 'react'
const MyAccountIntegralRecordList = ({
    _data
}) => <div className='myAccount_integral_record_List'>
        <p className='myAccount_integral_record_title'>积分记录</p>
        <ul>
            {
                _data &&
                _data.memberCardPointsFlowDtos &&
                _data.memberCardPointsFlowDtos.length > 0 &&
                _data.memberCardPointsFlowDtos.map((item, index) =>
                    <li key={`myAccount_integral_record_List_${index}`}>
                        <span>{item.type}</span>
                        <span>{item.createTime}</span>
                        <span className={`${item.changeType == 'subtract' ? 'myAccount_integral_record_List_color' : ''}`}>{item.changePoints}</span>
                    </li>
                )}
        </ul>
        {
            _data && _data.isBottom ? <p className='myAccount_integral_record_loaded'>已经全部加载完毕</p> : null
        }
    </div>
export default MyAccountIntegralRecordList