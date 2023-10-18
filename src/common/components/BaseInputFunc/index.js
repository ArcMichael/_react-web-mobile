/*
 *
 * Producer -- Alvin
 * Time -- 2017/10/17
 * Function -- Basic component contains common function for extend
 *
 */
import React from 'react'

export default class BaseInputFunc extends React.Component {
  /*
   * Set value callback for base input
   */
  setValue(name, callback, nowValue) {
    this.setState({
      [name]: nowValue,
    }, () => {
      callback && callback.call(this)
    })
  }
  /*
   * Callback for onBlur event of baseinput component
   */
  setInputLineValue(name, val) {
    this.setState({
      [name + 'RedOrGreen']: val,
      [name + 'ErrorCode']: 0,
    })
  }
  /*
   * Filter value from base input component
   */
  filterValue(name, callback, regExp, value) {
    // const stateValue = this.state[name];
    if (regExp.test(value)) {
      this.setValue.call(this, name, callback, value)
    } else {
      this.setState((prevState) => ({
        [name]: prevState[name],
      }))
    }
  }
  /*
   * Deposit error code
   */
  depositSingleErrorCode(name, errorCode) {
    this.setState({
      [name + 'ErrorCode']: errorCode,
      [name + 'RedOrGreen']: false,
    })
  }
  /*
   * Deposit error code group
   */
  depositGroupErrorCode(errorGroup, errorCode) {
    errorCode = errorCode + ''
    for (const singleError in errorGroup) {
      if (Object.keys(errorGroup[singleError]).indexOf(errorCode) > -1) {
        const name = singleError.slice(0, -5)
        this.setState({
          [name + 'ErrorCode']: errorCode,
          [name + 'RedOrGreen']: false,
        })
        return true
      }
    }
    return false
  }
  /*
   * Deposit props
   * If value in props and state are obj or arr,
   * even the obj has same value and key, the func will also set state
   */
  depositProps(props, keyFromPropsToState) {
    const stateKeys = []
    for (const stateKey in keyFromPropsToState) {
      stateKeys.push(keyFromPropsToState[stateKey])
    }
    const needPropsArr = Object.keys(keyFromPropsToState).map((propKey) => {
      return props[propKey]
    })


    const needStateArr = stateKeys.map((stateKey) => {
      return this.state[stateKey]
    })


    const changedStates = {}


    let isSame = true
    for (let i = 0; i < stateKeys.length; i++) {
      needPropsArr[i] !== needStateArr[i] && (isSame = false)
      changedStates[stateKeys[i]] = needPropsArr[i]
    }
    if (isSame) return
    this.setState(changedStates)
  }
  /*
   * Render Error tip
   */
  renderErrorTip(errorLists, errorCode) {
    if (!errorCode) return null
    const ErrorMsg = errorLists[errorCode]
    return (
      <div className='error-tips'>
        <div className='errorIcon' />
        <div className='tip'>{ErrorMsg}</div>
      </div>
    )
  }
}
