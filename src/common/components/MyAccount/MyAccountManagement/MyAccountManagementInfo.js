/*
 * @Author: Leo.Si 
 * @Date: 2019-08-17 14:16:40 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-09-05 17:08:04
 * @function 账号管理页面 具体信息
 */
import React from 'react'
import { judgeIsChangeUser } from '../../../lib/Tools'
import OptionList from './OptionList'
import DataLink from '../../Atoms/DataLink'
const MyAccountManagementInfo = ({
    _data,
    _userGroup,
    _clickCallback
}) => <div className='myAccount_management_con'>
        <DataLink _Href='/myAccount/profile.html' _Omniture='' _Title='' _Content='' _Https='https'
            _Sensor={{
                'eventKey': 'myAccountClick',
                'value': {
                    $lib_detail: 'M_NewMobile##getSensorData##MyAccountManagementInfo.js##20',
                    button_name: '账号管理-个人信息'
                },
            }}
        >
            <div className='myAccount_management_info'>
                <img src={_data && _data.userInfo && _data.userInfo.photo} className='myAccount_management_info_photo' />
                <p className='myAccount_management_info_nackName'>
                    {_data && _data.userInfo && _data.userInfo.nickname}
                    {_data && _data.userInfo && !_data.userInfo.isCompleted ? <span /> : null}
                </p>
                <em className='icon_right_arrow' />
            </div>
        </DataLink >
        <OptionList _userGroup={_userGroup} _data={_data && _data.managementInfo} _clickCallback={_clickCallback} />
        <DataLink _Href='' _Omniture='' _Title='' _Content='' _Https='https' _ClassName='managementInfo managementInfo_sign_out'
            _Sensor={{
                'eventKey': 'myAccountClick',
                'value': {
                    $lib_detail: 'M_NewMobile##getSensorData##MyAccountManagementInfo.js##39',
                    button_name: '账号管理-退出当前账户'
                },
            }}
            _ClickCallback={_clickCallback.bind(this, 'signOut')}
        >
            <p>{judgeIsChangeUser() ? '切换账号' : '退出当前账户'}</p>
        </DataLink >
    </div >
export default MyAccountManagementInfo