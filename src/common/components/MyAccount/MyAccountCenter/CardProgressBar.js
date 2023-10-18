import React from 'react';

export default class CardProgressBar extends React.Component {
  render() {
    let { upgradeProcess = 0, cardLevel, _ordinary } = this.props;
    if (upgradeProcess < 0) {
      upgradeProcess = 0;
    }
    if (!_ordinary) {
      cardLevel = '123';
    }
    const upgradeProcessValue = upgradeProcess * 100;
    return (
      <div className="card-progress-bar">
        <div className="axis">
          <div className="pink-card card-style">
            <div className={`pink point   ${!_ordinary && 'card-disable'}`} />
            <div
              className={`line line1 ${!_ordinary && 'disable-line'}`}
              style={{ width: cardLevel === '粉卡会员' && `${upgradeProcessValue}%` }}
             />
            <div
              className="disable-line"
              style={{
                width: cardLevel === '粉卡会员' && `${100 - upgradeProcessValue}%`,
              }}
             />
          </div>
          <div className="white-card card-style">
            <div className={`white point ${cardLevel === '粉卡会员' || !_ordinary ? 'card-disable' : ''}`} />
            <div
              className={`line line2 ${!_ordinary && 'disable-line'}`}
              style={{ width: cardLevel === '白卡会员' && `${upgradeProcessValue}%` }}
              style={{
                width: (cardLevel === '白卡会员' && `${upgradeProcessValue}%`) || (cardLevel === '粉卡会员' && '0%'),
              }}
             />
            <div
              className="disable-line"
              style={{
                width:
                  (cardLevel === '白卡会员' && `${100 - upgradeProcessValue}%`) || (cardLevel === '粉卡会员' && '100%'),
              }}
             />
          </div>
          <div className="black-card card-style">
            <div
              className={`black point ${(cardLevel === '白卡会员' || cardLevel === '粉卡会员' || !_ordinary) &&
                'card-disable'}`}
             />
            <div
              className={`line line3 ${!_ordinary && 'disable-line'}`}
              style={{
                width:
                  (cardLevel === '黑卡会员' && `${upgradeProcessValue}%`) ||
                  ((cardLevel === '白卡会员' || cardLevel === '粉卡会员') && '0%'),
              }}
             />
            <div
              className={`disable-line`}
              style={{
                width:
                  (cardLevel === '黑卡会员' && `${100 - upgradeProcessValue}%`) ||
                  ((cardLevel === '白卡会员' || cardLevel === '粉卡会员') && '100%'),
              }}
             />
          </div>
          <div className="glod-card card-style">
            <div
              className={`glod point  ${(cardLevel === '黑卡会员' ||
                cardLevel === '白卡会员' ||
                cardLevel === '粉卡会员' ||
                !_ordinary) &&
                'card-disable'}`}
             />
          </div>
        </div>
        <div className="card-texts">
          <div className="card-text pink ">粉卡</div>
          <div className="card-text white">白卡</div>
          <div className="card-text black">黑卡</div>
          <div className="card-text glod">金卡</div>
        </div>
      </div>
    );
  }
}
