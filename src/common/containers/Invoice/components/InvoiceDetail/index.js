import React, { Component } from 'react';
import {  InvoiceType, InvoiceIsDefault } from '../../../../lib/BLL';
import InfoRow from '../../../../components/InfoRow';
import Radio from '../../../../components/FormComponents/Radio';
import Switch from '../../../../components/FormComponents/Switch';
import { getStringByteLength } from '../../../../lib/Tools';

const RadioGroup = Radio.RadioGroup;
/**
 * 核对订单-开具发票明细
 * @typedef {{
 * form: InvoiceTitleDTO;
 * onChange:(form:InvoiceTitleDTO) => void;
 * }} InvoiceDetailProps
 * @extends {React.Component<InvoiceDetailProps>}
 */
export class InvoiceDetail extends Component {
  /**
   *
   * @param {InvoiceDetailProps} props
   */
  constructor(props) {
    super(props);
    this.handleChangeIsDefault = this.handleChangeIsDefault.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeTaxNo = this.handleChangeTaxNo.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.isAccordWithRule = this.isAccordWithRule.bind(this);
  }

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  handleChangeTaxNo(e) {
    let newVal = e.target.value;
    if (newVal && !/^[\da-z0-9A-Z]+$/.test(newVal)) {
      return;
    }
    if (newVal && newVal.length > 18) {
      newVal = newVal.slice(0, 18);
    }

    const { form, onChange } = this.props;
    onChange({
      ...form,
      taxNo: newVal,
    });
  }

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  handleAddress(e) {
    let newVal = e.target.value;
    if (newVal) {
      const byteLen = getStringByteLength(newVal);
      if (byteLen > 100) {
        return;
      }
    }
    if (!this.isAccordWithRule(newVal)) return;
    const { form, onChange } = this.props;
    onChange({
      ...form,
      address: newVal,
    });
  }

  handleInputChange = type => {
    return e => {
      if (!this.isAccordWithRule(e.target.value)) return;
      const { form, onChange } = this.props;
      onChange({
        ...form,
        [type]: e.target.value,
      });
    };
  };

  /**
   *
   * @param {typeof InvoiceType} type
   */
  handleChangeType(type) {
    const { form, onChange } = this.props;
    const newForm = {
      ...form,
      type,
    };
    newForm.id = undefined;
    if (type === InvoiceType.corporate) {
      newForm.taxNo = '';
      newForm.bankAccount = '';
      newForm.bankName = '';
      newForm.address = '';
      newForm.tel = '';
    }
    onChange(newForm);
  }
  /**
   * @param {boolean} isDefault
   */
  handleChangeIsDefault(isDefault) {
    const { form, onChange } = this.props;
    onChange({
      ...form,
      isDefault: isDefault ? InvoiceIsDefault.yes : InvoiceIsDefault.no,
    });
  }

  /**
   * @param {string} value
   */
  isAccordWithRule(value) {
    let reg = /^[,.~#()_\- \u4e00-\u9FFF \uff0c \u3002 \u00b7 \uff5e \uff03 \uff08 \uff09  a-zA-Z0-9]+$/;
    if (!value || reg.test(value)) {
      return true;
    }
    return false;
  }

  render() {
    const { form } = this.props;
    return (
      <div className="session-wrap-top">
        <InfoRow
          left="抬头类型"
          right={
            <RadioGroup test={1}>
              <Radio
                label="个人或事业单位"
                style={{
                  marginRight: '10px',
                }}
                onClick={() => {
                  this.handleChangeType(InvoiceType.personal);
                }}
                checked={form.type === InvoiceType.personal}
               />
              <Radio
                label="企业"
                onClick={() => {
                  this.handleChangeType(InvoiceType.corporate);
                }}
                checked={form.type === InvoiceType.corporate}
               />
            </RadioGroup>
          }
         />
        <InfoRow
          left="发票抬头"
          right={
            <input placeholder="请输入抬头名称" value={form.name} onChange={this.handleInputChange('name')} />
          }
         />
        {/* 以下是企业类型属性 */}
        {form.type === InvoiceType.corporate && (
          <div>
            <InfoRow
              left="税号"
              right={
                <input
                  placeholder="纳税人识别号或社会统一征信代码"
                  value={form.taxNo}
                  onChange={this.handleChangeTaxNo}
                 />
              }
            />
            <InfoRow
              left="开户银行"
              right={
                <input placeholder="选填" value={form.bankName} onChange={this.handleInputChange('bankName')} />
              }
            />

            <InfoRow
              left="银行账号"
              right={
                <input
                  placeholder="选填"
                  value={form.bankAccount}
                  onChange={this.handleInputChange('bankAccount')}
                 />
              }
            />
            <InfoRow
              left="企业地址"
              right={<input placeholder="选填" value={form.address} onChange={this.handleAddress} />}
            />
            <InfoRow
              left="企业电话"
              right={
                <input
                  placeholder="选填"
                  value={form.tel}
                  type="number"
                  onChange={this.handleInputChange('tel')}
                 />
              }
            />
          </div>
        )}
        <InfoRow
          left="设为默认抬头"
          right={
            <Switch value={form.isDefault === InvoiceIsDefault.yes} onChange={this.handleChangeIsDefault} />
          }
        />
      </div>
    );
  }
}

export default InvoiceDetail;
