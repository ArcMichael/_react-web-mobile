import React from "react";
import ReactDOM from "react-dom";
import MessageDialog from "./MessageDialog";

/**
 *
 * @param {import('./MessageDialog').AlertComponentProps & { duration?:number;autohide?:boolean;onMessageClose?:() => {};}} options
 */
const Message = (options) => {
  const div = document.createElement("div");
  div.style = "position: fixed; top:0;left:0; width:100%; height:100%;z-index:1";
  document.body.appendChild(div);

  const close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
      if (options.onMessageClose) {
        options.onMessageClose();
      }
    }
  };

  const render = () => {
    const { duration = 1000, autohide = true, onMessageClose, ...props } = options;
    setTimeout(() => {
      ReactDOM.render(<MessageDialog {...props} />, div);
      if (autohide) {
        setTimeout(() => {
          close();
        }, duration);
      }
    });
  };

  render();
  return {
    close,
  };
};

export default Message;
