/*
 * @Author: Martin.song
 * @LastEditors: zone Tian
 * @Descripttion:
 * @version: 0.2
 * @Date: 2020-10-17 13:53:46
 * @LastEditTime: 2021-02-24 12:01:53
 */
import React from "react";
let buttleTimer = null;
let isTop = false;
//弹幕
class Bulletcomments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showButtle: false,
      bulletChatList: [],
    };
  }
  componentWillUnmount() {
    buttleTimer;
    clearInterval(buttleTimer);
  }

  componentDidUpdate() {
    const { bulletChatList } = this.props;
    const { showButtle } = this.state;
    const arr = [];
   if (bulletChatList) {
    bulletChatList.map((itme) => {
      return arr.push({text:`${itme.nickname}捐助了${itme.integral}积分`,left: arr.length * 160,top: 0 });
    });
   }
    if (bulletChatList && !showButtle) {
      this.updateButtle(arr);
    }
  }

  updateButtle(arr) {
    this.setState({ showButtle: true });
    buttleTimer = setInterval(() => {
      let data = arr;
      for (let i = data.length - 1; i >= 0; i--) {
        let num = 2;
        if (data[i].left < -160) {
          data[i].top = (i % num) + 1 === 1 ? 12 : 48;
          data[i].left = 800;
        }
        data[i].left = data[i].left - 1;
        //弹幕的高度随机
        if (data[i].top === 0) {
          // console.log()
          // console.log(i,i%num)
          data[i].top = isTop ? 1 * 12 : 48;
          isTop = !isTop;
        }
      }
      this.setState({ bulletChatList: data });
    }, 30);
  }
  componentDidMount() {}

  render() {
    const { bulletChatList } = this.state;

    return (
      <div className="bulletChatContainer">
        <div className="bulletChat">
          {/* <div style={{ top: '50px', left: `${left}px` }}>手机号9234的好心人捐助了500积分</div> */}
          {bulletChatList.map((item, index) => {
            return (
              <div
                className="buttle"
                key={index + "_" + ""}
                style={{ top: `${item.top}px`, left: `${item.left}px` }}
              >
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

// export default connect(mapStateToProps, {})(Bulletcomments);
export default Bulletcomments;
