import React, { Component } from 'react';
import LazyloadImage from '@/components/LazyloadImage';
import MyAccount from '@/lib/services/MyAccount';
import UTMP from '@/components/MyAccount/MyAccountCenter/UTMP';

const {
  myAccountInfo: { cardImage },
} = UTMP;

/**
 * @typedef {{
 * }} UserCardProps
 */

/**
 * @extends {React.Component<UserCardProps>}
 */
export default class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /** @type {import('@/lib/services/MyAccount').UserCardDTO} - description */
      cardInfo: {},
    };
  }
  componentDidMount() {
    MyAccount.user.userCardInfo().then(res => {
      if (res.status === 0 && res.results) {
        this.setState({
          cardInfo: res.results,
        });
      }
    });
  }

  render() {
    const { cardInfo } = this.state;

    return (
      <div className="text islogin">
        <span>Hi,&nbsp;&nbsp;{cardInfo.nickName}</span>
        <LazyloadImage
          imgProps={{
            src: cardImage[cardInfo.cardType],
          }}
         />
      </div>
    );
  }
}
