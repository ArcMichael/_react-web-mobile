import React, { useEffect } from "react";
import { isBrowser } from "@/lib/get-isClient";

if (__DEV__ && isBrowser()) {
  require("../style/popup.scss");
}
interface Props {
  _className?: string;
  _text: string;
  _closeCallback: Function;
  _autoClose: boolean;
  _totalCount?: number;
  _show: boolean;
}

const PopupToast: React.FunctionComponent<Props> = (props) => {
  const { _className, _text, _autoClose, _totalCount, _show, _closeCallback } =
    props;

  const autoClosePopup = (totalCount: number) => {
    setTimeout(() => {
      _closeCallback(false);
    }, totalCount);
  };
  useEffect(() => {
    _autoClose && autoClosePopup(_totalCount ? _totalCount : 2000);
  }, [_show]);
  return (
    <div>
      {_show && (
        <div className={"popup-toast " + _className}>
          <p>{_text}</p>
        </div>
      )}
    </div>
  );
};

export default PopupToast;
