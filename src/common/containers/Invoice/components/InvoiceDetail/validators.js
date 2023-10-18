import { InvoiceType } from '../../../../lib/BLL';

export default class InvoiceTitleValidators {
  static ErrorMsg = {
    name: '请输入发票抬头',
    taxNo: '请确认您的税号是否正确',
    required: '请检查必填项',
  };

  /**
   * @param {import('../../../../lib/BLL').InvoiceTitleDTO} form
   * @return {string|null}
   */
  static InvoiceValidator(form) {
    const isRequired = InvoiceTitleValidators.ValidFieldRequired(form);
    if (isRequired) {
      return isRequired;
    }
    const { type } = form;
    if (type === InvoiceType.corporate) {
      const validTaxNo = InvoiceTitleValidators.ValidTaxNo(form.taxNo);
      if (validTaxNo) return validTaxNo;
    }
    return null;
  }

  /**
   * @param {import('../../../../lib/BLL').InvoiceTitleDTO} form
   * @return {string|null}
   */
  static ValidFieldRequired(form) {
    const { type } = form;

    if (!form.name) {
      return InvoiceTitleValidators.ErrorMsg.required;
    }
    if (type === InvoiceType.corporate) {
      if (!form.taxNo) {
        return InvoiceTitleValidators.ErrorMsg.required;
      }
    }

    return null;
  }
  /**
   *
   * 企业税号验证：
   *     1. 仅限数字或者大小写字母，验证长度仅为18位，
   *     2. 不足18位时提示：请您确认税号是否正确！
   *     3. 超过18位时，第19位不能输入。
   *     4. 且限制同一字符重复，如000000000000000000
   * @param {string|null} taxNo
   * @return {string|null} - description
   */
  static ValidTaxNo(taxNo) {
    if (!taxNo || taxNo.length !== 18) {
      return InvoiceTitleValidators.ErrorMsg.taxNo;
    }
    const firstChar = taxNo[0];
    const reg = new RegExp(firstChar, 'g');
    if (taxNo.match(reg).length === taxNo.length) {
      return InvoiceTitleValidators.ErrorMsg.taxNo;
    }
    return null;
  }
}
