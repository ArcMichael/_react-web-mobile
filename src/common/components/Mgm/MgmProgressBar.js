import React from 'react';
import { urlGetParams } from '../../lib/url';
export default class MgmProgressBar extends React.Component {
  getBtnStatus(applyStatus, i) {
    switch (applyStatus) {
      case 1:
        return (
          <a className="progress-txt-wait" key={`progress-text-${i}`}>
            待解锁
          </a>
        );
      case 2:
        return (
          <a
            className="progress-txt-can"
            key={`progress-text-${i}`}
            href={`/v2/html/mgmTrialApplication?eventId=${urlGetParams(window.location, 'eventId')}&stepNo=${i + 1}`}
          >
            可领取
          </a>
        );
      case 3:
        return (
          <a
            className="progress-txt-has"
            key={`progress-text-${i}`}
            href={`/v2/html/mgmTrialApplication?eventId=${urlGetParams(window.location, 'eventId')}&stepNo=${i + 1}`}
          >
            已领取
          </a>
        );
        case 4:
          return (
            <a
              className="progress-txt-has"
              key={`progress-text-${i}`}
              href={`/v2/html/mgmTrialApplication?eventId=${urlGetParams(window.location, 'eventId')}&stepNo=${i + 1}`}
            >
              已领取
            </a>
          );
          case 5:
            return (
              <a
                className="progress-txt-has"
                key={`progress-text-${i}`}
                href={`/v2/html/mgmTrialApplication?eventId=${urlGetParams(window.location, 'eventId')}&stepNo=${i + 1}`}
              >
                已领取
              </a>
            );
    }
  }
  render() {
    let { _giftEventStepInfo } = this.props;
    // 申领状态: 0-活动未开始; -1-活动已结束; 1-申领条件不够; 2-申领条件够,未申领; 3-线上领取完成; 4-线下领取，未到卡包; 5-线下领取完成;
    let activeStyle;
    if (
      _giftEventStepInfo &&
      _giftEventStepInfo.partnerNum < _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum &&
      _giftEventStepInfo.partnerNum > 0
    ) {
      activeStyle = 'active-part';
    } else if (_giftEventStepInfo.partnerNum >= _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum) {
      activeStyle = 'active-all';
    } else {
      activeStyle = '';
    }
    let secondeStlye;
    if (
      _giftEventStepInfo &&
      _giftEventStepInfo.partnerNum &&
      _giftEventStepInfo.partnerNum < _giftEventStepInfo.giftEventStepDtos[1].needPartnerNum &&
      _giftEventStepInfo.partnerNum > _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum
    ) {
      secondeStlye = 'active-part';
    } else if (
      _giftEventStepInfo &&
      _giftEventStepInfo.partnerNum &&
      _giftEventStepInfo.partnerNum >= _giftEventStepInfo.giftEventStepDtos[1].needPartnerNum
    ) {
      secondeStlye = 'active-all';
    } else {
      secondeStlye = '';
    }

    return (
      <div className="progress-bar-box">
        <div className="progress-status">
          <div className="progress-box">
            <div className="progress-txt-share">分享助力</div>
            <div className={`big-point`}>
              <div
                className={`small-point ${
                  (_giftEventStepInfo &&
                    _giftEventStepInfo.giftEventStepDtos &&
                    _giftEventStepInfo.giftEventStepDtos[0].applyStatus !== 1) ||
                  (_giftEventStepInfo &&
                    _giftEventStepInfo.partnerNum <= _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum &&
                    _giftEventStepInfo.partnerNum > 0)
                    ? 'active'
                    : ''
                }`}
               />
              <div className="big-bar">
                <div className={`small-bar ${activeStyle}`} />
              </div>
            </div>
            <div className="progress-text">
              <img
                className={`step-icon ${
                  (_giftEventStepInfo &&
                    _giftEventStepInfo.giftEventStepDtos &&
                    _giftEventStepInfo.giftEventStepDtos[0].applyStatus !== 1) ||
                  (_giftEventStepInfo &&
                    _giftEventStepInfo.partnerNum <= _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum &&
                    _giftEventStepInfo.partnerNum > 0)
                    ? 'active'
                    : ''
                }`}
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm-h5-step1.png"
              />
              <div className="step-text">
                <div>·····</div>
                <div className="desc-text">{`邀请${_giftEventStepInfo &&
                  _giftEventStepInfo.giftEventStepDtos &&
                  _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum}人`}</div>
                <div>·····</div>
              </div>
            </div>

            <div className="step-no">
              STEP <span>1</span>
            </div>
          </div>
          <div className="progress-box">
            {this.getBtnStatus(_giftEventStepInfo.giftEventStepDtos[0].applyStatus, 0)}
            <div className={`big-point`}>
              <div
                className={`small-point ${
                  _giftEventStepInfo &&
                  _giftEventStepInfo.partnerNum >= _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum
                    ? 'active'
                    : ''
                }`}
               />
              <div className="big-bar">
                <div className={`small-bar ${secondeStlye}`} />
              </div>
            </div>
            <div className="progress-text">
              <img
                className={`step-icon ${
                  _giftEventStepInfo &&
                  _giftEventStepInfo.partnerNum >= _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum
                    ? 'active'
                    : ''
                }`}
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm-h5-step2.png"
              />
              <div className="step-text2">
                <div>····</div>
                <div className="desc-text">{`再邀请${_giftEventStepInfo &&
                  Number(
                    _giftEventStepInfo.giftEventStepDtos && _giftEventStepInfo.giftEventStepDtos[1].needPartnerNum,
                  ) -
                    Number(
                      _giftEventStepInfo.giftEventStepDtos && _giftEventStepInfo.giftEventStepDtos[0].needPartnerNum,
                    )}人`}</div>
                <div>····</div>
              </div>
            </div>

            <div className="step-no">
              STEP <span>2</span>
            </div>
          </div>
          <div className="progress-box">
            {this.getBtnStatus(_giftEventStepInfo.giftEventStepDtos[1].applyStatus, 1)}
            <div className={`big-point`}>
              <div
                className={`small-point ${
                  _giftEventStepInfo &&
                  _giftEventStepInfo.partnerNum >= _giftEventStepInfo.giftEventStepDtos[1].needPartnerNum
                    ? 'active'
                    : ''
                }`}
               />
            </div>
            <div className="progress-text">
              <img
                className={`step-icon ${
                  _giftEventStepInfo &&
                  _giftEventStepInfo.partnerNum >= _giftEventStepInfo.giftEventStepDtos[1].needPartnerNum
                    ? 'active'
                    : ''
                }`}
                src="https://ssl1.sephorastatic.cn/soa/nmobile/img/mgm-h5-step3.png"
              />
            </div>

            <div className="step-no">
              STEP <span>3</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}