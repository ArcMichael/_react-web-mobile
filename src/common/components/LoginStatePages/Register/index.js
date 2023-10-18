/*
 * @Author: Leo.Si 
 * @Date: 2019-12-10 16:52:43 
 * @Last Modified by: Leo.Si
 * @Last Modified time: 2019-12-30 11:23:07
 * @function register page content
 */

import React from 'react'
import RegisterEnter from './RegisterEnter'
import ChooseCard  from './ChooseCard'
import TieCard from './TieCard'
const showType = {
    'registerEnter': RegisterEnter,
    'chooseCard':ChooseCard,
    'tieCard':TieCard
}
const RegisterContent = ({
    _status,
    _cardList,
    _info,
    _clickCallback
}) => {
    if (!_status) return null
    let ComponentDetail = showType[_status]
    return <ComponentDetail _info={_info} _clickCallback={_clickCallback} _cardlist={_cardList}/>
}
export default RegisterContent