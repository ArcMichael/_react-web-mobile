/*
 * @Author: Leo.Si 
 * @Date: 2019-08-19 14:23:08 
 * @Last Modified by: summer
 * @Last Modified time: 2021-01-22 10:40:45
 * @function 积分记录页面 顶部信息  1.当前积分 2.提示信息
 */
import React from 'react'
const MyAccountIntegralRecordInfo = ({
    _data
})=><div className='myAccount_integral_record_info'>
    <p>当前积分</p>
    <p>{_data.cardPoints}</p>
    {/* <p>{_data.benefitsInfo}</p> */}
</div>
export default MyAccountIntegralRecordInfo