import React from "react";
import { connect } from "react-redux";
import isBrowser from "@/Utils/utils/isBrowser";
import { initInvoiceListData, sendInvoiceEmail } from "../../actions/myAccount";
import { popupAlert } from "../../actions/popup";
if (__DEV__ && isBrowser()) {
  require("../../../public/style/default.scss");
  require("../../../public/style/myAccountInvoiceList.scss");
}
class MyAccountInvoiceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CommonPageTitle: null,
      InvoiceListModule: null,
      CurrentComponentCommonTop: null,
      BelowPopup: null,
      PopupAlert: null,
      isVisible: false,
      id: "",
    };
    this.closeHandle = this.closeHandle.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }
  componentDidMount() {
    this.props.initInvoiceListData();
    require.ensure([], () => {
      this.setState({
        CommonPageTitle: require("../../components/CommonPageTitle").default,
        InvoiceListModule:
          require("../../components/MyAccount/MyAccountInvoiceList/index")
            .default,
        CurrentComponentCommonTop: require("../../components/CommonTop/index")
          .default,
        BelowPopup: require("../../components/BelowPopup/index").default,
        PopupAlert: require("../../components/PopupAlert/index").default,
      });
    });
  }
  closeHandle() {
    this.setState({
      isVisible: false,
      id: "",
    });
  }
  openPopup(id) {
    this.setState({
      isVisible: true,
      id,
    });
  }
  sendEmail(email) {
    // 根据id、email 调用接口，回调中打开弹窗提示接口返回信息
    const { sendInvoiceEmail, popupAlert } = this.props;
    sendInvoiceEmail({ email, invoiceId: this.state.id }, (json) => {
      if (json && json.errorMessage) {
        popupAlert(1, "PopupToast", {
          _text: json.errorMessage,
          _autoClose: true,
        });
      } else {
        popupAlert(1, "PopupAlertDefault", {
          _autoClose: true,
          _ox: true,
          _mainText: "提交成功",
          _text: "发票会在三天内发送到您邮箱",
        });
      }
      this.setState({
        isVisible: false,
        id: "",
      });
    });
  }
  render() {
    const {
      CommonPageTitle,
      InvoiceListModule,
      CurrentComponentCommonTop,
      BelowPopup,
      PopupAlert,
      isVisible,
    } = this.state;
    const { invoiceListData } = this.props;
    return (
      <div className="myAccount_invoicelist">
        {CurrentComponentCommonTop && <CurrentComponentCommonTop />}
        {CommonPageTitle && (
          <CommonPageTitle _isBack={true} _title="发票详情" />
        )}
        {InvoiceListModule && (
          <InvoiceListModule
            _data={invoiceListData}
            _clickCallback={this.openPopup}
          />
        )}
        {BelowPopup && isVisible && (
          <BelowPopup
            component="PopupForEmail"
            _title="发票下载"
            _closeHandle={this.closeHandle}
            _clickCallback={this.sendEmail}
          />
        )}
        {PopupAlert && <PopupAlert />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { myAccount } = state;
  const { invoiceListData } = myAccount;
  return {
    invoiceListData,
  };
};
export default connect(mapStateToProps, {
  initInvoiceListData,
  sendInvoiceEmail,
  popupAlert,
})(MyAccountInvoiceList);
