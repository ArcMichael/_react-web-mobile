import React, { Component } from "react";
import CommonPageTitle from "../../components/CommonPageTitle";
import isBrowser from "@/Utils/utils/isBrowser";
import InfoRow from "../../components/InfoRow";
import InvoiceDetailSelectPopup from "./components/InvoiceDetailSelectPopup";
import Button from "../../components/Button";
import { Portal, Order } from "../../lib/BLL";
import InvoiceDetail from "./components/InvoiceDetail";
import Message from "../../components/Message";
import InvoiceTitleValidators from "./components/InvoiceDetail/validators";
import { urlGetAllParams, GetParamsByUrl, getSearchAndHostByUrl } from "../../lib/url";
import PopupAlert from "../../components/PopupAlert";

if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/Invoice.scss");
}

/**
 * @typedef {import('../../lib/BLL').ApplyInvoiceParams} ApplyInvoiceParams
 */

export class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      /**
       * @type {InvoiceTitleDTO|null}
       */
      invoiceTitle: null,
      /** @type {InvoiceTitleDTO | null} - description */
      defaultInvoiceTitle: null,
      redirect: "",
    };
    this.toggleVisible = this.toggleVisible.bind(this);
    this.handleFinishSelected = this.handleFinishSelected.bind(this);
    this.getRedirectAndInvoiceTitileId = this.getRedirectAndInvoiceTitileId.bind(this);
    this.isAdd = this.isAdd.bind(this);
    this.finish = this.finish.bind(this);
    this.handleApplyInvoice = this.handleApplyInvoice.bind(this);
    this.getInitInvoiceData = this.getInitInvoiceData.bind(this);
    this.getNewRedirectByInvoiceTitleId = this.getNewRedirectByInvoiceTitleId.bind(this);
  }

  componentDidMount() {
    this.getInitInvoiceData();
  }

  getInitInvoiceData() {
    const { redirect, invoiceTitleId } = this.getRedirectAndInvoiceTitileId();
    if (invoiceTitleId && Number(invoiceTitleId).toString() !== "NaN") {
      Portal.GetInvoiceTitles().then((datas) => {
        const editInvoiceData = datas.find((item) => {
          return `${item.id}` === invoiceTitleId;
        });
        this.setState({
          redirect,
          invoiceTitle: editInvoiceData,
          defaultInvoiceTitle: editInvoiceData,
        });
      });
      return;
    }
    Portal.GetDefaultInvoiceTitle().then((defaultInvoiceTitle) => {
      if (invoiceTitleId === "NO") {
        this.setState({
          defaultInvoiceTitle,
          invoiceTitle: null,
          redirect,
        });
        return;
      }
      this.setState({
        defaultInvoiceTitle,
        invoiceTitle: defaultInvoiceTitle,
        redirect,
      });
    });
  }

  getRedirectAndInvoiceTitileId() {
    let redirect = "";
    let invoiceTitleId = "";
    if (typeof window !== "undefined") {
      redirect = urlGetAllParams(window.location).redirect;
      if (redirect) {
        const { search } = getSearchAndHostByUrl(redirect);
        invoiceTitleId = GetParamsByUrl(search).invoiceTitleId;
      }
    }
    return {
      redirect,
      invoiceTitleId,
    };
  }

  toggleVisible() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  isAdd() {
    const { invoiceTitle, defaultInvoiceTitle } = this.state;
    const { id, name, taxNo } = invoiceTitle;
    if (!id) {
      return true;
    }
    if (id && id === defaultInvoiceTitle.id) {
      if (name !== defaultInvoiceTitle.name) {
        return true;
      }
      if (taxNo !== defaultInvoiceTitle.taxNo) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param {number} id 发票抬头id
   */
  successRedirect = (id, msg) => {
    if (typeof id === "number") {
      const newRedirect = this.getNewRedirectByInvoiceTitleId(id);
      if (newRedirect) {
        let message = "",
          splitMsg = [];
        if (msg) {
          splitMsg = msg.split(" ");
        }
        if (splitMsg.length > 0) {
          message = (
            <div className="issue-success-msg" style={{ whiteSpace: "noWrap" }}>
              {splitMsg.map((msgs, index) => {
                return <div key={`msg-${index}`}>{msgs}</div>;
              })}
            </div>
          );
        }
        Message({
          message,
          duration: 3000,
          _ox: true,
          onMessageClose: () => {
            window.location.href = newRedirect;
          },
        });
      }
    }
  };

  /**
   * @param {InvoiceTitleDTO} invoiceTitle
   */
  handleModifyInvoiceTitle = (invoiceTitle) => {
    const { id, ...newInvoiceTitle } = invoiceTitle;
    return new Promise((resolve) => {
      if (this.isAdd()) {
        Portal.AddInvoiceTitle(newInvoiceTitle)
          .then((res) => {
            if (typeof res === "number") {
              resolve(res);
            }
          })
          .catch((message) => {
            Message({
              message: message,
            });
          });
      } else {
        Portal.EditInvoiceTitle(invoiceTitle)
          .then((res) => {
            if (res) {
              resolve(invoiceTitle.id);
            }
          })
          .catch((message) => {
            Message({
              message: message,
            });
          });
      }
    });
  };

  /**
   * @param {number} invoiceId
   */
  handleApplyInvoice(invoiceId) {
    let { redirect } = this.state;
    const { orderId } = urlGetAllParams(window.location);
    return new Promise((resolve) => {
      if (orderId && redirect.match(/\/myOrderList/)) {
        /** @type {ApplyInvoiceParams} - description */
        const data = {
          orderId,
          invoiceId,
          channel: "MOBILE",
        };
        Order.Invoice.applyInvoice(data)
          .then((msg) => {
            // Message({
            //   message: msg,
            // });
            resolve(msg);
          })
          .catch((message) => {
            Message({
              message: message,
            });
          });
      } else {
        resolve();
      }
    });
  }

  /**
   * @param {number|'NO'} id 发票抬头id
   */
  getNewRedirectByInvoiceTitleId(id) {
    let { redirect } = this.state;
    let newRedirect = "";
    if (redirect.match(/myOrderList/)) {
      return redirect;
    }
    if (redirect) {
      const { search, host } = getSearchAndHostByUrl(redirect);
      const params = GetParamsByUrl(search);
      if (params.invoiceTitleId) {
        newRedirect = `${host}?`;
        const keys = Object.keys(params);
        keys.forEach((key, index) => {
          const value = key === "invoiceTitleId" ? id : params[key];
          if (index === keys.length - 1) {
            newRedirect += `${key}=${value}`;
          } else {
            newRedirect += `${key}=${value}&`;
          }
        });
      } else {
        newRedirect = `${this.state.redirect}&invoiceTitleId=${id}`;
      }
    }
    return newRedirect;
  }

  /**
   * 1.不开具发票
   * 2.开具发票提交
   *    2.1 从checkout页面过来， 只需创建和更新发票抬头
   *    2.2 从订单列表页过来，
   *        2.2.1 创建和更新发票抬头
   *        2.2.2 申请开票
   */
  finish() {
    const { invoiceTitle } = this.state;
    // 1.不开具发票
    if (!invoiceTitle) {
      window.location.href = this.getNewRedirectByInvoiceTitleId("NO");
      return;
    }
    // 2.开具发票提交
    const msg = InvoiceTitleValidators.InvoiceValidator(invoiceTitle);
    if (msg) {
      Message({
        message: msg,
      });
      return;
    }
    this.handleModifyInvoiceTitle(invoiceTitle).then((invoiceTitleId) => {
      this.handleApplyInvoice(invoiceTitleId).then((msg) => {
        this.successRedirect(invoiceTitleId, msg);
      });
    });
  }
  /**
   *
   * @param {invoiceTitle | null} invoiceTitle
   */
  handleFinishSelected(invoiceTitle) {
    this.setState({
      invoiceTitle,
    });
  }

  render() {
    const { invoiceTitle } = this.state;
    return (
      <div className="invoice">
        <CommonPageTitle _title="开具发票" _isBack />
        <div className="session-wrap-top">
          <InfoRow
            left="发票类型"
            onClick={this.toggleVisible}
            right={
              <span>
                <label className="label">{invoiceTitle ? "电子发票" : "本次不开具发票"}</label>
                <em className="css-icon-arrow-right" />
              </span>
            }
           />
          <InfoRow left="发票内容" right={"明细"} />
        </div>
        {invoiceTitle && (
          <InvoiceDetail
            form={invoiceTitle}
            onChange={(newInvoiceTitle) => {
              this.setState({
                invoiceTitle: newInvoiceTitle,
              });
            }}
           />
        )}
        <Button fixedBottom onClick={this.finish}>
          完成
        </Button>
        <InvoiceDetailSelectPopup
          invoiceTitle={this.state.invoiceTitle}
          active={this.state.visible}
          onClose={this.toggleVisible}
          onFinish={this.handleFinishSelected}
          defaultInvoiceTitle={this.state.defaultInvoiceTitle}
         />
        <PopupAlert />
      </div>
    );
  }
}

export default Invoice;
