import React, { Component } from "react";
import Radio from "../../../../components/FormComponents/Radio";
import BottomPopup from "../../../../components/BottomPopup";
import InfoRow from "../../../../components/InfoRow";
import { InvoiceTitleDTO } from "../../../../lib/BLL";

/**
 * 核对订单-明细选择
 * @typedef {{
 * invoiceTitle: InvoiceTitleDTO;
 * defaultInvoiceTitle: InvoiceTitleDTO
 * active: boolean;
 * onClose:Function;
 * onFinish:Function;
 * }} InvoiceDetailSelectPopupProps
 * @extends {React.Component<InvoiceDetailSelectPopupProps>}
 */
export class InvoiceDetailSelectPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /** @type {InvoiceTitleDTO | null} - description */
      invoiceTitle: null,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   *
   * @param {InvoiceDetailSelectPopupProps} nextProps
   * @param {} nextState
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.invoiceTitle !== nextProps.invoiceTitle) {
      this.setState({
        invoiceTitle: nextProps.invoiceTitle,
      });
    }
  }

  /**
   *
   * @param {InvoiceTitleDTO | null} invoiceTitle
   */
  handleSelect(invoiceTitle) {
    return () => {
      this.setState({
        invoiceTitle,
      });
    };
  }

  handleSubmit() {
    if (this.props.onFinish) {
      this.props.onFinish(this.state.invoiceTitle);
    }
  }

  render() {
    return (
      <div>
        <BottomPopup
          visible={this.props.active}
          onOk={this.handleSubmit}
          onClose={this.props.onClose}
          title="发票类型"
        >
          <InfoRow
            onClick={this.handleSelect(
              new InvoiceTitleDTO(this.props.defaultInvoiceTitle)
            )}
            left="电子发票"
            right={<Radio checked={Boolean(this.state.invoiceTitle)} />}
           />
          <InfoRow
            onClick={this.handleSelect(null)}
            left="本次不开具发票"
            right={<Radio checked={!this.state.invoiceTitle} />}
           />
        </BottomPopup>
      </div>
    );
  }
}

export default InvoiceDetailSelectPopup;
