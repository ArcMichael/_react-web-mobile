
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as popup from "../../actions/popup";
import { downLoadApp } from "../../Utils/index";
class PopupAlertDownLoadApp extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
  }
  closePopup() {
    const { _closeCallback } = this.props;
    _closeCallback && _closeCallback();
  }
  render() {
    const { _hrefLink, _zIndex } = this.props;
    return (
      <div className="common-downLoad-app" style={{ zIndex: _zIndex }}>
        <div className="content">
          <a
            className="btn-download"
            href={_hrefLink}
            onClick={() => {
              downLoadApp();
            }}
          />
          <a className="btn-close" href="#" onClick={this.closePopup} />
        </div>
      </div>
    );
  }
}

PopupAlertDownLoadApp.defaultProps = {
  _hrefLink: "",
  _className: "",
  _zIndex: 101,
};

PopupAlertDownLoadApp.propTypes = {
  _hrefLink: PropTypes.string,
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
}))(PopupAlertDownLoadApp);
