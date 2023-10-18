class buyAgainAnimation {
  constructor(dom, cb) {
    let clientRects = dom.getClientRects();
    this.start = {
      // 起点坐标
      top: clientRects[0].top + clientRects[0].height / 2,
      left: clientRects[0].left + clientRects[0].width / 2,
    };

    this.first = {
      // 第一步放大后坐标
      top: clientRects[0].top - clientRects[0].height / 2,
      left: clientRects[0].left + clientRects[0].width,
    };

    let cart = document.querySelectorAll(".suspension-cart")[0];
    let cartRects = cart.getClientRects();

    this.topzb = {
      // 最高点坐标
      top: Math.min(clientRects[0].top, cartRects[0].top) - 50,
      left: (cartRects[0].left - clientRects[0].left) / 2 + clientRects[0].left,
    };

    this.end = {
      // 终点坐标
      top: cartRects[0].top,
      left: cartRects[0].left,
    };
    this.addStyle(() => this.createImage(dom, cb));
  }
  addStyle(fn) {
    var style = document.createElement("style");
    style.type = "text/css";
    let cssText = `@keyframes addToCartFirst{
          from {
        width:0rem;
        height:0rem;
        top:${this.start.top}px;
        left:${this.start.left}px;
          } to {
        width:1rem;
        height:1rem;
        top:${this.first.top}px;
        left:${this.first.left}px;
          }
      }
      @keyframes pause{
        from{
          
          width:1rem;
          height:1rem;
      top:${this.first.top}px;
      left:${this.first.left}px;
        }
        to{
          width:1rem;
          height:1rem;
          
      top:${this.first.top}px;
      left:${this.first.left}px;
        }

      }
      @keyframes shake{
        0%{
          width:1rem;
          height:1rem;
      
      top:${this.first.top}px;
      left:${this.first.left}px;
      }
      25%{
        width:0.8rem;
        height:0.8rem;
      top:${this.first.top}px;
      left:${this.first.left}px;
      }
      50%{
        width:1rem;
        height:1rem;
      top:${this.first.top}px;
      left:${this.first.left}px;
      }
      75%{
        width:0.8rem;
        height:0.8rem;
      top:${this.first.top}px;
      left:${this.first.left}px;
      }
      100%{
        width:1rem;
        height:1rem;
      top:${this.first.top}px;
      left:${this.first.left}px;
      }
      }
      @keyframes addToCartSecondX{
        from {
          width:1rem;
          height:1rem;
      left:${this.first.left}px;
        } to {
          width:1rem;
          height:1rem;
      left:${this.topzb.left}px;
        }
    }

    @keyframes addToCartSecondY{
        from {
          width:1rem;
          height:1rem;
      top:${this.first.top}px;
        } to {
          width:1rem;
          height:1rem;
      top:${this.topzb.top}px;
        }
    }

    @keyframes addToCartThirdX{
        from {
          width:1rem;
          height:1rem;
      left:${this.topzb.left}px;
        } to {
          width:1rem;
          height:1rem;
      left:${this.end.left}px;
        }
    }

    @keyframes addToCartThirdY{
        from {
          width:1rem;
          height:1rem;
      top:${this.topzb.top}px;
        } to {
          width:0.3rem;
          height:0.3rem;
      top:${this.end.top}px;
        }
    }`;
    try {
      style.appendChild(document.createTextNode(cssText));
    } catch (ex) {
      style.styleSheet.cssText = cssText; //针对IE
    }
    style.onload = () => {
      fn();
    };
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  }
  createImage(dom, cb) {
    this.dom = dom.cloneNode();
    this.dom.style.position = "fixed";
    let newimgs = dom.cloneNode();
    newimgs.style.position = "fixed";
    newimgs.style.top = this.start.top + "px";
    newimgs.style.left = this.start.left + "px";
    newimgs.style.width = "0rem";
    newimgs.style.height = "0rem";
    newimgs.style.borderRadius = "50%";
    newimgs.style.border = "0.02rem silid #fff";
    newimgs.style.transition = "0.5s";
    newimgs.style["z-index"] = 11;
    newimgs.style["animation"] =
      "addToCartFirst 0.2s linear,shake 0.4s 0.2s linear,pause 0.3s 0.6s linear,addToCartSecondX 0.1s 0.9s linear ,addToCartSecondY 0.1s 0.9s ease-out,addToCartThirdX 0.3s 1s linear, addToCartThirdY 0.3s 1s ease-in";
    newimgs.addEventListener("webkitAnimationEnd", (e) => {
      if (e.animationName === "addToCartThirdY") {
        cb && cb();
      }
    });
    document.querySelector("body").append(newimgs);
  }
}

export default buyAgainAnimation;
