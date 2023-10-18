import React from 'react';
import BaseInput from '../AtomsInput/Input/BaseInput';

class PopupForEmail extends React.Component {
  constructor(props){
    super(props);
    this.state={
      isEnable:false,
      value:''
    }
    this.onClickHandle = this.onClickHandle.bind(this);
    this.onChangeHandle = this.onChangeHandle.bind(this);
  }
  onClickHandle(){
    const {_clickCallback} = this.props;
    // 校验通过
    if(this.state.isEnable){
      _clickCallback(this.state.value);
    }
  }
  onChangeHandle(value){
    let reg = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
    let isEnable = false;
    if(reg.test(value)){
      isEnable = true
    }
    this.setState({
      value,
      isEnable
    })
  }
  render(){
    return <div className='myAccount_invoicelist_popup_email'>
      <BaseInput _placeholder='请填写您的邮箱地址' _getValue ={(value)=>this.onChangeHandle(value)}   _className='myAccount_invoicelist_popup_email_input'/>
      <div className='myAccount_invoicelist_popup_email_tips'>
        <p>
          提交成功后系统会在3天后发送邮件，请勿重复提交
        </p>
        <p>您也可以在电脑订单详情直接下载PDF</p>
      </div>
      <div className={`myAccount_invoicelist_popup_email_button ${this.state.isEnable?'':'disabled'}`} onClick={this.onClickHandle}>
        提交申请
      </div>
    </div>
  }
}



export default PopupForEmail