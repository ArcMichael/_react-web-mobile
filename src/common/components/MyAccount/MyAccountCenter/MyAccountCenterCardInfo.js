/*
 * @Author: Leo.Si
 * @Date: 2019-08-16 10:01:44
 * @Last Modified by: summer
 * @Last Modified time: 2020-12-21 09:56:43
 * @function 展示会员的积分、优惠券数量、卡级别
 */
import React from 'react';
import DataLink from '../../Atoms/DataLink';
import CardProgressBar from './CardProgressBar';
import Image from '../../ImagesLazyLoad/index';

const MyAccountCenterCardInfo = ({ _info, _clickCallback }) => (
  <div className={`myaccount_center_card ${_info.cardInfoClass ? '' : 'myaccount_center_card_less'}`}>
    <div className="myaccount_center_cardinfo">
      <div className="myaccount_center_card_con_point">
        <DataLink
          _Href=""
          _Omniture=""
          _Title=""
          _Content=""
          _Https="https"
          _Sensor={{
            eventKey: 'myAccountClick',
            value: {
              $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterCardInfo.js##32',
              button_name: '会员积分',
            },
          }}
          _ClickCallback={_clickCallback.bind(this, _info.integralRecordUrl)}
        >
          <p>
            <span>积分</span>
            <span>{_info.cardPoints}</span>
          </p>
        </DataLink>
        {_info.cardExtendSysId ? <span className="myaccount_center_point_count" /> : null}
      </div>

      <DataLink
        _Href={_info.couponUrl}
        _Omniture=""
        _Title=""
        _Content=""
        _Https="https"
        _Sensor={{
          eventKey: 'myAccountClick',
          value: {
            $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterCardInfo.js##47',
            button_name: '优惠券',
          },
        }}
      >
        <p className="myaccount_center_card_con_coupon">
          <span>优惠券</span>
          <span>{_info.couponCounts}</span>
        </p>
      </DataLink>
    </div>

    <div className="myaccount_center_card_con">
      <DataLink
        _Href=""
        _Omniture=""
        _Title=""
        _Content=""
        _Https="https"
        _Sensor={{
          eventKey: 'myAccountClick',
          value: {
            $lib_detail: 'M_NewMobile##getSensorData##MyAccountCenterCardInfo.js##19',
            button_name: '查看会员卡详情',
          },
        }}
        _ClickCallback={_info.userGroup ? _clickCallback.bind(this, _info.memberCardUrl) : null}
      >
        <div className="myaccount_center_level">
          {/* <img src={_info.cardImageUrl} /> */}
          <Image src={ _info.cardImageUrl}/>
          <div className="myaccount_center_card_con_level">{_info.cardLevel}</div>
        </div>
      </DataLink>
      <div>
        <CardProgressBar
          cardLevel={_info.cardLevel}
          upgradeProcess={_info.upgradeProcess}
          _ordinary={_info.userGroup}
        />
        {_info.cardBenefitsInfo && _info.userGroup ? (
          <p className="myaccount_center_card_con_cardBenefitsInfo">{_info.cardBenefitsInfo}</p>
        ) : null}
      </div>
    </div>
  </div>
);
export default MyAccountCenterCardInfo;
