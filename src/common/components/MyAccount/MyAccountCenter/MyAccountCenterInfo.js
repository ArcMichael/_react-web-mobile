/*
 * @Author: Leo.Si
 * @Date: 2019-08-15 19:25:41
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-10 17:09:03
 * @function 展示用户的头像(string)、昵称(string)、是否为丝享派（Object, isEnjoyMent.state(0不是,1是,2加入丝享派),isEnjoyMent.imageUrl）、设置选项(string)
 */
import React from 'react';
import MyAccountCenterCardInfo from './MyAccountCenterCardInfo';
import DataLink from '../../Atoms/DataLink';
import Image from '../../ImagesLazyLoad/index';
const MyAccountCenterInfo = ({ _myAccountInfo, _clickCallback }) => (
  <div className="myaccount_center_info">
    <DataLink
      _Href={_myAccountInfo.profilePageUrl}
      _Omniture=""
      _Title=""
      _Content=""
      _Https="https"
      _Sensor={{
        eventKey: 'myAccountClick',
        value: {
          $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterInfo.js##20',
          button_name: '个人信息',
        },
      }}
    >
      {/* <img src={_myAccountInfo.photo} className="myaccount_center_info_photo" /> */}
      <Image
                className="myaccount_center_info_photo" 
                src={_myAccountInfo.photo}
              />
    </DataLink>
    <p className="myaccount_center_info_nackName">{_myAccountInfo.nickname}</p>
    {_myAccountInfo.isEnjoyMent &&
      _myAccountInfo.isEnjoyMent.state &&
      (_myAccountInfo.isEnjoyMent.state === 1 ? (
        <img src={_myAccountInfo.isEnjoyMent.imageUrl[0]} className="myaccount_center_info_is" />
      ) : (
        <div className="myaccount_center_info_no">
          <DataLink
            _Href=""
            _Omniture=""
            _Title=""
            _Content=""
            _Https="https"
            _Sensor={{
              eventKey: 'myAccountClick',
              value: {
                $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterInfo.js##35',
                button_name: '加入丝享派',
              },
            }}
          >
            <img src={_myAccountInfo.isEnjoyMent.imageUrl[1]} />
            <p>加入丝享派</p>
            <span className="common_arrow_right" />
          </DataLink>
        </div>
      ))}
    <DataLink
      _Href=""
      _Omniture=""
      _Title=""
      _Content=""
      _Https="https"
      _Sensor={{
        eventKey: 'myAccountClick',
        value: {
          $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterInfo.js##50',
          button_name: '我的消息',
        },
      }}
      _ClickCallback={_clickCallback.bind(this, 'toMyMessage')}
    >
      <div className="myaccount_center_info_news_content">
        <img src={_myAccountInfo.myNewsImageUrl} className="myaccount_center_info_news" />
        {_myAccountInfo.myNewsCount ? <span className="myaccount_center_info_news_count" /> : null}
      </div>
    </DataLink>
    <DataLink
      _Href={_myAccountInfo.setUp}
      _Omniture=""
      _Title=""
      _Content=""
      _Https="https"
      _Sensor={{
        eventKey: 'myAccountClick',
        value: {
          $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterInfo.js##60',
          button_name: '账号管理',
        },
      }}
    >
      <img src={_myAccountInfo.setUpImageUrl} className="myaccount_center_info_setUp" />
    </DataLink>
    <MyAccountCenterCardInfo _info={_myAccountInfo} _clickCallback={_clickCallback} />
  </div>
);
export default MyAccountCenterInfo;
