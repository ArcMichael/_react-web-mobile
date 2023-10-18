import React, { Component } from "react";
import ReactDOM from "react-dom";

/**
 * @typedef {{
   zIndex?:number; 
   className?:string;
   visible?:boolean;
  }} ModalProps
 */

/**
 * @extends {React.Component<ModalProps>}
 */
export default class Modal extends Component {
  static defaultProps = {
    visible: false,
  };
  /** @type {HTMLDivElement} - Modal container */
  el;
  constructor(props) {
    super(props);
    this.initContainer = this.initContainer.bind(this);
    this.addNode = this.addNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.state = {
      visible: this.props.visible,
    };
    this.initContainer();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.setState({
        visible: nextProps.visible,
      });
    }
  }

  componentDidMount() {
    const { visible } = this.state;
    if (visible) {
      this.addNode();
    }
  }
  componentWillUnmount() {
    this.removeNode();
  }
  componentDidUpdate() {
    const { visible } = this.state;
    if (visible) {
      this.addNode();
    } else {
      this.removeNode();
    }
  }

  initContainer() {
    if (typeof window !== "undefined") {
      this.el = document.createElement("div");
      this.el.style = `position: fixed;top:0;left:0;width:100%;height:100%;background-color: #fff;z-index:${
        this.props.zIndex || 1000
      }`;
      this.el.className = `modal-container ${this.props.className || ""}`;
    }
  }

  addNode() {
    document.body.appendChild(this.el);
  }
  removeNode() {
    try {
      document.body.removeChild(this.el);
    } catch (error) {}
  }

  render() {
    return this.el ? (
      ReactDOM.createPortal(this.props.children, this.el)
    ) : (
      <div />
    );
  }
}
