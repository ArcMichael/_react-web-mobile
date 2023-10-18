import React from 'react';
import { connect } from 'react-redux';
class MyAccountInvoiceListComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sendInvoiceToEmail = this.sendInvoiceToEmail.bind(this);
  }
  sendInvoiceToEmail(id) {
    const { _clickCallback } = this.props;
    _clickCallback(id);
  }
  render() {
    const { _data } = this.props;
    return (
      <div className="myAccount_invoicelist_content">
        <ul className="myAccount_invoicelist_ul">
          {_data &&
            _data.length > 0 &&
            _data.map((item, index) => {
              let { invoiceStatus } = item;
              return (
                <li className={`${invoiceStatus === 1 ? 'success' : ''}`} key={`myAccount_invoice_list_${index}`}>
                  <p className="myAccount_invoicelist_li_title">{item.invoiceTitle}</p>
                  <p className="myAccount_invoicelist_li_second">
                    <span>电子发票</span>
                  </p>
                  <p className="myAccount_invoicelist_li_price">
                    ￥{item.invoicePrice && item.invoicePrice.toFixed(2)}
                  </p>
                  {invoiceStatus === 1 ? (
                    <div className="myAccount_invoicelist_li_email" onClick={() => this.sendInvoiceToEmail(item.id)}>
                      发送到邮箱
                    </div>
                  ) : null}
                  <div className={`myAccount_invoicelist_li_status ${invoiceStatus === 1 ? 'success' : ''}`}>
                    {item.invoiceStatusDesc}
                  </div>
                </li>
              );
            })}
        </ul>
        <p className="myAccount_invoicelist_tips">如有任何问题，请致电400-670-0055</p>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};
export default connect(mapStateToProps, {})(MyAccountInvoiceListComp);
