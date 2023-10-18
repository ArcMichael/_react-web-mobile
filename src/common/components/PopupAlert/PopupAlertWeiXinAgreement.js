
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as popup from "../../actions/popup";
class PopupAlertWeiXinAgreement extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.createMarkup = this.createMarkup.bind(this);
  }
  closePopup() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }

  createMarkup() {
    const { _text } = this.props;
    return { __html: _text };
  }
  render() {
    const {  _textTitle, _textButton, _className,  } = this.props;
    return (
      <div className={_className}>
        <div className="shu_bg" onClick={this.closePopup} />
        <div className="deposit_rules_content">
          <p>{_textTitle}</p>
          <div className="words">
            <div dangerouslySetInnerHTML={this.createMarkup()} />
          </div>
          <p onClick={this.closePopup}>{_textButton}</p>
        </div>
      </div>
    );
  }
}

PopupAlertWeiXinAgreement.defaultProps = {
  _text: "",
  _textTitle: "",
  _textButton: "",
  _className: "",
  _zIndex: 101,
};

PopupAlertWeiXinAgreement.propTypes = {
  _text: PropTypes.string,
  _textTitle: PropTypes.string,
  _textButton: PropTypes.string,
  _closeCallback: PropTypes.func,
};

const mapStateToPrps = (state) => {
  const { popup_component } = state;
  let POPUP_ALERT_PARAMETERS = {};
  if (popup_component) {
    POPUP_ALERT_PARAMETERS = popup_component.POPUP_ALERT_PARAMETERS;
  }
  return Object.assign({}, POPUP_ALERT_PARAMETERS);
};

export default connect(mapStateToPrps, (dispatch) => ({
  popup: bindActionCreators(popup, dispatch),
}))(PopupAlertWeiXinAgreement);
