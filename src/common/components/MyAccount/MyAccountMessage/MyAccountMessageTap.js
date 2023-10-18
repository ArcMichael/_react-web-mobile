/*
 * @Author: Leo.Si
 * @Date: 2019-10-22 10:15:11
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-10-29 11:19:25
 * @function 消息中心tap切换
 */
import React from 'react'
const MyAccountMessageTap = ({
  _tapData,
  _scrollTop,
  _clickCallback,
}) =>
  !!_tapData && <ul className={`my_msg_list_tap ${_scrollTop > 200 ? 'my_msg_list_tap_scroll' : ''}`}>
    {
      _tapData &&
            _tapData.length > 0 &&
            _tapData.map((item, index) => {
              const { name, active_class, isRead, identification } = item
              return <li key={`my_msg_list_tap_${index}`} onClick={_clickCallback.bind(this, 'mymsgClick', {
                nowIndex: index,
                isRead,
                identification,
                active_class,
                name,
              })}>
                <p className={active_class}>{name}</p>
                {isRead && <span />}
              </li>
            })
    }
  </ul>
export default MyAccountMessageTap
