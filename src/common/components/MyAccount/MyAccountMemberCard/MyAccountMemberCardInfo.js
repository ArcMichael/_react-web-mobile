/*
 * @Author: Leo.Si
 * @Date: 2019-08-19 18:17:05
 * @Last Modified by: summer
 * @Last Modified time: 2020-12-21 10:24:36
 * @function 会员权益页面 用户卡信息  1.卡类型 2.会员等级 3.会员卡号 4.更改会员卡入口
 */
import React from 'react';
import DataLink from '../../Atoms/DataLink';
import Image from '../../ImagesLazyLoad/index';
const MyAccountMemberCardInfo = ({ _data, _clickCallback }) => (
  <div className="myAccount_integral_member_card_info">
    <div className="member_info">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src={_data && _data.cardImageUrl} />
        {/* <img src={_data && _data.cardImageUrl} /> */}
        <div className="member-level">
          <p>{_data && _data.cardImageText}</p>
          <p>{_data && _data.cardNo}</p>
        </div>
      </div>
      <DataLink
        _Href=""
        _Omniture=""
        _Title=""
        _Content=""
        _Https="https"
        _Sensor={{
          eventKey: 'myAccountClick',
          value: {
            $lib_detail: 'M_NewMobile##getSensorData##MyAccountMemberCardInfo.js##20',
            button_name: '会员权益-更换会员卡',
          },
        }}
        _ClickCallback={_clickCallback.bind(this, _data && _data.changeMemberUrl)}
      >
        更换会员卡{`>`}
      </DataLink>
    </div>
    <div>
      {_data && _data.benefitsInfo && <em>{_data.benefitsInfo}</em>}
      {_data && _data.cardPoints && (
        <a className="member-point" href="/myAccount/integralFlow">
          会员积分<span>{_data.cardPoints}</span>
          <img className="arrow-right" src="https://ssl1.sephorastatic.cn/soa/nmobile/img/arrow_right.png" />
        </a>
      )}
    </div>
  </div>
);
export default MyAccountMemberCardInfo;
